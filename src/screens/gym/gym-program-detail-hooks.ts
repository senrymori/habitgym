import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collection } from '@nozbe/watermelondb';
import { useFieldArray, useForm, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymProgram } from '@db/models/GymProgram';
import { GymProgramExercise } from '@db/models/GymProgramExercise';
import { GymExercise } from '@db/models/GymExercise';
import { ProgramExerciseDraft, ProgramFormValues } from './gym-program-detail-types';
import { buildProgramExerciseDraft, getDefaultProgramFormValues } from './gym-program-detail-consts';

interface UseGymProgramDetailResult {
  form: UseFormReturn<ProgramFormValues>;
  exercisesFieldArray: UseFieldArrayReturn<ProgramFormValues, 'exercises', 'fieldKey'>;
  addExerciseFromId: (exerciseId: string) => Promise<void>;
  isEdit: boolean;
  isReady: boolean;
}

export function useGymProgramDetail(programId?: string): UseGymProgramDetailResult {
  const database = useDatabase();
  const isEdit = !!programId;
  const [isReady, setIsReady] = useState(!isEdit);

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
    if (!programId) return;
    let cancelled = false;
    async function load() {
      try {
        const program = await database.get<GymProgram>('gym_programs').find(programId!);
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
        console.error('[useGymProgramDetail] failed to load program', e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [programId, database, form]);

  const addExerciseFromId = useCallback(
    async (exerciseId: string) => {
      try {
        const exercise = await database.get<GymExercise>('gym_exercises').find(exerciseId);
        const currentExercises = form.getValues('exercises');
        const draft = buildProgramExerciseDraft(
          exercise.id,
          exercise.title,
          exercise.exerciseType,
          currentExercises.length
        );
        exercisesFieldArray.append(draft, { shouldFocus: false });
      } catch (e) {
        console.error('[useGymProgramDetail] failed to add exercise', e);
      }
    },
    [database, form, exercisesFieldArray]
  );

  return { form, exercisesFieldArray, addExerciseFromId, isEdit, isReady };
}

interface UseGymProgramActionsResult {
  saveProgram: (values: ProgramFormValues, programId?: string) => Promise<void>;
}

export function useGymProgramActions(): UseGymProgramActionsResult {
  const database = useDatabase();

  const saveProgram = useCallback(
    async (values: ProgramFormValues, programId?: string) => {
      const programsCollection = database.get<GymProgram>('gym_programs');
      const exercisesCollection = database.get<GymProgramExercise>('gym_program_exercises');

      await database.write(async () => {
        if (programId) {
          const program = await programsCollection.find(programId);
          await program.update((r) => {
            applyValuesToProgram(r, values);
          });
          await syncProgramExercises(program, values.exercises, exercisesCollection);
        } else {
          const program = await programsCollection.create((r) => {
            applyValuesToProgram(r, values);
          });
          await Promise.all(
            values.exercises.map((draft, index) =>
              exercisesCollection.create((r) => {
                applyDraftToProgramExercise(r, draft, program.id, index);
              })
            )
          );
        }
      });
    },
    [database]
  );

  return useMemo(() => ({ saveProgram }), [saveProgram]);
}

function applyValuesToProgram(r: GymProgram, values: ProgramFormValues): void {
  r.icon = values.icon;
  r.title = values.title.trim();
  r.restBetweenExercises = values.restBetweenExercises;
  r.isArchived = false;
}

function applyDraftToProgramExercise(
  r: GymProgramExercise,
  draft: ProgramExerciseDraft,
  programId: string,
  sortOrder: number
): void {
  r.programId = programId;
  r.exerciseId = draft.exerciseId;
  r.sortOrder = sortOrder;
  r.sets = draft.exerciseType === 'strength' ? draft.sets : undefined;
  r.reps = draft.exerciseType === 'strength' ? draft.reps : undefined;
  r.weight = draft.exerciseType === 'strength' ? draft.weight : undefined;
  r.restBetweenSets = draft.exerciseType === 'strength' ? draft.restBetweenSets : undefined;
  r.duration = draft.exerciseType === 'cardio' ? draft.duration : undefined;
}

async function syncProgramExercises(
  program: GymProgram,
  drafts: ProgramExerciseDraft[],
  exercisesCollection: Collection<GymProgramExercise>
): Promise<void> {
  const existing = await program.sortedExercises.fetch();
  const draftIds = new Set(drafts.map((d) => d.id).filter(Boolean));
  const toDelete = existing.filter((e) => !draftIds.has(e.id));
  await Promise.all(toDelete.map((e) => e.markAsDeleted()));

  const existingById = new Map(existing.map((e) => [e.id, e]));

  for (let index = 0; index < drafts.length; index += 1) {
    const draft = drafts[index];
    if (draft.id && existingById.has(draft.id)) {
      const programExercise = existingById.get(draft.id)!;
      await programExercise.update((r) => {
        applyDraftToProgramExercise(r, draft, program.id, index);
      });
    } else {
      await exercisesCollection.create((r) => {
        applyDraftToProgramExercise(r, draft, program.id, index);
      });
    }
  }
}
