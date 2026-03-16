import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { AppThemeColors, lightColors } from '@providers/theme/colors/light-colors.ts';
import { useThemeConfig } from './ThemeConfigProvider';
import { darkColors } from '@providers/theme/colors/dark-colors.ts';

const AppThemeColorsContext = createContext<AppThemeColors | undefined>(undefined);

export const AppThemeColorsProvider: FC<PropsWithChildren> = function ({ children }) {
  const { currentTheme } = useThemeConfig();

  const colors = useMemo(() => {
    return currentTheme === 'dark' ? darkColors : lightColors;
  }, [currentTheme]);

  return <AppThemeColorsContext.Provider value={colors}>{children}</AppThemeColorsContext.Provider>;
};

export const useAppThemeColors = (): AppThemeColors => {
  const context = useContext(AppThemeColorsContext);
  if (context === undefined) {
    throw new Error('useAppThemeColors must be used within an AppThemeColorsProvider');
  }
  return context;
};
