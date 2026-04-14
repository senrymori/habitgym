import { FC } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';

export interface WeekdayCircleProps {
  label: string;
  selected: boolean;
  completed: boolean;
  active: boolean;
  disabled: boolean;
  onPress?: () => void;
}

export const WeekdayCircle: FC<WeekdayCircleProps> = function (props) {
  const themeColors = useAppThemeColors();

  let backgroundColor: string = themeColors.backgroundSecondary;
  let textColor: string = themeColors.text;
  let borderColor: string = themeColors.border;

  if (props.completed) {
    backgroundColor = themeColors.success;
    textColor = themeColors.strongWhite;
    borderColor = themeColors.success;
  } else if (props.selected) {
    backgroundColor = themeColors.primary500;
    textColor = themeColors.strongWhite;
    borderColor = themeColors.primary500;
  }

  if (props.active) {
    borderColor = themeColors.primary500;
  }

  if (props.disabled) {
    textColor = themeColors.textTertiary;
  }

  const circleStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    opacity: props.disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      disabled={props.disabled || !props.onPress}
      onPress={props.onPress}
      style={[styles.circle, sharedLayoutStyles.center, sharedLayoutStyles.border1, circleStyle]}>
      <Typography
        size={12}
        weight={500}
        color={textColor}>
        {props.label}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
