import { FC, Fragment, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { HabitIconPickerCell } from './HabitIconPickerCell';

interface HabitIconPickerProps {
  value: IconEnum;
  onChange: (icon: string) => void;
}

const habitIconPresets: IconEnum[] = [
  IconEnum.CigareFill,
  IconEnum.WeedFill,
  IconEnum.DanceFill,
  IconEnum.FoodFill,
  IconEnum.EducationFill,
  IconEnum.FatFill,
  IconEnum.BeerFill,
  IconEnum.RunFill,
  IconEnum.SneakerFill,
  IconEnum.SquatFill,
  IconEnum.BasketballFill,
  IconEnum.PillFill,
  IconEnum.DumbFill,
  IconEnum.CalendarFill,
  IconEnum.ColorFill,
  IconEnum.HockeyFill,
  IconEnum.KabaddiFill,
  IconEnum.LowKickFill,
  IconEnum.MedalFill,
  IconEnum.MotorshipFill,
  IconEnum.SoccerFill,
  IconEnum.SportsFill,
  IconEnum.SwimFill,
  IconEnum.StarFill,
  IconEnum.VolleyballFill,
  IconEnum.VideoFill,
];

export const HabitIconPicker: FC<HabitIconPickerProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { value, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handlePick = useCallback(
    (icon: IconEnum) => {
      onChange(icon);
      setIsOpen(false);
    },
    [onChange]
  );

  const renderItem = useCallback(
    (icon: IconEnum) => (
      <HabitIconPickerCell
        key={icon}
        icon={icon}
        onPress={() => handlePick(icon)}
      />
    ),
    [handlePick]
  );

  return (
    <Fragment>
      <Pressable
        onPress={open}
        style={[
          styles.trigger,
          sharedLayoutStyles.center,
          sharedLayoutStyles.border1,
          { backgroundColor: themeColors.backgroundSecondary, borderColor: themeColors.border },
        ]}>
        <Typography
          icon={value ? value : IconEnum.Plus}
          size={28}
          color={themeColors.text}
        />
      </Pressable>

      <ModalBottomSheet
        isVisible={isOpen}
        onClose={close}>
        <View style={[sharedLayoutStyles.p16, sharedLayoutStyles.gap16]}>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.center]}>
            {habitIconPresets.map(renderItem)}
          </View>
        </View>
      </ModalBottomSheet>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
});
