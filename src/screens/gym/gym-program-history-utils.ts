import { format } from 'date-fns';
import { GymWorkoutSet } from '@db/models/GymWorkoutSet';
import {
  ExerciseHistoryCardio,
  ExerciseHistoryRecord,
  ExerciseHistoryStrength,
  HistoryExerciseSnapshot,
} from './gym-program-history-types';

const cardioMet = 8;
const defaultUserWeightKg = 70;

interface AggregatedStats {
  items: ExerciseHistoryRecord[];
  completedSets: number;
  totalSets: number;
}

export function estimateCardioCalories(durationMin: number, userWeightKg: number = defaultUserWeightKg): number {
  if (durationMin <= 0) return 0;
  return Math.round(cardioMet * userWeightKg * (durationMin / 60));
}

export function aggregateSessionStats(
  snapshots: HistoryExerciseSnapshot[],
  sets: GymWorkoutSet[]
): AggregatedStats {
  const setsByExercise = new Map<string, GymWorkoutSet[]>();
  for (const set of sets) {
    const list = setsByExercise.get(set.programExerciseId);
    if (list) {
      list.push(set);
    } else {
      setsByExercise.set(set.programExerciseId, [set]);
    }
  }

  const items: ExerciseHistoryRecord[] = [];
  let completedSets = 0;
  let totalSets = 0;

  const sortedSnapshots = [...snapshots].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const snapshot of sortedSnapshots) {
    const exerciseSets = setsByExercise.get(snapshot.programExerciseId) ?? [];
    const completed = exerciseSets.filter((s) => s.completed);
    totalSets += snapshot.setsTotal;
    completedSets += Math.min(completed.length, snapshot.setsTotal);

    if (snapshot.exerciseType === 'strength') {
      const lastWithWeight = [...completed]
        .sort((a, b) => b.setNumber - a.setNumber)
        .find((s) => s.weight !== undefined && s.weight !== null);
      const item: ExerciseHistoryStrength = {
        type: 'strength',
        programExerciseId: snapshot.programExerciseId,
        title: snapshot.exerciseTitle,
        setsDone: completed.length,
        setsTotal: snapshot.setsTotal,
        weightKg: lastWithWeight?.weight ?? null,
      };
      items.push(item);
    } else {
      const completedCardio = completed[0];
      const storedCalories = completedCardio?.calories;
      const calories = storedCalories ?? estimateCardioCalories(snapshot.durationMin);
      const item: ExerciseHistoryCardio = {
        type: 'cardio',
        programExerciseId: snapshot.programExerciseId,
        title: snapshot.exerciseTitle,
        completed: !!completedCardio,
        durationMin: snapshot.durationMin,
        caloriesKcal: calories,
      };
      items.push(item);
    }
  }

  return { items, completedSets, totalSets };
}

export function formatHistoryShortDate(date: Date): string {
  return format(date, 'dd.MM.yy');
}
