import { FC, useCallback, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import Carousel, { CarouselRenderItem, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles, layoutPadding } from '@ui-kits/shared-styles';
import { MediaFormItem } from '../exercise-detail-types';
import { ExerciseMediaItem, MediaCarouselSlide } from './ExerciseMediaItem';

interface Props {
  items: MediaFormItem[];
  type: 'photo' | 'video';
  maxItems: number;
  onAdd: () => void;
  onPress: (index: number) => void;
}

const carouselHeight = 280;
const screenWidth = Dimensions.get('window').width;
const carouselWidth = screenWidth - layoutPadding * 2;

export const ExerciseMediaCarousel: FC<Props> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();
  const progress = useSharedValue<number>(0);

  const slides = useMemo<MediaCarouselSlide[]>(() => {
    const mediaSlides: MediaCarouselSlide[] = props.items.map((data, index) => ({
      kind: 'media',
      data,
      index,
    }));
    if (props.items.length < props.maxItems) {
      mediaSlides.push({ kind: 'add' });
    }
    return mediaSlides;
  }, [props.items, props.maxItems]);

  const renderItem = useCallback<CarouselRenderItem<MediaCarouselSlide>>(
    (info) => {
      const slide = info.item;
      const handlePress =
        slide.kind === 'add' ? props.onAdd : () => props.onPress(slide.index);
      return (
        <ExerciseMediaItem
          item={slide}
          type={props.type}
          height={carouselHeight}
          onPress={handlePress}
        />
      );
    },
    [props.type, props.onAdd, props.onPress]
  );

  const limitReached = props.items.length >= props.maxItems;

  return (
    <View style={sharedLayoutStyles.gap8}>
      <Carousel
        width={carouselWidth}
        height={carouselHeight}
        data={slides}
        loop={false}
        pagingEnabled={true}
        onProgressChange={progress}
        renderItem={renderItem}
      />
      {slides.length > 1 && (
        <Pagination.Basic
          progress={progress}
          data={slides}
          dotStyle={{ backgroundColor: themeColors.border, borderRadius: 4, width: 6, height: 6 }}
          activeDotStyle={{ backgroundColor: themeColors.text, borderRadius: 4, width: 8, height: 8 }}
          containerStyle={[sharedLayoutStyles.gap4, sharedLayoutStyles.rowJustifyCenter]}
        />
      )}
      {limitReached && (
        <Typography
          align={'center'}
          size={12}
          color={themeColors.textSecondary}>
          {translations.track.exercise.media.maxReached.replace(
            '{count}',
            String(props.maxItems)
          )}
        </Typography>
      )}
    </View>
  );
};
