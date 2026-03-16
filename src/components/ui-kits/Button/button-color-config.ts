import { ButtonColorVariant, ButtonVariant } from './button-types';
import { AppThemeColors } from '@providers/theme/colors/light-colors';

export type ColorKey = keyof AppThemeColors;

export interface ButtonColorConfig {
  active: {
    main: ColorKey;
    pressed: ColorKey;
    text: ColorKey;
  };
  disabled: {
    main: ColorKey;
    text: ColorKey;
  };
}

export const buttonColorConfigs: Record<ButtonColorVariant, ButtonColorConfig> = {
  blue: {
    active: {
      main: 'blue500',
      pressed: 'blue600',
      text: 'strongWhite',
    },
    disabled: {
      main: 'blue300',
      text: 'blue500',
    },
  },
  primary: {
    active: {
      main: 'primary400',
      pressed: 'primary300',
      text: 'strongWhite',
    },
    disabled: {
      main: 'primary50',
      text: 'primary200',
    },
  },
  ['primary-theme-similar']: {
    active: {
      main: 'primary50',
      pressed: 'primary300',
      text: 'strongWhite',
    },
    disabled: {
      main: 'primary200',
      text: 'primary400',
    },
  },
  ['primary-theme-alternative']: {
    active: {
      main: 'primary900',
      pressed: 'primary800',
      text: 'strongWhite',
    },
    disabled: {
      main: 'primary200',
      text: 'primary400',
    },
  },
  contrast: {
    active: {
      main: 'gray900',
      pressed: 'gray500',
      text: 'textAlternative',
    },
    disabled: {
      main: 'gray400',
      text: 'gray500',
    },
  },
};

export function getButtonColorKeys(
  buttonVariant: ButtonVariant,
  colorVariant: ButtonColorVariant,
  disabled: boolean,
  loading: boolean
): { mainColorKey: ColorKey; textColorKey: ColorKey; pressedColorKey: ColorKey } {
  const config = buttonColorConfigs[colorVariant];
  const isOutline = buttonVariant === 'outline';

  if (disabled || loading) {
    return {
      mainColorKey: config.disabled.main,
      textColorKey: isOutline ? config.disabled.main : config.disabled.text,
      pressedColorKey: config.disabled.main,
    };
  }

  return {
    mainColorKey: config.active.main,
    textColorKey: isOutline ? config.active.main : config.active.text,
    pressedColorKey: config.active.pressed,
  };
}
