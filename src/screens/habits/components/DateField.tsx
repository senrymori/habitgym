import { FC, useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  optional?: boolean;
}

export const DateField: FC<DateFieldProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations, currentLanguage } = useLanguage();
  const [iosOpen, setIosOpen] = useState(false);

  const displayText = props.value
    ? props.value.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : translations.habits.create.notSet;

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (event.type === 'set' && date) {
        props.onChange(date);
      }
    },
    [props.onChange]
  );

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: props.value ?? new Date(),
        mode: 'date',
        onChange: handleAndroidChange,
      });
    } else {
      setIosOpen((v) => !v);
    }
  }, [props.value, handleAndroidChange]);

  const handleClear = useCallback(() => props.onChange(null), [props.onChange]);

  return (
    <View style={sharedLayoutStyles.gap4}>
      <Typography
        size={14}
        weight={500}
        colorVariant={'textSecondary'}>
        {props.label}
      </Typography>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <Pressable
          onPress={openPicker}
          style={[
            styles.trigger,
            sharedLayoutStyles.flex1,
            sharedLayoutStyles.border1,
            sharedLayoutStyles.br12,
            { borderColor: themeColors.border, backgroundColor: themeColors.backgroundSecondary },
          ]}>
          <Typography color={props.value ? themeColors.text : themeColors.textTertiary}>{displayText}</Typography>
        </Pressable>
        {props.optional && props.value ? (
          <Pressable onPress={handleClear}>
            <Typography colorVariant={'textSecondary'}>{translations.common.delete}</Typography>
          </Pressable>
        ) : null}
      </View>
      {Platform.OS === 'ios' && iosOpen ? (
        <DateTimePicker
          value={props.value ?? new Date()}
          mode={'date'}
          display={'inline'}
          onChange={(_, date) => date && props.onChange(date)}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
