import { useMemo } from 'react';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { TaskCompletion } from '@db/models/TaskCompletion';

export interface HabitActions {
  toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
  toggleTaskCompletion: (habitId: string, taskId: string, date: string) => Promise<void>;
}

export function useHabitActions(): HabitActions {
  const database = useDatabase();

  return useMemo<HabitActions>(
    () => ({
      toggleHabitCompletion: async (habitId, date) => {
        await database.write(async () => {
          const collection = database.get<HabitCompletion>('habit_completions');
          const existing = await collection
            .query(Q.where('habit_id', habitId), Q.where('date', date))
            .fetch();
          if (existing.length > 0) {
            await Promise.all(existing.map(record => record.destroyPermanently()));
            return;
          }
          await collection.create(record => {
            record.habitId = habitId;
            record.date = date;
            record.completed = true;
          });
        });
      },
      toggleTaskCompletion: async (habitId, taskId, date) => {
        await database.write(async () => {
          const collection = database.get<TaskCompletion>('task_completions');
          const existing = await collection
            .query(Q.where('habit_id', habitId), Q.where('task_id', taskId), Q.where('date', date))
            .fetch();
          if (existing.length > 0) {
            await Promise.all(existing.map(record => record.destroyPermanently()));
            return;
          }
          await collection.create(record => {
            record.habitId = habitId;
            record.taskId = taskId;
            record.date = date;
            record.completed = true;
          });
        });
      },
    }),
    [database]
  );
}
