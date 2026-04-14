import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { HabitIconPickerCell } from './HabitIconPickerCell';

interface HabitIconPickerProps {
  value: string;
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
    <>
      <Pressable
        onPress={open}
        style={[
          styles.trigger,
          sharedLayoutStyles.center,
          sharedLayoutStyles.border1,
          { backgroundColor: themeColors.backgroundSecondary, borderColor: themeColors.border },
        ]}>
        {value ? (
          <Typography
            icon={value as IconEnum}
            size={28}
            color={themeColors.text}
          />
        ) : (
          <Typography
            size={28}
            color={themeColors.textTertiary}>
            {'＋'}
          </Typography>
        )}
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
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
});
