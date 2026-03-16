import { TextStyle, TouchableOpacityProps } from 'react-native';
import { TextSize } from '@ui-kits/Typography/typography-types';
import { IconEnum } from '../Typography/typography-consts';

export type ButtonSize = 'small' | 'medium' | 'large';

export type IconPosition = 'left' | 'right';

export type ButtonVariant = 'fill' | 'outline';

export type ButtonColorVariant =
  | 'blue'
  | 'primary'
  | 'primary-theme-similar'
  | 'primary-theme-alternative'
  | 'contrast';

export interface ButtonBaseProps extends TouchableOpacityProps {
  size?: ButtonSize;
  loading?: boolean;
  variant?: ButtonVariant;
  colorVariant?: ButtonColorVariant;
  onPress?: () => void;
  isStaticColor?: boolean; // used colors of light-colors
}

export interface ButtonTextProps extends ButtonBaseProps {
  text: string;
  textStyle?: TextStyle;
}

export interface ButtonIconProps extends ButtonBaseProps {
  icon: IconEnum;
  iconSize?: TextSize;
}

export interface ButtonUniversalProps extends ButtonBaseProps {
  text: string;
  icon: IconEnum;
  iconPosition?: IconPosition;
  textStyle?: TextStyle;
}

export type ButtonSizeConfig = {
  height: number;
  paddingHorizontal: number;
  fontSize: TextSize;
  iconSize: TextSize;
  borderRadius: number;
};
