import { FC } from 'react';
import { View } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { HomeButtonsIcons } from '@screens/home/components/sections/buttons/HomeButtonsIcons.tsx';
import { HomeButtonsText } from '@screens/home/components/sections/buttons/HomeButtonsText.tsx';
import { HomeButtonsUniversal } from '@screens/home/components/sections/buttons/HomeButtonsUniversal.tsx';

export const HomeButtons: FC = function () {
  return (
    <View style={sharedLayoutStyles.gap16}>
      <HomeButtonsText />
      <HomeButtonsIcons />
      <HomeButtonsUniversal />
    </View>
  );
};
