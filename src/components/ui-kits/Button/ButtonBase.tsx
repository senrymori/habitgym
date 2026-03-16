import { FC, PropsWithChildren, useCallback } from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ButtonBaseProps } from './button-types';
import { buttonSizeConfig } from './button-consts';
import { useButtonStyles } from './useButtonStyles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ButtonBase: FC<ButtonBaseProps & PropsWithChildren> = function (props) {
  const {
    size = 'medium',
    loading = false,
    disabled = false,
    variant = 'fill',
    colorVariant = 'primary',
    isStaticColor,
    onPress,
    style,
    children,
    ...rest
  } = props;

  const buttonStyles = useButtonStyles(isStaticColor, variant, colorVariant, disabled, loading);
  const pressed = useSharedValue(0);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => {
    if (isDisabled) {
      return buttonStyles.containerStyle;
    }

    const progress = pressed.value;
    const fromStyle = buttonStyles.containerStyle;
    const toStyle = buttonStyles.pressedStyle;

    const result: ViewStyle = { ...fromStyle };

    if (fromStyle.backgroundColor && toStyle.backgroundColor) {
      result.backgroundColor = interpolateColor(
        progress,
        [0, 1],
        [fromStyle.backgroundColor as string, toStyle.backgroundColor as string]
      );
    }

    if (fromStyle.borderColor && toStyle.borderColor) {
      result.borderColor = interpolateColor(
        progress,
        [0, 1],
        [fromStyle.borderColor as string, toStyle.borderColor as string]
      );
    }

    return result;
  });

  const handlePressIn = useCallback(() => {
    if (!isDisabled) {
      pressed.value = withTiming(1, { duration: 150 });
    }
  }, [isDisabled, pressed]);

  const handlePressOut = useCallback(() => {
    if (!isDisabled) {
      pressed.value = withTiming(0, { duration: 150 });
    }
  }, [isDisabled, pressed]);

  const handlePress = useCallback(() => {
    if (!isDisabled && onPress) {
      onPress();
    }
  }, [isDisabled, onPress]);

  const sizeConfig = buttonSizeConfig[size];
  const buttonStyle: ViewStyle = {
    height: sizeConfig.height,
    borderRadius: sizeConfig.borderRadius,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[buttonStyle, animatedStyle, style]}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={buttonStyles.textColor}
        />
      ) : (
        children
      )}
    </AnimatedTouchableOpacity>
  );
};
