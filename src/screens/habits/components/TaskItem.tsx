import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { HabitTask } from '@db/models/HabitTask';

interface TaskItemProps {
  item: HabitTask;
  completed: boolean;
  onPress: () => void;
}

export const TaskItem: FC<TaskItemProps> = function (props) {
  const themeColors = useAppThemeColors();

  const labelStyle = props.completed ? styles.completedLabel : undefined;
  const checkboxBackground = props.completed ? themeColors.primary400 : 'transparent';
  const checkboxBorder = props.completed ? themeColors.primary400 : themeColors.border;

  return (
    <Pressable
      onPress={props.onPress}
      style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8, sharedLayoutStyles.flex1]}>
        <Typography
          size={14}
          weight={500}
          colorVariant={'textSecondary'}>
          {props.item.time}
        </Typography>
        <Typography
          size={14}
          style={labelStyle}>
          {props.item.label}
        </Typography>
      </View>
      <View
        style={[
          styles.checkbox,
          sharedLayoutStyles.center,
          sharedLayoutStyles.border1,
          { backgroundColor: checkboxBackground, borderColor: checkboxBorder },
        ]}>
        {props.completed && (
          <Typography
            icon={IconEnum.Check}
            size={14}
            color={themeColors.strongWhite}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  completedLabel: {
    textDecorationLine: 'line-through',
  },
});
