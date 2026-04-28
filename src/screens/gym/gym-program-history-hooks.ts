import { useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { Subscription } from 'rxjs';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymProgram } from '@db/models/GymProgram';
import { GymProgramExercise } from '@db/models/GymProgramExercise';
import { GymWorkoutSession } from '@db/models/GymWorkoutSession';
import { GymWorkoutSet } from '@db/models/GymWorkoutSet';
import { HistoryExerciseSnapshot, HistoryItem } from './gym-program-history-types';
import { aggregateSessionStats } from './gym-program-history-utils';

interface UseGymProgramHistoryResult {
  program: GymProgram | null;
  items: HistoryItem[];
  isReady: boolean;
}

export function useGymProgramHistory(programId: string, visibleMonth: Date): UseGymProgramHistoryResult {
  const database = useDatabase();
  const [program, setProgram] = useState<GymProgram | null>(null);
  const [sessions, setSessions] = useState<GymWorkoutSession[]>([]);
  const [sessionsReady, setSessionsReady] = useState(false);
  const [snapshots, setSnapshots] = useState<HistoryExerciseSnapshot[]>([]);
  const [snapshotsReady, setSnapshotsReady] = useState(false);
  const [setsBySession, setSetsBySession] = useState<Record<string, GymWorkoutSet[]>>({});

  useEffect(() => {
    const sub = database.get<GymProgram>('gym_programs').findAndObserve(programId).subscribe(setProgram);
    return () => sub.unsubscribe();
  }, [database, programId]);

  const monthStart = useMemo(() => startOfMonth(visibleMonth).getTime(), [visibleMonth]);
  const monthEnd = useMemo(() => endOfMonth(visibleMonth).getTime(), [visibleMonth]);

  useEffect(() => {
    setSessionsReady(false);
    const sub = database
      .get<GymWorkoutSession>('gym_workout_sessions')
      .query(
        Q.where('program_id', programId),
        Q.where('status', 'finished'),
        Q.where('started_at', Q.gte(monthStart)),
        Q.where('started_at', Q.lte(monthEnd)),
        Q.sortBy('started_at', Q.desc)
      )
      .observe()
      .subscribe((value) => {
        setSessions(value);
        setSessionsReady(true);
      });
    return () => sub.unsubscribe();
  }, [database, programId, monthStart, monthEnd]);

  // Build exercise snapshots for the program (title/type/totals).
  useEffect(() => {
    let cancelled = false;
    setSnapshotsReady(false);
    const sub = database
      .get<GymProgramExercise>('gym_program_exercises')
      .query(Q.where('program_id', programId), Q.sortBy('sort_order', Q.asc))
      .observe()
      .subscribe(async (programExercises) => {
        try {
          const next: HistoryExerciseSnapshot[] = await Promise.all(
            programExercises.map(async (pe) => {
              const exercise = await pe.exercise.fetch();
              const setsTotal = exercise.exerciseType === 'strength' ? pe.sets ?? 0 : 1;
              const durationMin = exercise.exerciseType === 'cardio' ? pe.duration ?? 0 : 0;
              return {
                programExerciseId: pe.id,
                exerciseTitle: exercise.title,
                exerciseType: exercise.exerciseType,
                sortOrder: pe.sortOrder,
                setsTotal,
                durationMin,
              };
            })
          );
          if (!cancelled) {
            setSnapshots(next);
            setSnapshotsReady(true);
          }
        } catch (e) {
          console.error('[useGymProgramHistory] failed to load exercise snapshots', e);
        }
      });
    return () => {
      cancelled = true;
      sub.unsubscribe();
    };
  }, [database, programId]);

  // Subscribe to sets per session in current month range.
  const sessionIdsKey = sessions.map((s) => s.id).join(',');
  useEffect(() => {
    if (sessions.length === 0) {
      setSetsBySession({});
      return;
    }
    const setsCollection = database.get<GymWorkoutSet>('gym_workout_sets');
    const subs: Subscription[] = [];
    const validIds = new Set(sessions.map((s) => s.id));

    setSetsBySession((prev) => {
      const filtered: Record<string, GymWorkoutSet[]> = {};
      for (const id of validIds) {
        if (prev[id]) filtered[id] = prev[id];
      }
      return filtered;
    });

    sessions.forEach((session) => {
      const sub = setsCollection
        .query(Q.where('session_id', session.id), Q.sortBy('set_number', Q.asc))
        .observe()
        .subscribe((sets) => {
          setSetsBySession((prev) => ({ ...prev, [session.id]: sets }));
        });
      subs.push(sub);
    });

    return () => subs.forEach((s) => s.unsubscribe());
    // sessionIdsKey covers session identity for subscription rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database, sessionIdsKey]);

  const items = useMemo<HistoryItem[]>(() => {
    return sessions.map((session) => {
      const sets = setsBySession[session.id] ?? [];
      const stats = aggregateSessionStats(snapshots, sets);
      return {
        sessionId: session.id,
        startedAt: session.startedAt,
        completedSets: stats.completedSets,
        totalSets: stats.totalSets,
        exercises: stats.items,
      };
    });
  }, [sessions, setsBySession, snapshots]);

  const isReady = sessionsReady && snapshotsReady;

  return { program, items, isReady };
}
