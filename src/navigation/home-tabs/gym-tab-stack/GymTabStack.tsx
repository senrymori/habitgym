import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GymTabStackParamList } from './gym-tab-stack-types';
import { GymProgramListScreen } from '@screens/gym/GymProgramListScreen';
import { GymProgramDetailScreen } from '@screens/gym/GymProgramDetailScreen';
import { GymWorkoutSetupScreen } from '@screens/gym/GymWorkoutSetupScreen';
import { GymWorkoutActiveScreen } from '@screens/gym/GymWorkoutActiveScreen';
import { GymProgramHistoryScreen } from '@screens/gym/GymProgramHistoryScreen';
import { ExerciseListScreen } from '@screens/track/ExerciseListScreen';

const Stack = createNativeStackNavigator<GymTabStackParamList>();

export const GymTabStack: FC = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'GymProgramList'}
        component={GymProgramListScreen}
      />
      <Stack.Screen
        name={'GymProgramDetail'}
        component={GymProgramDetailScreen}
      />
      <Stack.Screen
        name={'GymWorkoutSetup'}
        component={GymWorkoutSetupScreen}
      />
      <Stack.Screen
        name={'GymWorkoutActive'}
        component={GymWorkoutActiveScreen}
      />
      <Stack.Screen
        name={'GymProgramHistory'}
        component={GymProgramHistoryScreen}
      />
      <Stack.Screen
        name={'ExerciseList'}
        component={ExerciseListScreen}
      />
    </Stack.Navigator>
  );
};
