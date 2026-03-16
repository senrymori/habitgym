import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabStackParamList } from './home-tab-stack-types';
import { HomeDrawer } from './home-drawer/HomeDrawer';

const Stack = createNativeStackNavigator<HomeTabStackParamList>();

export const HomeTabStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'Home'}
        component={HomeDrawer}
      />
    </Stack.Navigator>
  );
};
