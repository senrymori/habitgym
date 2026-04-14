import { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from './home-tabs-types';
import { HabitTabStack } from './habit-tab-stack/HabitTabStack';
import { GymTabStack } from './gym-tab-stack/GymTabStack';
import { TrackTabStack } from './track-tab-stack/TrackTabStack';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export const HomeTabs: FC = function () {
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
          height: 75,
        },
        tabBarActiveTintColor: themeColors.primary400,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 6,
        },
      }}>
      <Tab.Screen
        name={'HabitTab'}
        component={HabitTabStack}
        options={{
          tabBarLabel: translations.tabs.habit,
          tabBarIcon: ({ color }) => (
            <Typography
              icon={IconEnum.BangStar}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={'GymTab'}
        component={GymTabStack}
        options={{
          tabBarLabel: translations.tabs.gym,
          tabBarIcon: ({ color }) => (
            <Typography
              icon={IconEnum.DumbFill}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={'TrackTab'}
        component={TrackTabStack}
        options={{
          tabBarLabel: translations.tabs.track,
          tabBarIcon: ({ color }) => (
            <Typography
              icon={IconEnum.ProgressFill}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
