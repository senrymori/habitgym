import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

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
