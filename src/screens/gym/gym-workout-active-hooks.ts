import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymProgram } from '@db/models/GymProgram';
import { GymProgramExercise } from '@db/models/GymProgramExercise';
import { GymWorkoutSession } from '@db/models/GymWorkoutSession';
import { GymWorkoutSet } from '@db/models/GymWorkoutSet';
import { storage } from '@utils/storage-utils';
import { ActiveExerciseInfo, RestTimerState, RestTimerType, WorkoutProgress } from './gym-workout-active-types';
import { applySessionOrder, computeProgress } from './gym-workout-active-utils';

interface UseGymWorkoutActiveResult {
  session: GymWorkoutSession | null;
  program: GymProgram | null;
  exercises: ActiveExerciseInfo[];
  sets: GymWorkoutSet[];
  isReady: boolean;
  isFinished: boolean;
  progress: WorkoutProgress;
  currentExercise: ActiveExerciseInfo | null;
}

export function useGymWorkoutActive(sessionId: string): UseGymWorkoutActiveResult {
  const database = useDatabase();
  const [sessionWrapper, setSessionWrapper] = useState<{ value: GymWorkoutSession } | null>(null);
  const [program, setProgram] = useState<GymProgram | null>(null);
  const [programExercises, setProgramExercises] = useState<GymProgramExercise[]>([]);
  const [exercises, setExercises] = useState<ActiveExerciseInfo[]>([]);
  const [sets, setSets] = useState<GymWorkoutSet[]>([]);
  const [exercisesReady, setExercisesReady] = useState(false);

  const session = sessionWrapper?.value ?? null;

  useEffect(() => {
    const sub = database
      .get<GymWorkoutSession>('gym_workout_sessions')
      .findAndObserve(sessionId)
      .subscribe((s) => setSessionWrapper({ value: s }));
    return () => sub.unsubscribe();
  }, [database, sessionId]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    session.program.fetch().then((p) => {
      if (!cancelled) setProgram(p);
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!program) return;
    const sub = program.sortedExercises.observe().subscribe(setProgramExercises);
    return () => sub.unsubscribe();
  }, [program]);

  // Convert program exercises into ActiveExerciseInfo[] in session-specific order.
  const orderRaw = session?.exerciseOrderRaw ?? null;
  useEffect(() => {
    let cancelled = false;
    async function build() {
      if (programExercises.length === 0) {
        if (!cancelled) {
          setExercises([]);
          setExercisesReady(!!program);
        }
        return;
      }
      const infos: ActiveExerciseInfo[] = await Promise.all(
        programExercises.map(async (pe) => {
          const exercise = await pe.exercise.fetch();
          return {
            programExerciseId: pe.id,
            exerciseTitle: exercise.title,
            exerciseType: exercise.exerciseType,
            sets: pe.sets,
            reps: pe.reps,
            defaultWeight: pe.weight,
            restBetweenSets: pe.restBetweenSets,
            duration: pe.duration,
          };
        })
      );
      const orderedIds = parseOrder(orderRaw);
      const ordered = applySessionOrder(infos, orderedIds, (i) => i.programExerciseId);
      if (!cancelled) {
        setExercises(ordered);
        setExercisesReady(true);
      }
    }
    build();
    return () => {
      cancelled = true;
    };
  }, [programExercises, orderRaw, program]);

  useEffect(() => {
    const sub = database
      .get<GymWorkoutSet>('gym_workout_sets')
      .query(Q.where('session_id', sessionId), Q.sortBy('set_number', Q.asc))
      .observe()
      .subscribe(setSets);
    return () => sub.unsubscribe();
  }, [database, sessionId]);

  const progress = useMemo(() => computeProgress(sets, exercises), [sets, exercises]);

  const isReady = !!session && !!program && exercisesReady;
  const isFinished = session?.status === 'finished' || (isReady && progress.isFinished);
  const currentExercise = !isFinished && progress.currentExerciseIndex < exercises.length
    ? exercises[progress.currentExerciseIndex]
    : null;

  return {
    session,
    program,
    exercises,
    sets,
    isReady,
    isFinished: !!isFinished,
    progress,
    currentExercise,
  };
}

function parseOrder(raw: string | null | undefined): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

interface UseGymWorkoutActiveActionsResult {
  completeSet: (
    programExerciseId: string,
    setNumber: number,
    reps: number | undefined,
    weight: number | undefined,
    calories?: number
  ) => Promise<void>;
  skipSet: (programExerciseId: string, setNumber: number) => Promise<void>;
  skipExercise: (programExerciseId: string, fromSetNumber: number, totalSets: number) => Promise<void>;
  finishProgram: () => Promise<void>;
}

