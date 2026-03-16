import { NavigatorScreenParams } from '@react-navigation/native';
import { PinCodeStackParamList } from '@navigation/pin-code-stack/pin-code-stack-types.ts';
import { HomeTabsParamList } from '@navigation/home-tabs/home-tabs-types';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  PinCodeStack: NavigatorScreenParams<PinCodeStackParamList>;
  HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
};

export type RootNavigationScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
export type RootNavigationHookProps<T extends keyof RootStackParamList = keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
