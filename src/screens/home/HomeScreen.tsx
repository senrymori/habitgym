import { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';
import { HomeHeader } from '@screens/home/components/HomeHeader.tsx';
import { HomeDrawerNavigationHookProps } from '@navigation/home-tabs/home-tab-stack/home-drawer/home-drawer-types';
import { HomeBadges } from '@screens/home/components/sections/HomeBadges.tsx';
import { Divider } from '@ui-kits/Divider.tsx';
import { HomeInputs } from '@screens/home/components/sections/HomeInputs.tsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { HomeButtons } from '@screens/home/components/sections/buttons/HomeButtons.tsx';
import { HomeCards } from '@screens/home/components/sections/HomeCards.tsx';
import { HomeSegmentedControl } from '@screens/home/components/sections/HomeSegmentedControl.tsx';

export const HomeScreen: FC = function () {
  const safeAreaStyles = useSafeAreaStyles();
  const navigation = useNavigation<HomeDrawerNavigationHookProps>();

  return (
    <KeyboardAwareScrollView
      style={sharedLayoutStyles.flex1}
      contentContainerStyle={[safeAreaStyles.pLayoutGrowWithSpace, sharedLayoutStyles.gap32]}
      showsVerticalScrollIndicator={false}>
      <HomeHeader onProfilePress={() => navigation.openDrawer()} />

      <HomeBadges />
      <Divider />

      <HomeInputs />
      <Divider />

      <HomeButtons />
      <Divider />

      <HomeCards />
      <Divider />

      <HomeSegmentedControl />
    </KeyboardAwareScrollView>
  );
};
