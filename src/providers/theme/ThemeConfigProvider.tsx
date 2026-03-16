import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode } from './theme-types';
import { getStorageValue, setStorageValue, StorageKeysEnum } from '@utils/storage-utils';

interface ThemeConfigContextValue {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isLight: boolean;
  isDark: boolean;
}

const ThemeConfigContext = createContext<ThemeConfigContextValue | undefined>(undefined);

export const ThemeConfigProvider: FC<PropsWithChildren> = function ({ children }) {
  const systemColorScheme = useColorScheme();

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    const storedTheme = getStorageValue(StorageKeysEnum.Theme) as ThemeMode | null;
    if (storedTheme && (storedTheme === ThemeMode.light || storedTheme === ThemeMode.dark)) {
      return storedTheme;
    }
    // Fallback to system preference
    return systemColorScheme === 'dark' ? ThemeMode.dark : ThemeMode.light;
  });

  const setTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    setStorageValue(StorageKeysEnum.Theme, theme);
  };

  const isLight = useMemo(() => currentTheme === ThemeMode.light, [currentTheme]);
  const isDark = useMemo(() => currentTheme === ThemeMode.dark, [currentTheme]);

  const value: ThemeConfigContextValue = {
    currentTheme,
    setTheme,
    isLight,
    isDark,
  };

  return <ThemeConfigContext.Provider value={value}>{children}</ThemeConfigContext.Provider>;
};

export const useThemeConfig = (): ThemeConfigContextValue => {
  const context = useContext(ThemeConfigContext);
  if (context === undefined) {
    throw new Error('useThemeConfig must be used within a ThemeConfigProvider');
  }
  return context;
};
