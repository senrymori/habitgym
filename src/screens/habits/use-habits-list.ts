import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { Habit } from '@db/models/Habit';

export function useHabitsList(): Habit[] {
  const database = useDatabase();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const subscription = database
      .get<Habit>('habits')
      .query(Q.where('is_archived', false))
      .observe()
      .subscribe(setHabits);
    return () => subscription.unsubscribe();
  }, [database]);

  return habits;
}