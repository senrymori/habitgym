import { ExerciseType } from '@db/db-types';

export interface ProgramExerciseDraft {
  id?: string;
  exerciseId: string;
  exerciseTitle: string;
  exerciseType: ExerciseType;
  sortOrder: number;
  sets?: number;
  reps?: number;
  weight?: number;
  restBetweenSets?: number;
  duration?: number;
}

export interface ProgramFormValues {
  icon: string;
  title: string;
  restBetweenExercises: number;
  exercises: ProgramExerciseDraft[];
}

export interface GymProgramSummary {
  programId: string;
  icon: string;
  title: string;
  exercisesCount: number;
  activeSessionId: string | null;
  hasFinishedSession: boolean;
}
