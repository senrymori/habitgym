import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { Switch } from '@ui-kits/Switch.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

interface HabitFormSwitchRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export const HabitFormSwitchRow: FC<HabitFormSwitchRowProps> = function (props) {
  return (
    <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
      <Typography>{props.label}</Typography>
      <Switch
        value={props.value}
        onValueChange={props.onChange}
      />
    </View>
  );
};
