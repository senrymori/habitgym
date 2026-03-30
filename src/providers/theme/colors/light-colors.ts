/**
 * Light theme colors
 * This is the source of truth for AppThemeColors type
 */
export const lightColors = {
  // Base colors
  strongWhite: '#FFFFFF',
  strongBlack: '#000000',

  // Blue colors
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A',

  // Gray colors
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Rose colors
  rose50: '#FFF1F2',
  rose100: '#FFE4E6',
  rose200: '#FECDD3',
  rose300: '#FDA4AF',
  rose400: '#FB7185',
  rose500: '#F43F5E',
  rose600: '#E11D48',
  rose700: '#BE123C',
  rose800: '#9F1239',
  rose900: '#881337',

  // Main
  primary50: '#E8F0F1',
  primary100: '#CFDCDE',
  primary200: '#9AAFB2',
  primary300: '#647A7E',
  primary400: '#314849',
  primary500: '#283C3D',
  primary600: '#1F3031',
  primary700: '#172425',
  primary800: '#0F1819',
  primary900: '#080D0D',

  // Background colors
  background: '#D9E2E7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E6F6FF',

  // Typography colors
  text: '#314849',
  textSecondary: '#647A7E',
  textTertiary: '#8A9395',
  textAlternative: '#D9E2E7',

  // Border colors
  border: '#B9C7C9',
  borderSecondary: '#647A7E',

  // Status colors
  success: '#00803A',
  warning: '#AB7500',
  error: '#A50000',
  info: '#0073B2',
};

/**
 * AppThemeColors type is derived from lightColors
 * This ensures type safety and single source of truth
 */
export type AppThemeColors = typeof lightColors;
