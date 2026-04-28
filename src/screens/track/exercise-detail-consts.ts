import { ExerciseType } from '@db/db-types';
import { ExerciseFormValues } from './exercise-detail-types';

export function getDefaultExerciseFormValues(): ExerciseFormValues {
  return {
    title: '',
    description: '',
    exerciseType: 'strength',
    tags: [],
    photos: [],
    videos: [],
  };
}

export const exerciseTypeSegments: readonly ExerciseType[] = ['strength', 'cardio'] as const;
