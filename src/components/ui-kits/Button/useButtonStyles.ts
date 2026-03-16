import { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { AppThemeColors, lightColors } from '@providers/theme/colors/light-colors';
import { ButtonColorVariant, ButtonVariant } from './button-types';
import { getButtonColorKeys } from './button-color-config';

export interface ButtonStyles {
  containerStyle: ViewStyle;
  pressedStyle: ViewStyle;
  textColor: AppThemeColors[keyof AppThemeColors];
}

export function useButtonStyles(
  isStaticColor = false,
  buttonVariant: ButtonVariant = 'fill',
  colorVariant: ButtonColorVariant = 'primary',
  disabled = false,
  loading = false
): ButtonStyles {
  const themeColors = useAppThemeColors();
  const colors = isStaticColor ? lightColors : themeColors;

  return useMemo(() => {
    const colorKeys = getButtonColorKeys(buttonVariant, colorVariant, disabled, loading);
    const mainColor = colors[colorKeys.mainColorKey];
    const pressedColor = colors[colorKeys.pressedColorKey];

    switch (buttonVariant) {
      case 'outline':
        return {
          containerStyle: { backgroundColor: 'transparent', borderWidth: 1, borderColor: mainColor },
          pressedStyle: { backgroundColor: 'transparent', borderWidth: 1, borderColor: pressedColor },
          textColor: colors[colorKeys.textColorKey],
        };
      default:
        return {
          containerStyle: { backgroundColor: mainColor, borderColor: 'transparent' },
          pressedStyle: { backgroundColor: pressedColor, borderColor: 'transparent' },
          textColor: colors[colorKeys.textColorKey],
        };
    }
  }, [buttonVariant, colorVariant, disabled, loading, colors]);
}
