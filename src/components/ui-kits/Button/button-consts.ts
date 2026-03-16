import { ButtonSize, ButtonSizeConfig } from './button-types';
import { TextSize } from '@ui-kits/Typography/typography-types';

export const buttonSizeConfig: Record<ButtonSize, ButtonSizeConfig> = {
  small: {
    height: 32,
    paddingHorizontal: 12,
    fontSize: 14,
    iconSize: 16,
    borderRadius: 8,
  },
  medium: {
    height: 56,
    paddingHorizontal: 20,
    fontSize: 18,
    iconSize: 20,
    borderRadius: 12,
  },
  large: {
    height: 64,
    paddingHorizontal: 24,
    fontSize: 20,
    iconSize: 24,
    borderRadius: 16,
  },
};

export const iconOnlySizeConfig: Record<
  ButtonSize,
  { width: number; height: number; iconSize: TextSize; borderRadius: number }
> = {
  small: {
    width: 32,
    height: 32,
    iconSize: 16,
    borderRadius: 8,
  },
  medium: {
    width: 44,
    height: 44,
    iconSize: 20,
    borderRadius: 12,
  },
  large: {
    width: 56,
    height: 56,
    iconSize: 24,
    borderRadius: 16,
  },
};
