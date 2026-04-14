import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HabitTabStackParamList } from './habit-tab-stack-types';
import { HabitListScreen } from '@screens/habits/HabitListScreen';
import { HabitDetailScreen } from '@screens/habits/HabitDetailScreen';
import { HabitCreateScreen } from '@screens/habits/HabitCreateScreen';

const Stack = createNativeStackNavigator<HabitTabStackParamList>();

export const HabitTabStack: FC = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'HabitList'}
        component={HabitListScreen}
      />
      <Stack.Screen
        name={'HabitDetail'}
        component={HabitDetailScreen}
      />
      <Stack.Screen
        name={'HabitCreate'}
        component={HabitCreateScreen}
      />
    </Stack.Navigator>
  );
};
