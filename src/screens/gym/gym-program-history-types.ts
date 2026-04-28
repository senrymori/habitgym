export interface ExerciseHistoryStrength {
  type: 'strength';
  programExerciseId: string;
  title: string;
  setsDone: number;
  setsTotal: number;
  weightKg: number | null;
}

export interface ExerciseHistoryCardio {
  type: 'cardio';
  programExerciseId: string;
  title: string;
  completed: boolean;
  durationMin: number;
  caloriesKcal: number;
}

export type ExerciseHistoryRecord = ExerciseHistoryStrength | ExerciseHistoryCardio;

export interface HistoryItem {
  sessionId: string;
  startedAt: Date;
  completedSets: number;
  totalSets: number;
  exercises: ExerciseHistoryRecord[];
}

export interface HistoryExerciseSnapshot {
  programExerciseId: string;
  exerciseTitle: string;
  exerciseType: 'strength' | 'cardio';
  sortOrder: number;
  setsTotal: number;
  durationMin: number;
}
