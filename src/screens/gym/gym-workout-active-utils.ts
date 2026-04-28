import { GymWorkoutSet } from '@db/models/GymWorkoutSet';
import { ActiveExerciseInfo, WorkoutProgress } from './gym-workout-active-types';

export function getTotalSetsForExercise(exercise: ActiveExerciseInfo): number {
  return exercise.exerciseType === 'strength' ? exercise.sets ?? 0 : 1;
}

export function computeProgress(sets: GymWorkoutSet[], exercises: ActiveExerciseInfo[]): WorkoutProgress {
  if (exercises.length === 0) {
    return { currentExerciseIndex: 0, currentSetIndex: 0, isFinished: false };
  }
  const recordCounts = new Map<string, number>();
  for (const set of sets) {
    recordCounts.set(set.programExerciseId, (recordCounts.get(set.programExerciseId) ?? 0) + 1);
  }
  for (let i = 0; i < exercises.length; i += 1) {
    const exercise = exercises[i];
    const total = getTotalSetsForExercise(exercise);
    const processed = recordCounts.get(exercise.programExerciseId) ?? 0;
    if (processed < total) {
      return { currentExerciseIndex: i, currentSetIndex: processed, isFinished: false };
    }
  }
  return { currentExerciseIndex: exercises.length, currentSetIndex: 0, isFinished: true };
}

export function formatSecondsToMmSs(secondsLeft: number): string {
  const safe = Math.max(0, Math.floor(secondsLeft));
  const mm = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const ss = (safe % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export function applySessionOrder<T extends { programExerciseId?: string; id?: string }>(
  items: T[],
  orderedIds: string[] | null,
  getId: (item: T) => string
): T[] {
  if (!orderedIds || orderedIds.length === 0) return items;
  const indexMap = new Map<string, number>();
  orderedIds.forEach((id, index) => indexMap.set(id, index));
  const fallbackBase = orderedIds.length;
  const result = [...items];
  result.sort((a, b) => {
    const ai = indexMap.get(getId(a)) ?? fallbackBase;
    const bi = indexMap.get(getId(b)) ?? fallbackBase;
    return ai - bi;
  });
  return result;
}
