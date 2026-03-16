import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { HomeTabStackParamList } from './home-tab-stack/home-tab-stack-types';

export type HomeTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeTabStackParamList>;
};

export type HomeTabsNavigationHookProps<T extends keyof HomeTabsParamList = keyof HomeTabsParamList> =
  BottomTabNavigationProp<HomeTabsParamList, T>;
