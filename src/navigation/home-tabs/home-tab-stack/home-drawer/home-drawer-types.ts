import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';

export type HomeDrawerParamList = {
  HomeMain: undefined;
};

export type HomeDrawerNavigationScreenProps<T extends keyof HomeDrawerParamList> = DrawerScreenProps<
  HomeDrawerParamList,
  T
>;

export type HomeDrawerNavigationHookProps<T extends keyof HomeDrawerParamList = keyof HomeDrawerParamList> =
  DrawerNavigationProp<HomeDrawerParamList, T>;
