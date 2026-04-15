import { FC, Fragment, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { HabitIconPickerCell } from './HabitIconPickerCell';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';

interface HabitIconPickerProps {
  value: IconEnum;
  onChange: (icon: string) => void;
}

const habitIconPresets: IconEnum[] = [
  IconEnum.WineFill,
  IconEnum.BeerFill,
  IconEnum.CigareFill,
  IconEnum.WeedFill,
  IconEnum.PillFill,
  IconEnum.FoodFill,
  IconEnum.DanceFill,
  IconEnum.EducationFill,
  IconEnum.FatFill,
  IconEnum.RunFill,
  IconEnum.SneakerFill,
  IconEnum.SquatFill,
  IconEnum.BasketballFill,
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
      <ButtonIcon
        style={styles.container}
        icon={value ? value : IconEnum.Plus}
        iconSize={28}
        onPress={open}
      />

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
  container: {
    width: 54,
    height: 54,
  },
});
