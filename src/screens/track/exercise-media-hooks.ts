import { useMemo } from 'react';
import { Alert } from 'react-native';
import { UseFormReturn } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ExerciseFormValues, MAX_EXERCISE_PHOTOS, MAX_EXERCISE_VIDEOS } from './exercise-detail-types';
import { copyMediaToAppStorage, getExtensionFromUri, unlinkMediaFile } from './exercise-media-utils';

interface UseMediaPickerActionsResult {
  pickPhoto: () => Promise<void>;
  pickVideo: () => Promise<void>;
  removePhoto: (index: number) => Promise<void>;
  removeVideo: (index: number) => Promise<void>;
}

export function useMediaPickerActions(
  form: UseFormReturn<ExerciseFormValues>
): UseMediaPickerActionsResult {
  const { translations } = useLanguage();

  return useMemo<UseMediaPickerActionsResult>(() => {
    function showLimitAlert(count: number): void {
      Alert.alert(translations.track.exercise.media.maxReached.replace('{count}', String(count)));
    }

    async function pickAndAdd(type: 'photo' | 'video'): Promise<void> {
      const fieldName = type === 'photo' ? 'photos' : 'videos';
      const maxItems = type === 'photo' ? MAX_EXERCISE_PHOTOS : MAX_EXERCISE_VIDEOS;
      const current = form.getValues(fieldName);
      if (current.length >= maxItems) {
        showLimitAlert(maxItems);
        return;
      }
      try {
        const result = await launchImageLibrary({
          mediaType: type === 'photo' ? 'photo' : 'video',
          selectionLimit: 1,
        });
        if (result.didCancel) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;
        const ext = getExtensionFromUri(asset.fileName ?? asset.uri, type);
        const localUri = await copyMediaToAppStorage(asset.uri, ext);
        form.setValue(fieldName, [...current, { uri: localUri }], {
          shouldDirty: true,
          shouldValidate: false,
        });
      } catch (e) {
        console.error('[useMediaPickerActions] pickAndAdd failed', type, e);
      }
    }

    async function removeAt(type: 'photo' | 'video', index: number): Promise<void> {
      const fieldName = type === 'photo' ? 'photos' : 'videos';
      const current = form.getValues(fieldName);
      const removed = current[index];
      if (!removed) return;
      const next = current.filter((_, i) => i !== index);
      form.setValue(fieldName, next, { shouldDirty: true, shouldValidate: false });
      // Files for items already saved in DB are unlinked on save (after diff), keeping FS consistent
      // even if the user dismisses without saving.
      if (!removed.existingId) {
        await unlinkMediaFile(removed.uri);
      }
    }

    return {
      pickPhoto: () => pickAndAdd('photo'),
      pickVideo: () => pickAndAdd('video'),
      removePhoto: (index) => removeAt('photo', index),
      removeVideo: (index) => removeAt('video', index),
    };
  }, [form, translations]);
}
