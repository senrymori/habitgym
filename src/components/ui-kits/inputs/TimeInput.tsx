import { FC, useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { inputSizeConfig } from '@ui-kits/inputs/input-consts.ts';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';

interface TimeInputProps {
  label?: string;
  value: string;
  onChange: (time: string) => void;
}

function timeToDate(time: string): Date {
  const [h, m] = time.split(':').map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(Number.isFinite(h) ? h : 9, Number.isFinite(m) ? m : 0, 0, 0);
  return d;
}

function dateToTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const TimeInput: FC<TimeInputProps> = function (props) {
  const themeColors = useAppThemeColors();
  const themeStyles = useAppThemeStyles();
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(() => timeToDate(props.value));
  const date = useMemo(() => timeToDate(props.value), [props.value]);

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, d?: Date) => {
      if (event.type === 'set' && d) props.onChange(dateToTime(d));
    },
    [props]
  );

  const handleOpen = useCallback(() => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: date, mode: 'time', is24Hour: true, onChange: handleAndroidChange });
    } else {
      setDraftDate(timeToDate(props.value));
      setIsOpen(true);
    }
  }, [date, handleAndroidChange, props.value]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSave = useCallback(() => {
    props.onChange(dateToTime(draftDate));
    setIsOpen(false);
  }, [draftDate, props]);

  return (
    <View style={sharedLayoutStyles.gap4}>
      {!!props.label && (
        <Typography
          size={14}
          weight={500}
          colorVariant={'textSecondary'}>
          {props.label}
        </Typography>
      )}

      <Pressable
        onPress={handleOpen}
        style={[styles.trigger, sharedLayoutStyles.border1, sharedLayoutStyles.br12, themeStyles.borderSecondary]}>
        <Typography color={themeColors.text}>{props.value}</Typography>
      </Pressable>

      <ModalBottomSheet
        isVisible={isOpen}
        onClose={handleClose}>
        <View style={[styles.pickerContainer, safeAreaStyles.pbPhLayout]}>
          <View style={sharedLayoutStyles.center}>
            <DateTimePicker
              value={draftDate}
              mode={'time'}
              display={'spinner'}
              is24Hour={true}
              textColor={themeColors.text}
              onValueChange={(_, d) => d && setDraftDate(d)}
            />
          </View>
          <ButtonText
            text={translations.habits.save}
            onPress={handleSave}
          />
        </View>
      </ModalBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    ...sharedLayoutStyles.center,
    paddingHorizontal: 12,
    height: inputSizeConfig.height,
  },
  pickerContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
