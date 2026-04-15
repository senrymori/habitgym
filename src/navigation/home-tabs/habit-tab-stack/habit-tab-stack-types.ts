import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/core';

export type HabitTabStackParamList = {
  HabitList: undefined;
  HabitDetail: { habitId: string };
  HabitCreate: { habitId?: string };
};

export type HabitTabStackNavigationScreenProps<T extends keyof HabitTabStackParamList> = NativeStackScreenProps<
  HabitTabStackParamList,
  T
>;

export type HabitTabStackNavigationHookProps<T extends keyof HabitTabStackParamList = keyof HabitTabStackParamList> =
  NativeStackNavigationProp<HabitTabStackParamList, T>;

export type HabitRoute<T extends keyof HabitTabStackParamList> = RouteProp<HabitTabStackParamList, T>;
