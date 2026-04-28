import { FC } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { MediaFormItem } from '../exercise-detail-types';

export type MediaCarouselSlide =
  | { kind: 'add' }
  | { kind: 'media'; data: MediaFormItem; index: number };

interface Props {
  item: MediaCarouselSlide;
  type: 'photo' | 'video';
  height: number;
  onPress: () => void;
}

export const ExerciseMediaItem: FC<Props> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();

  if (props.item.kind === 'add') {
    return (
      <Pressable
        onPress={props.onPress}
        style={[
          styles.slide,
          sharedLayoutStyles.center,
          sharedLayoutStyles.gap8,
          {
            height: props.height,
            borderColor: themeColors.border,
            backgroundColor: themeColors.backgroundSecondary,
          },
        ]}>
        <Typography
          icon={IconEnum.Plus}
          size={32}
          color={themeColors.textSecondary}
        />
        <Typography
          size={14}
          color={themeColors.textSecondary}>
          {translations.track.exercise.media.add}
        </Typography>
      </Pressable>
    );
  }

  const uri = props.item.data.uri;
  const sourceUri = uri.startsWith('file://') || uri.startsWith('content://') ? uri : `file://${uri}`;

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.slide, { height: props.height, backgroundColor: themeColors.primary800 }]}>
      <Image
        source={{ uri: sourceUri }}
        style={sharedLayoutStyles.fullLayout}
        resizeMode={'cover'}
      />
      {props.type === 'video' && (
        <View style={[styles.playOverlay, sharedLayoutStyles.center]}>
          <Typography
            icon={IconEnum.VideoFill}
            size={32}
            color={themeColors.strongWhite}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
