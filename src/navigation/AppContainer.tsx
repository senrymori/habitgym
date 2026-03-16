import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigation-types';
import { SplashScreen } from '@screens/splash/SplashScreen';
import { PinCodeStack } from '@navigation/pin-code-stack/PinCodeStack.tsx';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { StatusBar } from 'react-native';
import { Fragment, useMemo } from 'react';
import { HomeTabs } from '@navigation/home-tabs/HomeTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppContainer = () => {
  const { isDark } = useThemeConfig();
  const themeColors = useAppThemeColors();

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: themeColors.background,
      },
    }),
    [themeColors.background]
  );

  return (
    <Fragment>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={true}
        animated={true}
        backgroundColor={'#FFFFFF00'}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={'Splash'}
          screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen
            name={'Splash'}
            component={SplashScreen}
          />
          <Stack.Screen
            name={'PinCodeStack'}
            component={PinCodeStack}
          />
          <Stack.Screen
            name={'HomeTabs'}
            component={HomeTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Fragment>
  );
};
