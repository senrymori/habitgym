import { FC, useMemo } from 'react';
import { addDays, format, startOfWeek, subDays, subWeeks } from 'date-fns';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Habit } from '@db/models/Habit';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { HabitTask } from '@db/models/HabitTask';
import { TaskCompletion } from '@db/models/TaskCompletion';
import { calculateStreak, formatStreak, getTasksForDate, getWeekdayIndex, pluralize } from '@utils/date-utils';

interface HabitStreakCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  tasks: HabitTask[];
  taskCompletions: TaskCompletion[];
}

const DATE_FORMAT = 'yyyy-MM-dd';

export const HabitStreakCard: FC<HabitStreakCardProps> = function (props) {
  const { translations, currentLanguage } = useLanguage();

  const text = useMemo(() => {
    const today = new Date();
    if (props.habit.habitType === 'counter') {
      return buildCounterStreak(props.completions, today, translations, currentLanguage);
    }
    if (props.habit.habitType === 'weekly') {
      const count = countWeeklyStreak(props.completions, props.habit.parsedDaysOfWeek, today);
      if (count === 0) return pluralize(0, translations.habits.streakWeeks, currentLanguage);
      return pluralize(count, translations.habits.streakWeeks, currentLanguage);
    }
    return buildTrackingProgress(props, today, translations);
  }, [props, translations, currentLanguage]);

  return (
    <Card
      variant={'secondary'}
      style={[sharedLayoutStyles.flex1, sharedLayoutStyles.gap4]}>
      <Typography
        size={12}
        weight={500}
        colorVariant={'textSecondary'}
        transform={'uppercase'}>
        {translations.habits.detail.streakTitle}
      </Typography>
      <Typography
        size={18}
        weight={600}>
        {text}
      </Typography>
    </Card>
  );
};

function buildCounterStreak(
  completions: HabitCompletion[],
  today: Date,
  translations: ReturnType<typeof useLanguage>['translations'],
  currentLanguage: ReturnType<typeof useLanguage>['currentLanguage']
): string {
  const completedDates = new Set(completions.filter((c) => c.completed).map((c) => c.date));
  let cursor = today;
  let streakDays = 0;
  while (completedDates.has(format(cursor, DATE_FORMAT))) {
    streakDays += 1;
    cursor = subDays(cursor, 1);
  }
  if (streakDays === 0) {
    return pluralize(0, translations.habits.streakDays, currentLanguage);
  }
  const start = subDays(today, streakDays);
  const streak = calculateStreak(start, today);
  return `${formatStreak(streak, translations, currentLanguage)} ${translations.habits.inARow}`;
}

function countWeeklyStreak(completions: HabitCompletion[], selectedDays: number[], today: Date): number {
  if (selectedDays.length === 0) return 0;
  const completedDates = new Set(completions.filter((c) => c.completed).map((c) => c.date));

  let weekStart = startOfWeek(today, { weekStartsOn: 1 });
  let count = 0;

  while (true) {
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      if (selectedDays.includes(i + 1)) {
        weekDates.push(format(day, DATE_FORMAT));
      }
    }
    const applicable = weekDates.filter((dateStr) => {
      const d = new Date(dateStr);
      return d <= today;
    });
    if (applicable.length === 0) {
      weekStart = subWeeks(weekStart, 1);
      continue;
    }
    const allDone = applicable.every((d) => completedDates.has(d));
    if (!allDone) break;
    count += 1;
    weekStart = subWeeks(weekStart, 1);
  }

  return count;
}

function buildTrackingProgress(
  props: HabitStreakCardProps,
  today: Date,
  translations: ReturnType<typeof useLanguage>['translations']
): string {
  const trackingMode = props.habit.trackingMode ?? 'daily';
  const selectedDays = props.habit.parsedDaysOfWeek;
  const todayIndex = getWeekdayIndex(today);

  if (trackingMode === 'weekly' && selectedDays.length > 0 && !selectedDays.includes(todayIndex)) {
    return translations.habits.noPlansToday;
  }

  const visibleTasks = getTasksForDate(props.tasks, props.habit.trackingMode, today);
  const total = visibleTasks.length;
  if (total === 0) return translations.habits.noPlansToday;

  const todayStr = format(today, DATE_FORMAT);
  const doneTaskIds = new Set(
    props.taskCompletions.filter((tc) => tc.date === todayStr && tc.completed).map((tc) => tc.taskId)
  );
  const done = visibleTasks.filter((t) => doneTaskIds.has(t.id)).length;

  return translations.habits.progressToday.replace('{done}', String(done)).replace('{total}', String(total));
}
