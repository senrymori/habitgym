import { FC, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';

interface HabitIconPickerCellProps {
  icon: IconEnum;
  onPress: () => void;
}

export const HabitIconPickerCell: FC<HabitIconPickerCellProps> = function (props) {
  const themeColors = useAppThemeColors();
  const themeStyles = useAppThemeStyles();
  const handlePress = useCallback(() => props.onPress(), [props]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.cell, sharedLayoutStyles.center, themeStyles.borderSecondary]}>
      <Typography
        icon={props.icon}
        size={28}
        color={themeColors.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 44,
    height: 44,
    margin: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
});
