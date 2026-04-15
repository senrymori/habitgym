import { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';

interface DateInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  optional?: boolean;
}

export const DateInput: FC<DateInputProps> = function (props) {
  const themeColors = useAppThemeColors();
  const themeStyles = useAppThemeStyles();
  const { translations, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const displayText = props.value
    ? props.value.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : translations.common.notSet;

  const selectedDateString = props.value ? format(props.value, 'yyyy-MM-dd') : undefined;

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleClear = useCallback(() => props.onChange(null), [props.onChange]);

  const handleDayPress = useCallback(
    (day: DateData) => {
      props.onChange(new Date(day.timestamp));
      setIsOpen(false);
    },
    [props.onChange]
  );

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
          onPress={handleOpen}
          style={[
            styles.trigger,
            sharedLayoutStyles.flex1,
            sharedLayoutStyles.border1,
            sharedLayoutStyles.br12,
            themeStyles.borderSecondary,
          ]}>
          <Typography color={props.value ? themeColors.text : themeColors.textTertiary}>{displayText}</Typography>
        </Pressable>
        {props.optional && props.value ? (
          <Pressable onPress={handleClear}>
            <Typography colorVariant={'textSecondary'}>{translations.common.delete}</Typography>
          </Pressable>
        ) : null}
      </View>

      <ModalBottomSheet
        isVisible={isOpen}
        onClose={handleClose}>
        <View style={styles.calendarContainer}>
          <Calendar
            firstDay={1}
            current={selectedDateString}
            markedDates={
              selectedDateString
                ? { [selectedDateString]: { selected: true, selectedColor: themeColors.primary400 } }
                : {}
            }
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: themeColors.textSecondary,
              dayTextColor: themeColors.text,
              todayTextColor: themeColors.primary400,
              monthTextColor: themeColors.text,
              arrowColor: themeColors.primary400,
              textDisabledColor: themeColors.textTertiary,
              selectedDayBackgroundColor: themeColors.primary400,
              selectedDayTextColor: themeColors.strongWhite,
            }}
          />
        </View>
      </ModalBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
