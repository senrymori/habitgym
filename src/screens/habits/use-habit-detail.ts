import { useEffect, useState } from 'react';
import { useDatabase } from '@providers/DatabaseProvider';
import { Habit } from '@db/models/Habit';
import { HabitTask } from '@db/models/HabitTask';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { TaskCompletion } from '@db/models/TaskCompletion';

interface UseHabitDetailResult {
  habit: Habit | null;
  tasks: HabitTask[];
  completions: HabitCompletion[];
  taskCompletions: TaskCompletion[];
}

export function useHabitDetail(habitId: string): UseHabitDetailResult {
  const database = useDatabase();
  // Wrap in object so React always sees a new reference on update.
  // WatermelonDB's findAndObserve emits the same model instance (mutated in-place),
  // which causes React to bail out of re-rendering when Object.is returns true.
  const [habitWrapper, setHabitWrapper] = useState<{ value: Habit } | null>(null);
  const [tasks, setTasks] = useState<HabitTask[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletion[]>([]);

  const habit = habitWrapper?.value ?? null;

  useEffect(() => {
    const subscription = database
      .get<Habit>('habits')
      .findAndObserve(habitId)
      .subscribe((h) => setHabitWrapper({ value: h }));
    return () => subscription.unsubscribe();
  }, [database, habitId]);

  useEffect(() => {
    if (!habit) return;
    const sub = habit.sortedTasks.observe().subscribe(setTasks);
    return () => sub.unsubscribe();
  }, [habit]);

  useEffect(() => {
    if (!habit) return;
    const sub = habit.completions.observe().subscribe(setCompletions);
    return () => sub.unsubscribe();
  }, [habit]);

  useEffect(() => {
    if (!habit) return;
    const sub = habit.taskCompletions.observe().subscribe(setTaskCompletions);
    return () => sub.unsubscribe();
  }, [habit]);

  return { habit, tasks, completions, taskCompletions };
}
