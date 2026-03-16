import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PinCodeStackParamList } from '@navigation/pin-code-stack/pin-code-stack-types.ts';
import { PinSetupScreen } from '@screens/pin/PinSetupScreen.tsx';
import { PinLoginScreen } from '@screens/pin/PinLoginScreen.tsx';

const Stack = createNativeStackNavigator<PinCodeStackParamList>();

export const PinCodeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'PinSetup'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'PinSetup'}
        component={PinSetupScreen}
      />
      <Stack.Screen
        name={'PinLogin'}
        component={PinLoginScreen}
      />
    </Stack.Navigator>
  );
};
