import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { addDays, format, startOfWeek } from 'date-fns';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { WeekdayPicker } from '@components/weekday-picker/WeekdayPicker';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { HabitTask } from '@db/models/HabitTask';
import { TaskCompletion } from '@db/models/TaskCompletion';
import { getWeekdayIndex } from '@utils/date-utils';
import { useHabitActions } from '../habit-actions-hooks';
import { TaskItem } from './TaskItem';

interface HabitCardTrackingProps {
  item: Habit;
}

const DATE_FORMAT = 'yyyy-MM-dd';

export const HabitCardTracking: FC<HabitCardTrackingProps> = function (props) {
  const { translations } = useLanguage();
  const actions = useHabitActions();

  const [tasks, setTasks] = useState<HabitTask[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletion[]>([]);

  useEffect(() => {
    const sub = props.item.sortedTasks.observe().subscribe(setTasks);
    return () => sub.unsubscribe();
  }, [props.item]);

  useEffect(() => {
    const sub = props.item.taskCompletions.observe().subscribe(setTaskCompletions);
    return () => sub.unsubscribe();
  }, [props.item]);

  const today = useMemo(() => new Date(), []);
  const todayIndex = useMemo(() => getWeekdayIndex(today), [today]);
  const weekDates = useMemo(() => buildWeekDates(today), [today]);

  const [activeDay, setActiveDay] = useState<number>(todayIndex);

  const trackingMode = props.item.trackingMode ?? 'daily';
  const targetDate = trackingMode === 'weekly' ? weekDates[activeDay - 1] : format(today, DATE_FORMAT);

  const completedTaskIds = useMemo(() => {
    const ids = new Set<string>();
    taskCompletions.forEach((record) => {
      if (record.date === targetDate) ids.add(record.taskId);
    });
    return ids;
  }, [taskCompletions, targetDate]);

  const renderTask = useCallback(
    (task: HabitTask) => {
      return (
        <TaskItem
          key={task.id}
          item={task}
          completed={completedTaskIds.has(task.id)}
          onPress={() => actions.toggleTaskCompletion(props.item.id, task.id, targetDate)}
        />
      );
    },
    [completedTaskIds, actions, props.item.id, targetDate]
  );

  return (
    <View style={sharedLayoutStyles.gap8}>
      {trackingMode === 'weekly' && (
        <WeekdayPicker
          mode={'active-select'}
          selectedDays={props.item.parsedDaysOfWeek}
          activeDay={activeDay}
          onDayPress={setActiveDay}
        />
      )}
      <Typography
        size={14}
        weight={600}
        colorVariant={'textSecondary'}>
        {translations.habits.planned}
      </Typography>
      <View style={sharedLayoutStyles.gap8}>{tasks.map(renderTask)}</View>
    </View>
  );
};

function buildWeekDates(today: Date): string[] {
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(format(addDays(monday, i), DATE_FORMAT));
  }
  return dates;
}
