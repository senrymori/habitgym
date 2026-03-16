import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { AppThemeColors } from '@providers/theme/colors/light-colors.ts';
import { useAppThemeColors } from './AppThemeColorsProvider';

/**
 * Creates theme styles object from colors
 * This function is used as source of truth for AppThemeStyles type
 */
function createThemeStyles(colors: AppThemeColors) {
  return StyleSheet.create({
    // Main gray styles
    gray: { color: colors.gray400 },
    gray50BG: { backgroundColor: colors.gray50 },
    gray100BG: { backgroundColor: colors.gray100 },
    gray200BG: { backgroundColor: colors.gray200 },
    gray300BG: { backgroundColor: colors.gray300 },
    grayBG: { backgroundColor: colors.gray400 },
    gray500BG: { backgroundColor: colors.gray500 },
    gray600BG: { backgroundColor: colors.gray600 },
    gray700BG: { backgroundColor: colors.gray700 },
    gray800BG: { backgroundColor: colors.gray800 },
    gray900BG: { backgroundColor: colors.gray900 },
    grayBorder: { borderColor: colors.gray400 },

    // Primary styles
    primary: { color: colors.primary400 },
    primary50BG: { backgroundColor: colors.primary50 },
    primary100BG: { backgroundColor: colors.primary100 },
    primary200BG: { backgroundColor: colors.primary200 },
    primary300BG: { backgroundColor: colors.primary300 },
    primaryBG: { backgroundColor: colors.primary400 },
    primary500BG: { backgroundColor: colors.primary500 },
    primary600BG: { backgroundColor: colors.primary600 },
    primary700BG: { backgroundColor: colors.primary700 },
    primary800BG: { backgroundColor: colors.primary800 },
    primary900BG: { backgroundColor: colors.primary900 },
    primaryBorder: { borderColor: colors.primary400 },
    primaryBorder100: { borderColor: colors.primary100 },
    primaryGlow: {
      boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: 12, spreadDistance: 4, color: colors.primary400 + '80' }],
    },

    // Blue styles
    blue: { color: colors.blue400 },
    blue50BG: { backgroundColor: colors.blue50 },
    blue100BG: { backgroundColor: colors.blue100 },
    blue200BG: { backgroundColor: colors.blue200 },
    blue300BG: { backgroundColor: colors.blue300 },
    blueBG: { backgroundColor: colors.blue400 },
    blue500BG: { backgroundColor: colors.blue500 },
    blue600BG: { backgroundColor: colors.blue600 },
    blue700BG: { backgroundColor: colors.blue700 },
    blue800BG: { backgroundColor: colors.blue800 },
    blue900BG: { backgroundColor: colors.blue900 },

    // Typography styles
    textMain: { color: colors.text },
    textSecondary: { color: colors.textSecondary },
    textTertiary: { color: colors.textTertiary },

    // Background styles
    backgroundMain: { backgroundColor: colors.background },
    backgroundSecondary: { backgroundColor: colors.backgroundSecondary },
    backgroundTertiary: { backgroundColor: colors.backgroundTertiary },

    // Border styles
    borderMain: { borderColor: colors.border },
    borderSecondary: { borderColor: colors.borderSecondary },

    // Status styles
    success: { color: colors.success },
    successBG: { backgroundColor: colors.success },
    warning: { color: colors.warning },
    warningBG: { backgroundColor: colors.warning },
    error: { color: colors.error },
    errorBG: { backgroundColor: colors.error },
    info: { color: colors.info },
    infoBG: { backgroundColor: colors.info },
  });
}

export type AppThemeStyles = ReturnType<typeof createThemeStyles>;

const AppThemeStylesContext = createContext<AppThemeStyles | undefined>(undefined);

export const AppThemeStylesProvider: FC<PropsWithChildren> = function ({ children }) {
  const themeColors = useAppThemeColors();
  const styles = useMemo(() => createThemeStyles(themeColors), [themeColors]);
  return <AppThemeStylesContext.Provider value={styles}>{children}</AppThemeStylesContext.Provider>;
};

export const useAppThemeStyles = (): AppThemeStyles => {
  const context = useContext(AppThemeStylesContext);
  if (context === undefined) {
    throw new Error('useAppThemeStyles must be used within an AppThemeStylesProvider');
  }
  return context;
};
