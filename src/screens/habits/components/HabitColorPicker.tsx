import { FC, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { habitPresetColors } from '../habit-create-consts';

interface HabitColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const HabitColorPicker: FC<HabitColorPickerProps> = function (props) {
  const renderItem = useCallback(
    (color: string) => (
      <Pressable
        key={color}
        onPress={() => props.onChange(color)}
        style={[styles.swatch, sharedLayoutStyles.center, { backgroundColor: color }]}>
        {props.value === color ? (
          <Typography
            icon={IconEnum.Check}
            size={18}
            color={'#FFFFFF'}
          />
        ) : null}
      </Pressable>
    ),
    [props.value, props.onChange]
  );

  return (
    <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.gap8]}>
      {habitPresetColors.map(renderItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