export function useGymWorkoutActiveActions(sessionId: string): UseGymWorkoutActiveActionsResult {
  const database = useDatabase();

  const completeSet = useCallback(
    async (
      programExerciseId: string,
      setNumber: number,
      reps: number | undefined,
      weight: number | undefined,
      calories?: number
    ) => {
      const setsCollection = database.get<GymWorkoutSet>('gym_workout_sets');
      await database.write(async () => {
        await setsCollection.create((r) => {
          r.sessionId = sessionId;
          r.programExerciseId = programExerciseId;
          r.setNumber = setNumber;
          r.weight = weight;
          r.reps = reps;
          r.completed = true;
          r.calories = calories;
        });
      });
    },
    [database, sessionId]
  );

  const skipSet = useCallback(
    async (programExerciseId: string, setNumber: number) => {
      const setsCollection = database.get<GymWorkoutSet>('gym_workout_sets');
      await database.write(async () => {
        await setsCollection.create((r) => {
          r.sessionId = sessionId;
          r.programExerciseId = programExerciseId;
          r.setNumber = setNumber;
          r.completed = false;
        });
      });
    },
    [database, sessionId]
  );

  const skipExercise = useCallback(
    async (programExerciseId: string, fromSetNumber: number, totalSets: number) => {
      if (totalSets <= 0) return;
      const setsCollection = database.get<GymWorkoutSet>('gym_workout_sets');
      await database.write(async () => {
        for (let setNumber = fromSetNumber; setNumber <= totalSets; setNumber += 1) {
          await setsCollection.create((r) => {
            r.sessionId = sessionId;
            r.programExerciseId = programExerciseId;
            r.setNumber = setNumber;
            r.completed = false;
          });
        }
      });
    },
    [database, sessionId]
  );

  const finishProgram = useCallback(async () => {
    const sessionsCollection = database.get<GymWorkoutSession>('gym_workout_sessions');
    await database.write(async () => {
      const session = await sessionsCollection.find(sessionId);
      await session.update((r) => {
        r.finishedAt = new Date();
        r.status = 'finished';
      });
    });
  }, [database, sessionId]);

  return useMemo(
    () => ({ completeSet, skipSet, skipExercise, finishProgram }),
    [completeSet, skipSet, skipExercise, finishProgram]
  );
}

interface RestTimerStored {
  type: RestTimerType;
  startedAt: number;
  durationMs: number;
}

interface UseRestTimerResult {
  timer: RestTimerState | null;
  start: (type: RestTimerType, durationSeconds: number, onComplete?: () => void) => void;
  skip: () => void;
  clear: () => void;
}

export function useRestTimer(sessionId: string): UseRestTimerResult {
  const [timer, setTimer] = useState<RestTimerState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const storageKey = useMemo(() => `gymRestTimer:${sessionId}`, [sessionId]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishTimer = useCallback(
    (invokeCallback: boolean) => {
      stopInterval();
      storage.remove(storageKey);
      const cb = onCompleteRef.current;
      onCompleteRef.current = null;
      setTimer(null);
      if (invokeCallback && cb) cb();
    },
    [storageKey, stopInterval]
  );

  const tick = useCallback(
    (startedAt: number, durationMs: number, type: RestTimerType) => {
      const secondsLeft = Math.max(0, Math.ceil((startedAt + durationMs - Date.now()) / 1000));
      if (secondsLeft <= 0) {
        finishTimer(true);
      } else {
        setTimer({ type, startedAt, durationMs, secondsLeft });
      }
    },
    [finishTimer]
  );

  const beginInterval = useCallback(
    (startedAt: number, durationMs: number, type: RestTimerType) => {
      stopInterval();
      tick(startedAt, durationMs, type);
      intervalRef.current = setInterval(() => tick(startedAt, durationMs, type), 1000);
    },
    [stopInterval, tick]
  );

  const start = useCallback(
    (type: RestTimerType, durationSeconds: number, onComplete?: () => void) => {
      if (durationSeconds <= 0) {
        onComplete?.();
        return;
      }
      const startedAt = Date.now();
      const durationMs = durationSeconds * 1000;
      onCompleteRef.current = onComplete ?? null;
      const stored: RestTimerStored = { type, startedAt, durationMs };
      storage.set(storageKey, JSON.stringify(stored));
      beginInterval(startedAt, durationMs, type);
    },
    [beginInterval, storageKey]
  );

  const skip = useCallback(() => {
    finishTimer(true);
  }, [finishTimer]);

  const clear = useCallback(() => {
    finishTimer(false);
  }, [finishTimer]);

  // Restore from MMKV on mount (in case app was killed/re-opened mid-rest).
  useEffect(() => {
    const raw = storage.getString(storageKey);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as RestTimerStored;
      const remaining = stored.startedAt + stored.durationMs - Date.now();
      if (remaining <= 0) {
        storage.remove(storageKey);
        return;
      }
      beginInterval(stored.startedAt, stored.durationMs, stored.type);
    } catch {
      storage.remove(storageKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Recompute on foreground — setInterval may have been throttled while backgrounded.
  useEffect(() => {
    const handler = (state: AppStateStatus) => {
      if (state !== 'active') return;
      const raw = storage.getString(storageKey);
      if (!raw) return;
      try {
        const stored = JSON.parse(raw) as RestTimerStored;
        tick(stored.startedAt, stored.durationMs, stored.type);
      } catch {
        // ignore
      }
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, [storageKey, tick]);

  useEffect(() => {
    return () => {
      stopInterval();
    };
  }, [stopInterval]);

  return { timer, start, skip, clear };
}
