import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createContext, type FC, type PropsWithChildren, useContext, useMemo } from 'react';
import { getSafeAreaStyles } from '@providers/safe-area-styles/safe-area-styles.ts';

type SafeAreaStylesContextType = ReturnType<typeof getSafeAreaStyles>;

const SafeAreaStylesContext = createContext<SafeAreaStylesContextType>(
  getSafeAreaStyles({
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  })
);

export const SafeAreaStylesProvider: FC<PropsWithChildren> = function SafeAreaStylesProvider(props) {
  const insets = useSafeAreaInsets();

  const value = useMemo<SafeAreaStylesContextType>(() => getSafeAreaStyles(insets), [insets]);

  return <SafeAreaStylesContext.Provider value={value}>{props.children}</SafeAreaStylesContext.Provider>;
};

export function useSafeAreaStyles() {
  const context = useContext(SafeAreaStylesContext);

  if (context === undefined) {
    throw new Error('useSafeAreaStyles must be used within a SafeAreaStylesProvider');
  }

  return context;
}
