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
  primary50: '#2B0035',
  primary100: '#3F004E',
  primary200: '#660080',
  primary300: '#B22FD4',
  primary400: '#E56EFF',
  primary500: '#E987FF',
  primary600: '#EEA3FF',
  primary700: '#F3BDFF',
  primary800: '#F8D6FF',
  primary900: '#FEF2FF',

  // Background colors
  background: '#131313',
  backgroundSecondary: '#232323',
  backgroundTertiary: '#3C3C3C',

  // Typography colors
  text: '#FFFFFF',
  textSecondary: '#6B6969',
  textTertiary: '#3E3E3E',
  textAlternative: '#0F0806',

  // Border colors
  border: '#232323',
  borderSecondary: '#3C3C3C',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#60A5FA',
};
