import { AppThemeColors } from '@providers/theme/colors/light-colors';
import { InputState } from './input-types';

export type ColorKey = keyof AppThemeColors;

export interface InputColorConfig {
  border: ColorKey;
  background: ColorKey;
  text: ColorKey;
  label: ColorKey;
  placeholder: ColorKey;
  error: ColorKey;
}

const recordInputColors: Record<InputState, InputColorConfig> = {
  ['active-light']: {
    border: 'textSecondary',
    background: 'background',
    text: 'text',
    label: 'textSecondary',
    placeholder: 'textTertiary',
    error: 'error',
  },
  ['active-dark']: {
    border: 'border',
    background: 'background',
    text: 'text',
    label: 'border',
    placeholder: 'textTertiary',
    error: 'error',
  },
  focused: {
    border: 'primary400',
    background: 'background',
    text: 'text',
    label: 'primary400',
    placeholder: 'primary400',
    error: 'error',
  },
  error: {
    border: 'error',
    background: 'background',
    text: 'text',
    label: 'error',
    placeholder: 'textTertiary',
    error: 'error',
  },
  disabled: {
    border: 'gray400',
    background: 'background',
    text: 'gray400',
    label: 'gray400',
    placeholder: 'gray400',
    error: 'error',
  },
};

export function getInputColorKeys(state: InputState): InputColorConfig {
  return recordInputColors[state];
}
