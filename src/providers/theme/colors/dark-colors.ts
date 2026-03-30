import { AppThemeColors } from './light-colors.ts';

/**
 * Dark theme colors
 * TypeScript will ensure all properties from lightColors are present
 */
export const darkColors: AppThemeColors = {
  // Base colors
  strongWhite: '#FFFFFF',
  strongBlack: '#000000',

  // Blue colors (adjusted for dark)
  blue50: '#1E3A8A',
  blue100: '#1E40AF',
  blue200: '#1D4ED8',
  blue300: '#2563EB',
  blue400: '#3B82F6',
  blue500: '#60A5FA',
  blue600: '#93C5FD',
  blue700: '#BFDBFE',
  blue800: '#DBEAFE',
  blue900: '#EFF6FF',

  // Gray colors (adjusted for dark)
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',

  // Rose colors (adjusted for dark)
  rose50: '#881337',
  rose100: '#9F1239',
  rose200: '#BE123C',
  rose300: '#E11D48',
  rose400: '#F43F5E',
  rose500: '#FB7185',
  rose600: '#FDA4AF',
  rose700: '#FECDD3',
  rose800: '#FFE4E6',
  rose900: '#FFF1F2',

  // Main colors
  primary50: '#0C1716',
  primary100: '#162926',
  primary200: '#274A45',
  primary300: '#50847F',
  primary400: '#61938E',
  primary500: '#81AAA5',
  primary600: '#A0BFBC',
  primary700: '#BFD4D2',
  primary800: '#DDEAE8',
  primary900: '#F1F6F5',

  // Background colors
  background: '#2A3D3E',
  backgroundSecondary: '#3B5159',
  backgroundTertiary: '#39595C',

  // Typography colors
  text: '#D9E2E7',
  textSecondary: '#81A494',
  textTertiary: '#536B60',
  textAlternative: '#2A3D3E',

  // Border colors
  border: '#536B60',
  borderSecondary: '#81A494',

  // Status colors
  success: '#44DF58',
  warning: '#FFAE00',
  error: '#FF4A4A',
  info: '#41B9FF',
};
