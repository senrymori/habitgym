import { FC, useCallback, useEffect } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { SegmentItem } from './SegmentItem';
import { Card } from '@ui-kits/Card.tsx';

const PADDING = 6;
const GAP = 4;
const ANIMATION_DURATION = 200;

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const SegmentedControl: FC<SegmentedControlProps> = function (props) {
  const themeColors = useAppThemeColors();
  const thumbTranslateX = useSharedValue(0);
  const segmentWidth = useSharedValue(0);

  useEffect(() => {
    if (segmentWidth.value === 0) return;
    thumbTranslateX.value = withTiming(props.selectedIndex * (segmentWidth.value + GAP), {
      duration: ANIMATION_DURATION,
    });
  }, [props.selectedIndex, segmentWidth, thumbTranslateX]);

  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const totalWidth = event.nativeEvent.layout.width - 2;
      const sw = (totalWidth - PADDING * 2 - GAP * (props.segments.length - 1)) / props.segments.length;
      segmentWidth.value = sw;
      thumbTranslateX.value = props.selectedIndex * (sw + GAP);
    },
    [props.segments.length, props.selectedIndex, segmentWidth, thumbTranslateX]
  );

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbTranslateX.value }],
    width: segmentWidth.value,
  }));

  const renderItem = useCallback(
    (segment: string, index: number) => {
      return (
        <SegmentItem
          key={index}
          item={segment}
          isSelected={index === props.selectedIndex}
          onPress={() => props.onChange(index)}
          textColor={themeColors.text}
          textSecondaryColor={themeColors.textSecondary}
        />
      );
    },
    [props.selectedIndex, props.onChange, themeColors]
  );

  return (
    <Card
      style={[styles.container, props.style]}
      onLayout={handleContainerLayout}>
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
          },
          animatedThumbStyle,
        ]}
      />
      {props.segments.map(renderItem)}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: PADDING,
    gap: GAP,
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: 12,
    borderWidth: 1,
  },
});
