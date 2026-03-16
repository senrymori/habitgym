import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppContainer } from '@navigation/AppContainer.tsx';
import { LanguageProvider } from '@providers/language/LanguageProvider';
import { ThemeConfigProvider } from '@providers/theme/ThemeConfigProvider';
import { AppThemeColorsProvider } from '@providers/theme/AppThemeColorsProvider';
import { AppThemeStylesProvider } from '@providers/theme/AppThemeStylesProvider';
import { SafeAreaStylesProvider } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';

function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <KeyboardProvider>
          <SafeAreaStylesProvider>
            <ThemeConfigProvider>
              <AppThemeColorsProvider>
                <AppThemeStylesProvider>
                  <LanguageProvider>
                    <BottomSheetModalProvider>
                      <AppContainer />
                    </BottomSheetModalProvider>
                  </LanguageProvider>
                </AppThemeStylesProvider>
              </AppThemeColorsProvider>
            </ThemeConfigProvider>
          </SafeAreaStylesProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
