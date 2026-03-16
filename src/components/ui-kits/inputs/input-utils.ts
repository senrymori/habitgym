import { InputState } from './input-types';

interface ResolveInputStateParams {
  errorText?: string;
  disabled?: boolean;
  isFocused: boolean;
  isDark: boolean;
}

export function resolveInputState({ errorText, disabled, isFocused, isDark }: ResolveInputStateParams): InputState {
  if (errorText) return 'error';
  if (disabled) return 'disabled';
  if (isFocused) return 'focused';

  return isDark ? 'active-dark' : 'active-light';
}