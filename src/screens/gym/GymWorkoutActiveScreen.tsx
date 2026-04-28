import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { Typography } from '@ui-kits/Typography/Typography';
import { Collapsible } from '@ui-kits/Collapsible';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { GymTabStackNavigationScreenProps } from '@navigation/home-tabs/gym-tab-stack/gym-tab-stack-types';
import { ActiveExerciseBlock } from './components/ActiveExerciseBlock';
import { ActiveCardioBlock } from './components/ActiveCardioBlock';
import { RestTimerBlock } from './components/RestTimerBlock';
import { WorkoutFinishedView } from './components/WorkoutFinishedView';
import { useGymWorkoutActive, useGymWorkoutActiveActions, useRestTimer } from './gym-workout-active-hooks';
import { getTotalSetsForExercise } from './gym-workout-active-utils';
import { estimateCardioCalories } from './gym-program-history-utils';
import { parseDecimalInput } from './gym-form-utils';

export const GymWorkoutActiveScreen: FC<GymTabStackNavigationScreenProps<'GymWorkoutActive'>> = function ({
  navigation,
  route,
}) {
  const sessionId = route.params.sessionId;
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  const { program, exercises, sets, isReady, isFinished, progress, currentExercise } = useGymWorkoutActive(sessionId);
  const { completeSet, skipSet, skipExercise, finishProgram } = useGymWorkoutActiveActions(sessionId);
  const { timer, start: startRest, skip: skipRest, clear: clearRest } = useRestTimer(sessionId);

  const [weightInput, setWeightInput] = useState<string>('');
  const [weakVibeExpanded, setWeakVibeExpanded] = useState<boolean>(false);

  // Reset weight input on exercise change.
  const exerciseId = currentExercise?.programExerciseId ?? null;
  useEffect(() => {
    if (currentExercise && currentExercise.exerciseType === 'strength') {
      setWeightInput(currentExercise.defaultWeight !== undefined ? String(currentExercise.defaultWeight) : '');
    } else {
      setWeightInput('');
    }
  }, [exerciseId, currentExercise]);

  // Trigger rest timers when progress advances.
  const prevSetsCountRef = useRef<number>(0);
  const prevExerciseIndexRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isReady || isFinished || !program) {
      // Sync refs but do not start timers when not ready.
      prevSetsCountRef.current = sets.length;
      prevExerciseIndexRef.current = progress.currentExerciseIndex;
      return;
    }
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevSetsCountRef.current = sets.length;
      prevExerciseIndexRef.current = progress.currentExerciseIndex;
      return;
    }

    const setsAdded = sets.length > prevSetsCountRef.current;
    const exerciseAdvanced = progress.currentExerciseIndex > prevExerciseIndexRef.current;
    const prevExerciseIndex = prevExerciseIndexRef.current;

    prevSetsCountRef.current = sets.length;
    prevExerciseIndexRef.current = progress.currentExerciseIndex;

    if (!setsAdded) return;

    if (exerciseAdvanced) {
      const seconds = (program.restBetweenExercises ?? 0) * 60;
      if (seconds > 0 && progress.currentExerciseIndex < exercises.length) startRest('between-exercises', seconds);
      return;
    }

    const exerciseAtPrev = exercises[prevExerciseIndex];
    if (exerciseAtPrev && exerciseAtPrev.exerciseType === 'strength') {
      const seconds = (exerciseAtPrev.restBetweenSets ?? 0) * 60;
      if (seconds > 0) startRest('between-sets', seconds);
    }
  }, [sets.length, progress.currentExerciseIndex, isReady, isFinished, program, exercises, startRest]);

  // Clear any active rest timer when the workout finishes.
  useEffect(() => {
    if (isFinished) clearRest();
  }, [isFinished, clearRest]);

  const handleClose = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const handleComplete = useCallback(() => {
    if (!currentExercise) return;
    const weight = currentExercise.exerciseType === 'strength' ? parseDecimalInput(weightInput) : undefined;
    const reps = currentExercise.exerciseType === 'strength' ? currentExercise.reps : undefined;
    const calories =
      currentExercise.exerciseType === 'cardio'
        ? estimateCardioCalories(currentExercise.duration ?? 0)
        : undefined;
    completeSet(
      currentExercise.programExerciseId,
      progress.currentSetIndex + 1,
      reps,
      weight,
      calories
    ).catch((e) => console.error('[GymWorkoutActiveScreen] completeSet failed', e));
  }, [currentExercise, weightInput, progress.currentSetIndex, completeSet]);

  const handleSkipSet = useCallback(() => {
    if (!currentExercise) return;
    skipSet(currentExercise.programExerciseId, progress.currentSetIndex + 1).catch((e) =>
      console.error('[GymWorkoutActiveScreen] skipSet failed', e)
    );
  }, [currentExercise, progress.currentSetIndex, skipSet]);

  const handleSkipExercise = useCallback(() => {
    if (!currentExercise) return;
    const total = getTotalSetsForExercise(currentExercise);
    skipExercise(currentExercise.programExerciseId, progress.currentSetIndex + 1, total).catch((e) =>
      console.error('[GymWorkoutActiveScreen] skipExercise failed', e)
    );
  }, [currentExercise, progress.currentSetIndex, skipExercise]);

  const handleFinishPress = useCallback(() => {
    Alert.alert(translations.gym.confirmFinishTitle, translations.gym.confirmFinishMessage, [
      { text: translations.common.cancel, style: 'cancel' },
      {
        text: translations.common.confirm,
        style: 'destructive',
        onPress: () => {
          finishProgram().catch((e) => console.error('[GymWorkoutActiveScreen] finishProgram failed', e));
        },
      },
    ]);
  }, [translations, finishProgram]);

  if (!isReady) {
    return <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.flex1]} />;
  }

  if (isFinished) {
    return (
      <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.flex1]}>
        <Header title={program?.title ?? ''} />
        <WorkoutFinishedView onClose={handleClose} />
      </View>
    );
  }

  const isLastExercise = progress.currentExerciseIndex >= exercises.length - 1;

  return (
    <View style={[safeAreaStyles.ptPhLayout, sharedLayoutStyles.flex1]}>
      <Header
        isBack={true}
        title={program?.title ?? ''}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pv24, sharedLayoutStyles.gap16]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {timer ? (
          <RestTimerBlock
            timer={timer}
            onSkip={skipRest}
          />
        ) : currentExercise ? (
          currentExercise.exerciseType === 'cardio' ? (
            <ActiveCardioBlock
              key={currentExercise.programExerciseId}
              item={currentExercise}
              onComplete={handleComplete}
              onSkipExercise={handleSkipExercise}
              isLastExercise={isLastExercise}
            />
          ) : (
            <ActiveExerciseBlock
              item={currentExercise}
              currentSetIndex={progress.currentSetIndex}
              weight={weightInput}
              onWeightChange={setWeightInput}
              onComplete={handleComplete}
              onSkipSet={handleSkipSet}
              onSkipExercise={handleSkipExercise}
              isLastExercise={isLastExercise}
            />
          )
        ) : null}

        <Pressable
          onPress={() => setWeakVibeExpanded((v) => !v)}
          style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8, sharedLayoutStyles.pv8]}>
          <Typography
            weight={600}
            size={16}>
            {translations.gym.weakVibe}
          </Typography>
          <Typography
            icon={weakVibeExpanded ? IconEnum.ChevronUp : IconEnum.ChevronDown}
            size={16}
            colorVariant={'textSecondary'}
          />
        </Pressable>
        <Collapsible expanded={weakVibeExpanded}>
          <View style={sharedLayoutStyles.pb8}>
            <Typography colorVariant={'textSecondary'}>{translations.gym.weakVibePlaceholder}</Typography>
          </View>
        </Collapsible>

        <View style={sharedLayoutStyles.flex1} />

        <ButtonText
          text={translations.gym.finish}
          variant={'outline'}
          colorVariant={'contrast'}
          onPress={handleFinishPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
