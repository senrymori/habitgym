import { ExerciseType } from '@db/db-types';

export interface MediaFormItem {
  uri: string;
  existingId?: string;
}

export interface ExerciseFormValues {
  title: string;
  description: string;
  exerciseType: ExerciseType;
  tags: string[];
  photos: MediaFormItem[];
  videos: MediaFormItem[];
}

export const MAX_EXERCISE_PHOTOS = 10;
export const MAX_EXERCISE_VIDEOS = 5;
