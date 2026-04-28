import { ExerciseType } from '@db/db-types';

export type RestTimerType = 'between-sets' | 'between-exercises';

export interface RestTimerState {
  type: RestTimerType;
  startedAt: number;
  durationMs: number;
  secondsLeft: number;
}

export interface ActiveExerciseInfo {
  programExerciseId: string;
  exerciseTitle: string;
  exerciseType: ExerciseType;
  sets?: number;
  reps?: number;
  defaultWeight?: number;
  restBetweenSets?: number;
  duration?: number;
}

export interface WorkoutProgress {
  currentExerciseIndex: number;
  currentSetIndex: number;
  isFinished: boolean;
}
