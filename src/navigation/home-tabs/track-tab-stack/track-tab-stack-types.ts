import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type TrackTabStackParamList = {
  TrackMain: undefined;
  ExerciseList: { mode: 'select' | 'edit' };
  ExerciseDetail: { exerciseId?: string };
  WeightProgress: undefined;
  MealPlanList: undefined;
  MealPlanDay: { planId: string };
};

export type TrackTabStackNavigationScreenProps<T extends keyof TrackTabStackParamList> = NativeStackScreenProps<
  TrackTabStackParamList,
  T
>;

export type TrackTabStackNavigationHookProps<T extends keyof TrackTabStackParamList = keyof TrackTabStackParamList> =
  NativeStackNavigationProp<TrackTabStackParamList, T>;
