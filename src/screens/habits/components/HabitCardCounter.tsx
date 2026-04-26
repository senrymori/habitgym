import { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { format, startOfDay, subDays } from 'date-fns';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { calculateStreak, formatStreak } from '@utils/date-utils';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

const DATE_FORMAT = 'yyyy-MM-dd';

interface HabitCardCounterProps {
  item: Habit;
}

export const HabitCardCounter: FC<HabitCardCounterProps> = function (props) {
  const { translations, currentLanguage } = useLanguage();
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const subscription = props.item.completions.observe().subscribe(setCompletions);
    return () => subscription.unsubscribe();
  }, [props.item]);

  const streakText = useMemo(() => {
    const today = new Date();
    const failureDates = new Set(completions.filter((c) => !c.completed).map((c) => c.date));
    const startBoundary = props.item.startDate ? startOfDay(props.item.startDate) : null;
    let cursor = today;
    let streakDays = 0;
    while (true) {
      if (startBoundary && cursor < startBoundary) break;
      if (failureDates.has(format(cursor, DATE_FORMAT))) break;
      streakDays += 1;
      cursor = subDays(cursor, 1);
    }
    if (streakDays === 0) {
      return formatStreak({ years: 0, months: 0, days: 0 }, translations, currentLanguage);
    }
    const start = subDays(today, streakDays);
    const streak = calculateStreak(start, today);
    return `${formatStreak(streak, translations, currentLanguage)} ${translations.habits.inARow}`;
  }, [completions, translations, currentLanguage, props.item.startDate]);

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
