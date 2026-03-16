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
  primary50: '#FFEBFE',
  primary100: '#F5C4FD',
  primary200: '#E98EFB',
  primary300: '#CC3DEA',
  primary400: '#72008C',
  primary500: '#5A006E',
  primary600: '#460056',
  primary700: '#33003E',
  primary800: '#200028',
  primary900: '#110015',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9F8F8',
  backgroundTertiary: '#EBEBEB',

  // Typography colors
  text: '#0F0806',
  textSecondary: '#9C9C9C',
  textTertiary: '#C7C7C7',
  textAlternative: '#FFFFFF',

  // Border colors
  border: '#DDDDDD',
  borderSecondary: '#CBCBCB',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

/**
 * AppThemeColors type is derived from lightColors
 * This ensures type safety and single source of truth
 */
export type AppThemeColors = typeof lightColors;
