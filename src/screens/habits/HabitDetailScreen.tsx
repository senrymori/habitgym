import { FC, useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { format, parse } from 'date-fns';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Typography } from '@ui-kits/Typography/Typography';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitTabStackNavigationScreenProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { getTasksForDate } from '@utils/date-utils';
import { useHabitDetail } from './habit-detail-hooks';
import { useHabitActions } from './habit-actions-hooks';
import { HabitDetailHeader } from './components/HabitDetailHeader';
import { HabitStreakCard } from './components/HabitStreakCard';
import { HabitMonthCalendar } from './components/HabitMonthCalendar';
import { HabitDayTasksBlock } from './components/HabitDayTasksBlock';
import { TaskItem } from './components/TaskItem';

const DATE_FORMAT = 'yyyy-MM-dd';

export const HabitDetailScreen: FC<HabitTabStackNavigationScreenProps<'HabitDetail'>> = function (props) {
  const { habitId } = props.route.params;
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const { toggleHabitCompletion, toggleCounterFailure, toggleTaskCompletion } = useHabitActions();
  const { habit, tasks, completions, taskCompletions } = useHabitDetail(habitId);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const todayDate = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => format(todayDate, DATE_FORMAT), [todayDate]);

  const todayTasks = useMemo(
    () => (habit ? getTasksForDate(tasks, habit.trackingMode, todayDate) : []),
    [tasks, habit, todayDate]
  );

  const expandedDateTasks = useMemo(() => {
    if (!habit || !expandedDate) return [];
    return getTasksForDate(tasks, habit.trackingMode, parse(expandedDate, DATE_FORMAT, new Date()));
  }, [tasks, habit, expandedDate]);

  const completedTodayIds = useMemo(
    () => new Set(taskCompletions.filter((tc) => tc.completed && tc.date === todayStr).map((tc) => tc.taskId)),
    [taskCompletions, todayStr]
  );

  const handleCalendarDayPress = useCallback(
    (dateStr: string) => {
      if (!habit) return;
      if (habit.habitType === 'counter') {
        toggleCounterFailure(habit.id, dateStr);
        return;
      }
      if (habit.habitType === 'weekly') {
        toggleHabitCompletion(habit.id, dateStr);
        return;
      }
      setExpandedDate((prev) => (prev === dateStr ? null : dateStr));
    },
    [habit]
  );

  if (!habit) {
    return <View style={safeAreaStyles.pLayoutGrow} />;
  }

  return (
    <ScrollView
      style={safeAreaStyles.pLayoutGrow}
      contentContainerStyle={[sharedLayoutStyles.gap16, sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pb24]}
      showsVerticalScrollIndicator={false}>
      <HabitDetailHeader
        icon={habit.icon}
        title={habit.title}
      />

      <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
        <HabitStreakCard
          habit={habit}
          completions={completions}
          tasks={tasks}
          taskCompletions={taskCompletions}
        />
      </View>

      {habit.habitType === 'tracking' &&
        (todayTasks.length > 0 ? (
          <View style={sharedLayoutStyles.gap8}>
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                item={task}
                completed={completedTodayIds.has(task.id)}
                onPress={() => toggleTaskCompletion(habit.id, task.id, todayStr)}
              />
            ))}
          </View>
        ) : (
          <Typography
            size={14}
            colorVariant={'textSecondary'}>
            {translations.habits.noPlansToday}
          </Typography>
        ))}

      <HabitMonthCalendar
        habit={habit}
        completions={completions}
        tasks={tasks}
        taskCompletions={taskCompletions}
        expandedDate={expandedDate}
        onDayPress={handleCalendarDayPress}
      />

      {habit.habitType === 'tracking' && expandedDate && (
        <HabitDayTasksBlock
          habitId={habit.id}
          date={expandedDate}
          tasks={expandedDateTasks}
          taskCompletions={taskCompletions}
        />
      )}
    </ScrollView>
  );
};
