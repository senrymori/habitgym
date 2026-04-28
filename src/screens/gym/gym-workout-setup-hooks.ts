import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymProgram } from '@db/models/GymProgram';
import { GymProgramExercise } from '@db/models/GymProgramExercise';
import { GymWorkoutSession } from '@db/models/GymWorkoutSession';
import { ProgramExerciseDraft, ProgramFormValues } from './gym-program-detail-types';
import { getDefaultProgramFormValues } from './gym-program-detail-consts';

interface UseGymWorkoutSetupResult {
  form: UseFormReturn<ProgramFormValues>;
  exercisesFieldArray: UseFieldArrayReturn<ProgramFormValues, 'exercises', 'fieldKey'>;
  isReady: boolean;
}

export function useGymWorkoutSetup(programId: string): UseGymWorkoutSetupResult {
  const database = useDatabase();
  const [isReady, setIsReady] = useState(false);

  const form = useForm<ProgramFormValues>({
    mode: 'onChange',
    defaultValues: getDefaultProgramFormValues(),
  });

  const exercisesFieldArray = useFieldArray<ProgramFormValues, 'exercises', 'fieldKey'>({
    control: form.control,
    name: 'exercises',
    keyName: 'fieldKey',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const program = await database.get<GymProgram>('gym_programs').find(programId);
        const programExercises = await program.sortedExercises.fetch();
        const drafts: ProgramExerciseDraft[] = await Promise.all(
          programExercises.map(async (pe, index) => {
            const exercise = await pe.exercise.fetch();
            return {
              id: pe.id,
              exerciseId: pe.exerciseId,
              exerciseTitle: exercise.title,
              exerciseType: exercise.exerciseType,
              sortOrder: index,
              sets: pe.sets,
              reps: pe.reps,
              weight: pe.weight,
              restBetweenSets: pe.restBetweenSets,
              duration: pe.duration,
            };
          })
        );
        if (cancelled) return;
        form.reset({
          icon: program.icon,
          title: program.title,
          restBetweenExercises: program.restBetweenExercises,
          exercises: drafts,
        });
        setIsReady(true);
      } catch (e) {
        console.error('[useGymWorkoutSetup] failed to load program', e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [programId, database, form]);

  return { form, exercisesFieldArray, isReady };
}

interface UseGymWorkoutSetupActionsResult {
  startWorkout: (values: ProgramFormValues, programId: string) => Promise<string>;
}

export function useGymWorkoutSetupActions(): UseGymWorkoutSetupActionsResult {
  const database = useDatabase();

  const startWorkout = useCallback(
    async (values: ProgramFormValues, programId: string): Promise<string> => {
      const programsCollection = database.get<GymProgram>('gym_programs');
      const programExercisesCollection = database.get<GymProgramExercise>('gym_program_exercises');
      const sessionsCollection = database.get<GymWorkoutSession>('gym_workout_sessions');

      let createdSessionId = '';
      await database.write(async () => {
        const program = await programsCollection.find(programId);
        await program.update((r) => {
          r.restBetweenExercises = values.restBetweenExercises;
        });

        // Persist values (sets/reps/weight/rest/duration) back to live program — but NOT sortOrder.
        for (const draft of values.exercises) {
          if (!draft.id) continue;
          const programExercise = await programExercisesCollection.find(draft.id);
          await programExercise.update((r) => {
            if (draft.exerciseType === 'strength') {
              r.sets = draft.sets;
              r.reps = draft.reps;
              r.weight = draft.weight;
              r.restBetweenSets = draft.restBetweenSets;
              r.duration = undefined;
            } else {
              r.duration = draft.duration;
              r.sets = undefined;
              r.reps = undefined;
              r.weight = undefined;
              r.restBetweenSets = undefined;
            }
          });
        }

        const orderedIds = values.exercises.map((d) => d.id).filter((id): id is string => !!id);
        const session = await sessionsCollection.create((r) => {
          r.programId = programId;
          r.startedAt = new Date();
          r.status = 'active';
          r.exerciseOrderRaw = JSON.stringify(orderedIds);
        });
        createdSessionId = session.id;
      });
      return createdSessionId;
    },
    [database]
  );

  return useMemo(() => ({ startWorkout }), [startWorkout]);
}
