import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from './home-tabs-types';
import { HomeTabStack } from './home-tab-stack/HomeTabStack';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export const HomeTabs = () => {
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
        name={'HomeTab'}
        component={HomeTabStack}
        options={{
          tabBarLabel: translations.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <Typography
              icon={focused ? IconEnum.Home : IconEnum.HomeOutline}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
