import { ExerciseType } from '@db/db-types';

export interface ExerciseFormValues {
  title: string;
  description: string;
  exerciseType: ExerciseType;
  tags: string[];
}
