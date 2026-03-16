import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';
import { HomeDrawerParamList } from './home-drawer-types';
import { HomeScreen } from '@screens/home/HomeScreen';
import { HomeSidebarContent } from '@screens/home/components/HomeSidebarContent';

const Drawer = createDrawerNavigator<HomeDrawerParamList>();

const SCREEN_WIDTH = Dimensions.get('window').width;

export const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'left',
        drawerStyle: { width: SCREEN_WIDTH },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        overlayColor: 'rgba(0,0,0,0.4)',
      }}
      drawerContent={(drawerProps) => <HomeSidebarContent {...drawerProps} />}>
      <Drawer.Screen
        name={'HomeMain'}
        component={HomeScreen}
      />
    </Drawer.Navigator>
  );
};
