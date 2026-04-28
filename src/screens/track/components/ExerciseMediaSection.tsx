import { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import {
  ExerciseFormValues,
  MAX_EXERCISE_PHOTOS,
  MAX_EXERCISE_VIDEOS,
} from '../exercise-detail-types';
import { useMediaPickerActions } from '../exercise-media-hooks';
import { ExerciseMediaCarousel } from './ExerciseMediaCarousel';
import { ExerciseMediaPreviewModal } from './ExerciseMediaPreviewModal';

export const ExerciseMediaSection: FC = function () {
  const form = useFormContext<ExerciseFormValues>();
  const { translations } = useLanguage();
  const photos = useWatch({ control: form.control, name: 'photos' });
  const videos = useWatch({ control: form.control, name: 'videos' });
  const { pickPhoto, pickVideo, removePhoto, removeVideo } = useMediaPickerActions(form);

  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number | null>(null);
  const [previewVideoIndex, setPreviewVideoIndex] = useState<number | null>(null);

  const handlePhotoPress = useCallback((index: number) => setPreviewPhotoIndex(index), []);
  const handleVideoPress = useCallback((index: number) => setPreviewVideoIndex(index), []);
  const handleClosePhotoPreview = useCallback(() => setPreviewPhotoIndex(null), []);
  const handleCloseVideoPreview = useCallback(() => setPreviewVideoIndex(null), []);

  const handleDeletePhoto = useCallback(() => {
    if (previewPhotoIndex === null) return;
    void removePhoto(previewPhotoIndex);
  }, [previewPhotoIndex, removePhoto]);

  const handleDeleteVideo = useCallback(() => {
    if (previewVideoIndex === null) return;
    void removeVideo(previewVideoIndex);
  }, [previewVideoIndex, removeVideo]);

  const previewPhoto = previewPhotoIndex !== null ? photos[previewPhotoIndex] ?? null : null;
  const previewVideo = previewVideoIndex !== null ? videos[previewVideoIndex] ?? null : null;

  return (
    <View style={sharedLayoutStyles.gap16}>
      <View style={sharedLayoutStyles.gap8}>
        <Typography
          size={16}
          weight={600}>
          {translations.track.exercise.media.photos}
        </Typography>
        <ExerciseMediaCarousel
          items={photos}
          type={'photo'}
          maxItems={MAX_EXERCISE_PHOTOS}
          onAdd={pickPhoto}
          onPress={handlePhotoPress}
        />
      </View>
      <View style={sharedLayoutStyles.gap8}>
        <Typography
          size={16}
          weight={600}>
          {translations.track.exercise.media.videos}
        </Typography>
        <ExerciseMediaCarousel
          items={videos}
          type={'video'}
          maxItems={MAX_EXERCISE_VIDEOS}
          onAdd={pickVideo}
          onPress={handleVideoPress}
        />
      </View>
      <ExerciseMediaPreviewModal
        visible={previewPhoto !== null}
        type={'photo'}
        item={previewPhoto}
        onClose={handleClosePhotoPreview}
        onDelete={handleDeletePhoto}
      />
      <ExerciseMediaPreviewModal
        visible={previewVideo !== null}
        type={'video'}
        item={previewVideo}
        onClose={handleCloseVideoPreview}
        onDelete={handleDeleteVideo}
      />
    </View>
  );
};
