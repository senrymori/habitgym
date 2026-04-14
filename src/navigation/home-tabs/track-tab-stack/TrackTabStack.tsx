import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrackTabStackParamList } from './track-tab-stack-types';
import { TrackMainScreen } from '@screens/track/TrackMainScreen';
import { ExerciseListScreen } from '@screens/track/ExerciseListScreen';
import { ExerciseDetailScreen } from '@screens/track/ExerciseDetailScreen';
import { WeightProgressScreen } from '@screens/track/WeightProgressScreen';
import { MealPlanListScreen } from '@screens/track/MealPlanListScreen';
import { MealPlanDayScreen } from '@screens/track/MealPlanDayScreen';

const Stack = createNativeStackNavigator<TrackTabStackParamList>();

export const TrackTabStack: FC = function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'TrackMain'}
        component={TrackMainScreen}
      />
      <Stack.Screen
        name={'ExerciseList'}
        component={ExerciseListScreen}
      />
      <Stack.Screen
        name={'ExerciseDetail'}
        component={ExerciseDetailScreen}
      />
      <Stack.Screen
        name={'WeightProgress'}
        component={WeightProgressScreen}
      />
      <Stack.Screen
        name={'MealPlanList'}
        component={MealPlanListScreen}
      />
      <Stack.Screen
        name={'MealPlanDay'}
        component={MealPlanDayScreen}
      />
    </Stack.Navigator>
  );
};
