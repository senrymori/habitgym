import { ExerciseType } from '@db/db-types';
import { ProgramExerciseDraft, ProgramFormValues } from './gym-program-detail-types';

export function getDefaultProgramFormValues(): ProgramFormValues {
  return {
    icon: '',
    title: '',
    restBetweenExercises: 2,
    exercises: [],
  };
}

export const STRENGTH_EXERCISE_DEFAULTS = {
  sets: 3,
  reps: 10,
  weight: 0,
  restBetweenSets: 2,
} as const;

export const CARDIO_EXERCISE_DEFAULTS = {
  duration: 10,
} as const;

export function buildProgramExerciseDraft(
  exerciseId: string,
  exerciseTitle: string,
  exerciseType: ExerciseType,
  sortOrder: number
): ProgramExerciseDraft {
  if (exerciseType === 'cardio') {
    return {
      exerciseId,
      exerciseTitle,
      exerciseType,
      sortOrder,
      duration: CARDIO_EXERCISE_DEFAULTS.duration,
    };
  }
  return {
    exerciseId,
    exerciseTitle,
    exerciseType,
    sortOrder,
    sets: STRENGTH_EXERCISE_DEFAULTS.sets,
    reps: STRENGTH_EXERCISE_DEFAULTS.reps,
    weight: STRENGTH_EXERCISE_DEFAULTS.weight,
    restBetweenSets: STRENGTH_EXERCISE_DEFAULTS.restBetweenSets,
  };
}
