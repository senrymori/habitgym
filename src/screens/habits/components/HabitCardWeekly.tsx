import { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { addDays, format, startOfWeek } from 'date-fns';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { WeekdayPicker } from '@components/weekday-picker/WeekdayPicker';
import { Habit } from '@db/models/Habit';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { useHabitActions } from '../habit-actions-hooks';

interface HabitCardWeeklyProps {
  item: Habit;
}

export const HabitCardWeekly: FC<HabitCardWeeklyProps> = function (props) {
  const { toggleHabitCompletion } = useHabitActions();
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const subscription = props.item.completions.observe().subscribe(setCompletions);
    return () => subscription.unsubscribe();
  }, [props.item]);

  const weekDates = useMemo(() => buildWeekDates(new Date()), []);
  const selectedDays = props.item.parsedDaysOfWeek;

  const completedDays = useMemo(() => {
    const result: number[] = [];
    weekDates.forEach((dateStr, index) => {
      const found = completions.some((completion) => completion.date === dateStr);
      if (found) result.push(index + 1);
    });
    return result;
  }, [completions, weekDates]);

  return (
    <View style={sharedLayoutStyles.gap12}>
      <WeekdayPicker
        mode={'toggle-completion'}
        selectedDays={selectedDays}
        completedDays={completedDays}
        onDayPress={(day) => {
          const dateStr = weekDates[day - 1];
          toggleHabitCompletion(props.item.id, dateStr);
        }}
      />
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
        <Typography size={18}>{'🔥'}</Typography>
        <Typography
          size={16}
          weight={500}>
          {`${completedDays.length}/${selectedDays.length}`}
        </Typography>
      </View>
    </View>
  );
};

function buildWeekDates(today: Date): string[] {
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(format(addDays(monday, i), 'yyyy-MM-dd'));
  }
  return dates;
}
