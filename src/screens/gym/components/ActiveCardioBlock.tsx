import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ActiveExerciseInfo } from '../gym-workout-active-types';
import { formatSecondsToMmSs } from '../gym-workout-active-utils';

interface ActiveCardioBlockProps {
  item: ActiveExerciseInfo;
  onComplete: () => void;
  onSkipExercise: () => void;
  isLastExercise: boolean;
}

export const ActiveCardioBlock: FC<ActiveCardioBlockProps> = function (props) {
  const { translations } = useLanguage();
  const totalDurationMs = (props.item.duration ?? 0) * 60 * 1000;
  const startedAtRef = useRef<number>(Date.now());
  const completedRef = useRef<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(Math.ceil(totalDurationMs / 1000));

  // Reset when the exercise itself changes (parent remounts via key, but guard anyway).
  const exerciseId = props.item.programExerciseId;
  useEffect(() => {
    startedAtRef.current = Date.now();
    completedRef.current = false;
    setSecondsLeft(Math.ceil(totalDurationMs / 1000));
  }, [exerciseId, totalDurationMs]);

  const onCompleteRef = useRef(props.onComplete);
  useEffect(() => {
    onCompleteRef.current = props.onComplete;
  }, [props.onComplete]);

  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((startedAtRef.current + totalDurationMs - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onCompleteRef.current();
    }
  }, [totalDurationMs]);

  useEffect(() => {
    if (totalDurationMs <= 0) return;
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tick, totalDurationMs, exerciseId]);

  useEffect(() => {
    const handler = (state: AppStateStatus) => {
      if (state === 'active') tick();
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, [tick]);

  return (
    <Card style={sharedLayoutStyles.gap16}>
      <Typography
        weight={700}
        size={18}>
        {props.item.exerciseTitle}
      </Typography>
      <View style={sharedLayoutStyles.center}>
        <Typography
          weight={800}
          size={32}>
          {formatSecondsToMmSs(secondsLeft)}
        </Typography>
      </View>
      {!props.isLastExercise && (
        <ButtonText
          text={translations.gym.skipExercise}
          variant={'outline'}
          colorVariant={'contrast'}
          onPress={props.onSkipExercise}
        />
      )}
    </Card>
  );
};
