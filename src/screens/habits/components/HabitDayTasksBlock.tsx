import { FC, useMemo } from 'react';
import { View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitTask } from '@db/models/HabitTask';
import { TaskCompletion } from '@db/models/TaskCompletion';
import { useHabitActions } from '../habit-actions-hooks';
import { TaskItem } from './TaskItem';

interface HabitDayTasksBlockProps {
  habitId: string;
  date: string;
  tasks: HabitTask[];
  taskCompletions: TaskCompletion[];
}

export const HabitDayTasksBlock: FC<HabitDayTasksBlockProps> = function (props) {
  const { translations } = useLanguage();
  const actions = useHabitActions();

  const completedIds = useMemo(() => {
    const set = new Set<string>();
    props.taskCompletions.forEach((tc) => {
      if (tc.date === props.date && tc.completed) set.add(tc.taskId);
    });
    return set;
  }, [props.taskCompletions, props.date]);

  return (
    <Card
      variant={'tertiary'}
      style={sharedLayoutStyles.gap8}>
      <Typography
        size={12}
        weight={500}
        colorVariant={'textSecondary'}
        transform={'uppercase'}>
        {`${translations.habits.detail.tasksTitle} — ${props.date}`}
      </Typography>
      <View style={sharedLayoutStyles.gap8}>
        {props.tasks.map((task) => (
          <TaskItem
            key={task.id}
            item={task}
            completed={completedIds.has(task.id)}
            onPress={() => actions.toggleTaskCompletion(props.habitId, task.id, props.date)}
          />
        ))}
      </View>
    </Card>
  );
};
