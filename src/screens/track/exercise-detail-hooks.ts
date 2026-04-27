import { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymExercise } from '@db/models/GymExercise';
import { ExerciseFormValues } from './exercise-detail-types';
import { getDefaultExerciseFormValues } from './exercise-detail-consts';

interface UseExerciseDetailResult {
  form: UseFormReturn<ExerciseFormValues>;
  isEdit: boolean;
  isReady: boolean;
}

export function useExerciseDetail(exerciseId?: string): UseExerciseDetailResult {
  const database = useDatabase();
  const isEdit = !!exerciseId;
  const [isReady, setIsReady] = useState(!isEdit);

  const form = useForm<ExerciseFormValues>({
    mode: 'onChange',
    defaultValues: getDefaultExerciseFormValues(),
  });

  useEffect(() => {
    if (!exerciseId) return;
    let cancelled = false;
    async function load() {
      try {
        const exercise = await database.get<GymExercise>('gym_exercises').find(exerciseId!);
        if (cancelled) return;
        form.reset({
          title: exercise.title,
          description: exercise.description ?? '',
          exerciseType: exercise.exerciseType,
          tags: exercise.parsedTags,
        });
        setIsReady(true);
      } catch (e) {
        console.error('[useExerciseDetail] failed to load exercise', e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [exerciseId, database, form]);

  return { form, isEdit, isReady };
}

interface UseExerciseActionsResult {
  saveExercise: (values: ExerciseFormValues) => Promise<void>;
  deleteExercise: () => Promise<void>;
}

export function useExerciseActions(exerciseId?: string): UseExerciseActionsResult {
  const database = useDatabase();

  return useMemo<UseExerciseActionsResult>(
    () => ({
      saveExercise: async (values) => {
        try {
          const collection = database.get<GymExercise>('gym_exercises');
          const tagsRaw = JSON.stringify(values.tags);
          await database.write(async () => {
            if (exerciseId) {
              const exercise = await collection.find(exerciseId);
              await exercise.update((record) => {
                record.title = values.title.trim();
                record.description = values.description.trim();
                record.exerciseType = values.exerciseType;
                record.tagsRaw = tagsRaw;
              });
            } else {
              await collection.create((record) => {
                record.title = values.title.trim();
                record.description = values.description.trim();
                record.exerciseType = values.exerciseType;
                record.tagsRaw = tagsRaw;
              });
            }
          });
        } catch (e) {
          console.error('[useExerciseActions] saveExercise failed', e);
        }
      },
      deleteExercise: async () => {
        if (!exerciseId) return;
        try {
          await database.write(async () => {
            const exercise = await database.get<GymExercise>('gym_exercises').find(exerciseId);
            await exercise.destroyPermanently();
          });
        } catch (e) {
          console.error('[useExerciseActions] deleteExercise failed', e);
        }
      },
    }),
    [database, exerciseId]
  );
}
