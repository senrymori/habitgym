import { FC, useCallback, useEffect } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { SegmentItem } from './SegmentItem';

const PADDING = 3;
const GAP = 3;
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
      const totalWidth = event.nativeEvent.layout.width;
      const sw =
        (totalWidth - PADDING * 2 - GAP * (props.segments.length - 1)) / props.segments.length;
      segmentWidth.value = sw;
      thumbTranslateX.value = props.selectedIndex * (sw + GAP);
    },
    [props.segments.length, props.selectedIndex, segmentWidth, thumbTranslateX],
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
    [props.selectedIndex, props.onChange, themeColors],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.backgroundTertiary,
          borderColor: themeColors.border,
        },
        props.style,
      ]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: PADDING,
    gap: GAP,
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: 8,
    borderWidth: 1,
  },
});
