import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { calculateStreak, formatStreak } from '@utils/date-utils';

interface HabitCardCounterProps {
  item: Habit;
}

export const HabitCardCounter: FC<HabitCardCounterProps> = function (props) {
  const { translations, currentLanguage } = useLanguage();

  const startDate = props.item.startDate ?? props.item.createdAt;
  const streak = calculateStreak(startDate, new Date());
  const streakText = formatStreak(streak, translations, currentLanguage);

  return (
    <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
      <Typography size={18}>{'🔥'}</Typography>
      <Typography
        size={16}
        weight={500}>
        {streakText}
      </Typography>
    </View>
  );
};
