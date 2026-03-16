export const ThemeMode = {
  light: 'light',
  dark: 'dark',
} as const;
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
