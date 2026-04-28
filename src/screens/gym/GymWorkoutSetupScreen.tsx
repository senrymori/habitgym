import { FC, useMemo } from 'react';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { GymTabStackNavigationScreenProps } from '@navigation/home-tabs/gym-tab-stack/gym-tab-stack-types';
import { ProgramExerciseSetupList } from './components/ProgramExerciseSetupList';
import { RestBetweenExercisesCard } from './components/RestBetweenExercisesCard';
import { useGymWorkoutSetup, useGymWorkoutSetupActions } from './gym-workout-setup-hooks';

export const GymWorkoutSetupScreen: FC<GymTabStackNavigationScreenProps<'GymWorkoutSetup'>> = function ({
  navigation,
  route,
}) {
  const programId = route.params.programId;
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const { form, exercisesFieldArray, isReady } = useGymWorkoutSetup(programId);
  const { startWorkout } = useGymWorkoutSetupActions();
  const { handleSubmit, formState } = form;

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (values) => {
        try {
          const sessionId = await startWorkout(values, programId);
          navigation.replace('GymWorkoutActive', { sessionId });
        } catch (e) {
          console.error('[GymWorkoutSetupScreen] startWorkout failed', e);
        }
      }),
    [handleSubmit, startWorkout, programId, navigation]
  );

  const startDisabled = !isReady || formState.isSubmitting || exercisesFieldArray.fields.length === 0;

  return (
    <View style={[safeAreaStyles.ptPhLayout, sharedLayoutStyles.flex1]}>
      <Header
        isBack={true}
        title={translations.gym.startWorkout}
      />
      <NestableScrollContainer
        contentContainerStyle={[sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pv24, sharedLayoutStyles.gap16]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <FormProvider {...form}>
          <RestBetweenExercisesCard />
          <ProgramExerciseSetupList exercisesFieldArray={exercisesFieldArray} />
        </FormProvider>
        <View style={sharedLayoutStyles.flex1} />
        <ButtonText
          text={translations.gym.startWorkout}
          onPress={onSubmit}
          disabled={startDisabled}
        />
      </NestableScrollContainer>
    </View>
  );
};
