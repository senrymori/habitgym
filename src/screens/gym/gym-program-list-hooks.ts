import { useCallback, useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { Subscription } from 'rxjs';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymProgram } from '@db/models/GymProgram';
import { GymProgramExercise } from '@db/models/GymProgramExercise';
import { GymWorkoutSession } from '@db/models/GymWorkoutSession';
import { GymWorkoutSet } from '@db/models/GymWorkoutSet';
import { GymProgramSummary } from './gym-program-detail-types';

export function useGymProgramsList(): GymProgramSummary[] {
  const database = useDatabase();
  const [programs, setPrograms] = useState<GymProgram[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeSessions, setActiveSessions] = useState<Record<string, string | null>>({});
  const [finishedFlags, setFinishedFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const subscription = database
      .get<GymProgram>('gym_programs')
      .query(Q.where('is_archived', false))
      .observe()
      .subscribe(setPrograms);
    return () => subscription.unsubscribe();
  }, [database]);

  const programIdsKey = programs.map((p) => p.id).join(',');

  useEffect(() => {
    if (programs.length === 0) {
      setCounts({});
      setActiveSessions({});
      setFinishedFlags({});
      return;
    }
    const exercisesCollection = database.get<GymProgramExercise>('gym_program_exercises');
    const sessionsCollection = database.get<GymWorkoutSession>('gym_workout_sessions');
    const subs: Subscription[] = [];

    programs.forEach((program) => {
      const id = program.id;
      subs.push(
        exercisesCollection
          .query(Q.where('program_id', id))
          .observeCount()
          .subscribe((count) => {
            setCounts((prev) => (prev[id] === count ? prev : { ...prev, [id]: count }));
          })
      );
      subs.push(
        sessionsCollection
          .query(Q.where('program_id', id), Q.where('status', 'active'))
          .observe()
          .subscribe((sessions) => {
            const sessionId = sessions[0]?.id ?? null;
            setActiveSessions((prev) => (prev[id] === sessionId ? prev : { ...prev, [id]: sessionId }));
          })
      );
      subs.push(
        sessionsCollection
          .query(Q.where('program_id', id), Q.where('status', 'finished'))
          .observeCount()
          .subscribe((count) => {
            const has = count > 0;
            setFinishedFlags((prev) => (prev[id] === has ? prev : { ...prev, [id]: has }));
          })
      );
    });

    return () => {
      subs.forEach((s) => s.unsubscribe());
    };
    // programIdsKey covers programs identity for subscription rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database, programIdsKey]);

  const summaries = useMemo<GymProgramSummary[]>(() => {
    return programs.map((p) => ({
      programId: p.id,
      icon: p.icon,
      title: p.title,
      exercisesCount: counts[p.id] ?? 0,
      activeSessionId: activeSessions[p.id] ?? null,
      hasFinishedSession: finishedFlags[p.id] ?? false,
    }));
  }, [programs, counts, activeSessions, finishedFlags]);

  return summaries;
}

interface UseGymProgramListActionsResult {
  deleteProgram: (programId: string) => Promise<void>;
}

export function useGymProgramListActions(): UseGymProgramListActionsResult {
  const database = useDatabase();

  const deleteProgram = useCallback(
    async (programId: string) => {
      await database.write(async () => {
        const programExercises = await database
          .get<GymProgramExercise>('gym_program_exercises')
          .query(Q.where('program_id', programId))
          .fetch();
        const programExerciseIds = programExercises.map((e) => e.id);
        const sets =
          programExerciseIds.length > 0
            ? await database
                .get<GymWorkoutSet>('gym_workout_sets')
                .query(Q.where('program_exercise_id', Q.oneOf(programExerciseIds)))
                .fetch()
            : [];
        const sessions = await database
          .get<GymWorkoutSession>('gym_workout_sessions')
          .query(Q.where('program_id', programId))
          .fetch();

        await Promise.all(sets.map((s) => s.destroyPermanently()));
        await Promise.all(programExercises.map((e) => e.destroyPermanently()));
        await Promise.all(sessions.map((s) => s.destroyPermanently()));

        const program = await database.get<GymProgram>('gym_programs').find(programId);
        await program.destroyPermanently();
      });
    },
    [database]
  );

  return { deleteProgram };
}
