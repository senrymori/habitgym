import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { Habit } from '@db/models/Habit';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { HabitTask } from '@db/models/HabitTask';
import { TaskCompletion } from '@db/models/TaskCompletion';

export function useHabitActions() {
  const database = useDatabase();

  const toggleHabitCompletion = async (habitId: string, date: string) => {
    await database.write(async () => {
      const collection = database.get<HabitCompletion>('habit_completions');
      const existing = await collection.query(Q.where('habit_id', habitId), Q.where('date', date)).fetch();
      if (existing.length > 0) {
        await Promise.all(existing.map((record) => record.destroyPermanently()));
        return;
      }
      await collection.create((record) => {
        record.habitId = habitId;
        record.date = date;
        record.completed = true;
      });
    });
  };

  const toggleTaskCompletion = async (habitId: string, taskId: string, date: string) => {
    await database.write(async () => {
      const collection = database.get<TaskCompletion>('task_completions');
      const existing = await collection
        .query(Q.where('habit_id', habitId), Q.where('task_id', taskId), Q.where('date', date))
        .fetch();
      if (existing.length > 0) {
        await Promise.all(existing.map((record) => record.destroyPermanently()));
        return;
      }
      await collection.create((record) => {
        record.habitId = habitId;
        record.taskId = taskId;
        record.date = date;
        record.completed = true;
      });
    });
  };

  const deleteHabit = async (habitId: string) => {
    await database.write(async () => {
      const tasks = await database.get<HabitTask>('habit_tasks').query(Q.where('habit_id', habitId)).fetch();
      await Promise.all(tasks.map((record) => record.destroyPermanently()));

      const completions = await database.get<HabitCompletion>('habit_completions').query(Q.where('habit_id', habitId)).fetch();
      await Promise.all(completions.map((record) => record.destroyPermanently()));

      const taskCompletions = await database.get<TaskCompletion>('task_completions').query(Q.where('habit_id', habitId)).fetch();
      await Promise.all(taskCompletions.map((record) => record.destroyPermanently()));

      const habit = await database.get<Habit>('habits').find(habitId);
      await habit.destroyPermanently();
    });
  };

  return {
    toggleHabitCompletion,
    toggleTaskCompletion,
    deleteHabit,
  };
}
