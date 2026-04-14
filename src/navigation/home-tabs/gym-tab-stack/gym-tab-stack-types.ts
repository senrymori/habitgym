import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type GymTabStackParamList = {
  GymProgramList: undefined;
  GymProgramDetail: { programId?: string };
  GymWorkoutSetup: { programId: string };
  GymWorkoutActive: { sessionId: string };
  GymProgramHistory: { programId: string };
};

export type GymTabStackNavigationScreenProps<T extends keyof GymTabStackParamList> = NativeStackScreenProps<
  GymTabStackParamList,
  T
>;

export type GymTabStackNavigationHookProps<T extends keyof GymTabStackParamList = keyof GymTabStackParamList> =
  NativeStackNavigationProp<GymTabStackParamList, T>;
