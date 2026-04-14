import { FC, useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';

interface TimeFieldProps {
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

export const TimeField: FC<TimeFieldProps> = function (props) {
  const themeColors = useAppThemeColors();
  const [iosOpen, setIosOpen] = useState(false);
  const date = useMemo(() => timeToDate(props.value), [props.value]);

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, d?: Date) => {
      if (event.type === 'set' && d) props.onChange(dateToTime(d));
    },
    [props.onChange]
  );

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: date, mode: 'time', is24Hour: true, onChange: handleAndroidChange });
    } else {
      setIosOpen((v) => !v);
    }
  }, [date, handleAndroidChange]);

  return (
    <View>
      <Pressable
        onPress={openPicker}
        style={[
          styles.trigger,
          sharedLayoutStyles.border1,
          sharedLayoutStyles.br8,
          sharedLayoutStyles.center,
          { borderColor: themeColors.border, backgroundColor: themeColors.backgroundSecondary },
        ]}>
        <Typography weight={500}>{props.value}</Typography>
      </Pressable>
      {Platform.OS === 'ios' && iosOpen ? (
        <DateTimePicker
          value={date}
          mode={'time'}
          display={'spinner'}
          is24Hour={true}
          onChange={(_, d) => d && props.onChange(dateToTime(d))}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
