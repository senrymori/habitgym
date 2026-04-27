import { useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymExercise } from '@db/models/GymExercise';
import { ExerciseType } from '@db/db-types';

export function useExercisesList(
  filterType: ExerciseType,
  search: string,
  selectedTags: string[]
): GymExercise[] {
  const database = useDatabase();
  const [exercises, setExercises] = useState<GymExercise[]>([]);

  useEffect(() => {
    const subscription = database
      .get<GymExercise>('gym_exercises')
      .query(Q.where('exercise_type', filterType))
      .observe()
      .subscribe(setExercises);
    return () => subscription.unsubscribe();
  }, [database, filterType]);

  return useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return exercises.filter((exercise) => {
      if (normalizedSearch.length > 0) {
        if (!exercise.title.toLocaleLowerCase().includes(normalizedSearch)) return false;
      }
      if (selectedTags.length > 0) {
        const tags = exercise.parsedTags;
        const hasAll = selectedTags.every((tag) => tags.includes(tag));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [exercises, search, selectedTags]);
}

export function useAllTags(): string[] {
  const database = useDatabase();
  const [exercises, setExercises] = useState<GymExercise[]>([]);

  useEffect(() => {
    const subscription = database.get<GymExercise>('gym_exercises').query().observe().subscribe(setExercises);
    return () => subscription.unsubscribe();
  }, [database]);

  return useMemo(() => {
    const tagSet = new Set<string>();
    for (const exercise of exercises) {
      for (const tag of exercise.parsedTags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [exercises]);
}
