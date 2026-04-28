import { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useDatabase } from '@providers/DatabaseProvider';
import { GymExercise } from '@db/models/GymExercise';
import { ExercisePhoto } from '@db/models/ExercisePhoto';
import { ExerciseVideo } from '@db/models/ExerciseVideo';
import { ExerciseFormValues, MediaFormItem } from './exercise-detail-types';
import { getDefaultExerciseFormValues } from './exercise-detail-consts';
import { unlinkMediaFiles } from './exercise-media-utils';

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
        const [photos, videos] = await Promise.all([
          exercise.sortedPhotos.fetch(),
          exercise.sortedVideos.fetch(),
        ]);
        if (cancelled) return;
        form.reset({
          title: exercise.title,
          description: exercise.description ?? '',
          exerciseType: exercise.exerciseType,
          tags: exercise.parsedTags,
          photos: photos.map((p) => ({ uri: p.uri, existingId: p.id })),
          videos: videos.map((v) => ({ uri: v.uri, existingId: v.id })),
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

async function persistPhotoDiff(
  database: ReturnType<typeof useDatabase>,
  exerciseId: string,
  existing: ExercisePhoto[],
  formItems: MediaFormItem[]
): Promise<string[]> {
  const formExistingIds = new Set(formItems.map((f) => f.existingId).filter(Boolean) as string[]);
  const toRemove = existing.filter((record) => !formExistingIds.has(record.id));
  const removedUris: string[] = [];
  for (const record of toRemove) {
    removedUris.push(record.uri);
    await record.destroyPermanently();
  }
  const collection = database.get<ExercisePhoto>('exercise_photos');
  for (let i = 0; i < formItems.length; i += 1) {
    const item = formItems[i];
    if (!item.existingId) {
      await collection.create((record) => {
        record.exerciseId = exerciseId;
        record.uri = item.uri;
        record.sortOrder = i;
      });
    } else {
      const dbRecord = existing.find((r) => r.id === item.existingId);
      if (dbRecord && dbRecord.sortOrder !== i) {
        await dbRecord.update((r) => {
          r.sortOrder = i;
        });
      }
    }
  }
  return removedUris;
}

async function persistVideoDiff(
  database: ReturnType<typeof useDatabase>,
  exerciseId: string,
  existing: ExerciseVideo[],
  formItems: MediaFormItem[]
): Promise<string[]> {
  const formExistingIds = new Set(formItems.map((f) => f.existingId).filter(Boolean) as string[]);
  const toRemove = existing.filter((record) => !formExistingIds.has(record.id));
  const removedUris: string[] = [];
  for (const record of toRemove) {
    removedUris.push(record.uri);
    await record.destroyPermanently();
  }
  const collection = database.get<ExerciseVideo>('exercise_videos');
  for (let i = 0; i < formItems.length; i += 1) {
    const item = formItems[i];
    if (!item.existingId) {
      await collection.create((record) => {
        record.exerciseId = exerciseId;
        record.uri = item.uri;
        record.sortOrder = i;
      });
    } else {
      const dbRecord = existing.find((r) => r.id === item.existingId);
      if (dbRecord && dbRecord.sortOrder !== i) {
        await dbRecord.update((r) => {
          r.sortOrder = i;
        });
      }
    }
  }
  return removedUris;
}

export function useExerciseActions(exerciseId?: string): UseExerciseActionsResult {
  const database = useDatabase();

  return useMemo<UseExerciseActionsResult>(
    () => ({
      saveExercise: async (values) => {
        try {
          const collection = database.get<GymExercise>('gym_exercises');
          const tagsRaw = JSON.stringify(values.tags);
          let urisToUnlink: string[] = [];
          await database.write(async () => {
            let exercise: GymExercise;
            if (exerciseId) {
              exercise = await collection.find(exerciseId);
              await exercise.update((record) => {
                record.title = values.title.trim();
                record.description = values.description.trim();
                record.exerciseType = values.exerciseType;
                record.tagsRaw = tagsRaw;
              });
            } else {
              exercise = await collection.create((record) => {
                record.title = values.title.trim();
                record.description = values.description.trim();
                record.exerciseType = values.exerciseType;
                record.tagsRaw = tagsRaw;
              });
            }
            const [existingPhotos, existingVideos] = await Promise.all([
              exercise.sortedPhotos.fetch(),
              exercise.sortedVideos.fetch(),
            ]);
            const removedPhotoUris = await persistPhotoDiff(
              database,
              exercise.id,
              existingPhotos,
              values.photos
            );
            const removedVideoUris = await persistVideoDiff(
              database,
              exercise.id,
              existingVideos,
              values.videos
            );
            urisToUnlink = [...removedPhotoUris, ...removedVideoUris];
          });
          await unlinkMediaFiles(urisToUnlink);
        } catch (e) {
          console.error('[useExerciseActions] saveExercise failed', e);
        }
      },
      deleteExercise: async () => {
        if (!exerciseId) return;
        try {
          let urisToUnlink: string[] = [];
          await database.write(async () => {
            const exercise = await database.get<GymExercise>('gym_exercises').find(exerciseId);
            const [photos, videos] = await Promise.all([
              exercise.sortedPhotos.fetch(),
              exercise.sortedVideos.fetch(),
            ]);
            urisToUnlink = [...photos.map((p) => p.uri), ...videos.map((v) => v.uri)];
            for (const photo of photos) {
              await photo.destroyPermanently();
            }
            for (const video of videos) {
              await video.destroyPermanently();
            }
            await exercise.destroyPermanently();
          });
          await unlinkMediaFiles(urisToUnlink);
        } catch (e) {
          console.error('[useExerciseActions] deleteExercise failed', e);
        }
      },
    }),
    [database, exerciseId]
  );
}
