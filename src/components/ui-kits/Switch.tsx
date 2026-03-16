import { FC } from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';

interface SwitchProps extends Omit<RNSwitchProps, 'trackColor' | 'thumbColor'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const Switch: FC<SwitchProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { value, onValueChange, ...rest } = props;
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: themeColors.primary100,
        true: themeColors.primary400,
      }}
      thumbColor={themeColors.strongWhite}
      ios_backgroundColor={themeColors.primary100}
      {...rest}
    />
  );
};
