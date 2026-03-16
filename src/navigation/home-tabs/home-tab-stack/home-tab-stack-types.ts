import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeTabStackParamList = {
  Home: undefined;
  AssetDetails: { assetId: string };
};

export type HomeTabStackNavigationScreenProps<T extends keyof HomeTabStackParamList> = NativeStackScreenProps<
  HomeTabStackParamList,
  T
>;

export type HomeTabStackNavigationHookProps<T extends keyof HomeTabStackParamList = keyof HomeTabStackParamList> =
  NativeStackNavigationProp<HomeTabStackParamList, T>;
