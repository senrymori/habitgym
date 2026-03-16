import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type PinCodeStackParamList = {
  PinSetup: undefined;
  PinLogin: undefined;
};

export type PinCodeNavigationScreenProps<T extends keyof PinCodeStackParamList> = NativeStackScreenProps<
  PinCodeStackParamList,
  T
>;

export type PinCodeNavigationHookProps<T extends keyof PinCodeStackParamList> = NativeStackNavigationProp<
  PinCodeStackParamList,
  T
>;
