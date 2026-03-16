import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export const HomeSidebarContent: FC<DrawerContentComponentProps> = function (props) {
  const themeColors = useAppThemeColors();
  const themeStyles = useAppThemeStyles();
  const safeAreaStyles = useSafeAreaStyles();

  return (
    <ScrollView
      style={[sharedLayoutStyles.flex1, themeStyles.backgroundMain]}
      contentContainerStyle={[safeAreaStyles.pLayoutGrowWithSpace, sharedLayoutStyles.gap16]}
      showsVerticalScrollIndicator={false}>
      <View style={sharedLayoutStyles.rowCenterBetween}>
        <ButtonIcon
          colorVariant={'contrast'}
          variant={'outline'}
          icon={IconEnum.CloseOutline}
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>

      <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap8]}>
        <View style={[styles.avatar, { backgroundColor: themeColors.primary400 }]}>
          <Typography
            size={24}
            weight={700}
            color={themeColors.strongWhite}>
            {'RNT'}
          </Typography>
        </View>
        <Typography
          size={18}
          weight={700}>
          {'RN'}
        </Typography>
        <Typography
          size={14}
          weight={600}
          color={themeColors.gray600}>
          {'Template'}
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
