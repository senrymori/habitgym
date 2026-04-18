import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';
import { inputSizeConfig } from '@ui-kits/inputs/input-consts.ts';

interface TaskIndexBadgeProps {
  index: number;
}

export const TaskIndexBadge: FC<TaskIndexBadgeProps> = function (props) {
  const themeColors = useAppThemeColors();
  const themeStyles = useAppThemeStyles();

  return (
    <View style={[styles.container, sharedLayoutStyles.border1, sharedLayoutStyles.br12, themeStyles.borderSecondary]}>
      <Typography color={themeColors.text}>{props.index + 1}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...sharedLayoutStyles.center,
    paddingHorizontal: 12,
    height: inputSizeConfig.height,
    minWidth: 56,
  },
});
