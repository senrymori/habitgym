import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ExerciseHistoryRecord } from '../gym-program-history-types';

interface ExerciseHistoryItemProps {
  item: ExerciseHistoryRecord;
}

export const ExerciseHistoryItem: FC<ExerciseHistoryItemProps> = function (props) {
  const { translations } = useLanguage();

  if (props.item.type === 'strength') {
    const { title, setsDone, setsTotal, weightKg } = props.item;
    const weightPart = weightKg !== null ? ` • ${weightKg} ${translations.track.weight.kg}` : '';
    const text = `${title} • ${setsDone}/${setsTotal}${weightPart}`;
    return (
      <Typography size={14}>{text}</Typography>
    );
  }

  const { title, durationMin, caloriesKcal, completed } = props.item;
  const titleLine = `${title} • ${durationMin} ${translations.gym.minutes}`;
  const caloriesLine = translations.gym.history.caloriesBurned.replace('{count}', String(caloriesKcal));

  return (
    <View style={sharedLayoutStyles.gap4}>
      <Typography size={14}>{titleLine}</Typography>
      {completed && (
        <Typography
          size={12}
          colorVariant={'textSecondary'}>
          {caloriesLine}
        </Typography>
      )}
    </View>
  );
};
