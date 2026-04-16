import { FC, useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { HabitTabStackNavigationScreenProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { useHabitDetail } from './habit-detail-hooks';
import { useHabitActions } from './habit-actions-hooks';
import { HabitDetailHeader } from './components/HabitDetailHeader';
import { HabitStreakCard } from './components/HabitStreakCard';
import { HabitMonthCalendar } from './components/HabitMonthCalendar';
import { HabitDayTasksBlock } from './components/HabitDayTasksBlock';
import { TaskItem } from './components/TaskItem';

const today = new Date();
export const HabitDetailScreen: FC<HabitTabStackNavigationScreenProps<'HabitDetail'>> = function (props) {
  const { habitId } = props.route.params;
  const safeAreaStyles = useSafeAreaStyles();
  const { toggleHabitCompletion, toggleTaskCompletion } = useHabitActions();
  const { habit, tasks, completions, taskCompletions } = useHabitDetail(habitId);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const handleCalendarDayPress = useCallback(
    (dateStr: string) => {
      if (!habit) return;
      if (habit.habitType === 'counter') {
        toggleHabitCompletion(habit.id, dateStr);
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

  const completedIdsForActive = new Set(taskCompletions.filter((tc) => tc.completed).map((tc) => tc.taskId));

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

      {habit.habitType === 'tracking' && (
        <View style={sharedLayoutStyles.gap8}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              item={task}
              completed={completedIdsForActive.has(task.id)}
              onPress={() => toggleTaskCompletion(habit.id, task.id, today.toISOString())}
            />
          ))}
        </View>
      )}

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
          tasks={tasks}
          taskCompletions={taskCompletions}
        />
      )}
    </ScrollView>
  );
};
