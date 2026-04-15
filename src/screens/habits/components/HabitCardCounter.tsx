import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { calculateStreak, formatStreak } from '@utils/date-utils';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

interface HabitCardCounterProps {
  item: Habit;
}

export const HabitCardCounter: FC<HabitCardCounterProps> = function (props) {
  const { translations, currentLanguage } = useLanguage();

  const startDate = props.item.startDate ?? props.item.createdAt;
  const streak = calculateStreak(startDate, new Date());
  const streakText = formatStreak(streak, translations, currentLanguage);

  return (
    <View style={[sharedLayoutStyles.rowAlignCenter]}>
      <Typography
        size={24}
        colorVariant={'textSecondary'}
        icon={IconEnum.FireFill}
      />
      <Typography
        weight={500}
        colorVariant={'textSecondary'}>
        {streakText}
      </Typography>
    </View>
  );
};
