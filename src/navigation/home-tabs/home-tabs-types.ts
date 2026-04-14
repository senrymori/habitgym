import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { HabitTabStackParamList } from './habit-tab-stack/habit-tab-stack-types';
import { GymTabStackParamList } from './gym-tab-stack/gym-tab-stack-types';
import { TrackTabStackParamList } from './track-tab-stack/track-tab-stack-types';

export type HomeTabsParamList = {
  HabitTab: NavigatorScreenParams<HabitTabStackParamList>;
  GymTab: NavigatorScreenParams<GymTabStackParamList>;
  TrackTab: NavigatorScreenParams<TrackTabStackParamList>;
};

export type HomeTabsNavigationHookProps<T extends keyof HomeTabsParamList = keyof HomeTabsParamList> =
  BottomTabNavigationProp<HomeTabsParamList, T>;
