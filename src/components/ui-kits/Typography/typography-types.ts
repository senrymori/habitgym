import { TextProps as RNTextProps, TextStyle } from 'react-native';
import { AppThemeColors } from '@providers/theme/colors/light-colors.ts';
import { IconEnum } from './typography-consts.ts';

export type TextAlign = 'left' | 'center' | 'right';

export type TextSize = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32;

export type TextWeight = 300 | 400 | 500 | 600 | 700 | 800;

export type TextColorVariant = 'text' | 'textSecondary' | 'textTertiary';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  align?: TextAlign;
  size?: TextSize;
  weight?: TextWeight;
  colorVariant?: TextColorVariant;
  color?: AppThemeColors[keyof AppThemeColors];
  transform?: TextStyle['textTransform'];
  icon?: IconEnum;
  style?: RNTextProps['style'];
}
