import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { format } from 'date-fns';
import { enUS, ru as ruLocale } from 'date-fns/locale';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Locale } from '@providers/language/localized-strings';

interface CalendarMonth {
  getFullYear: () => number;
  getTime: () => number;
}

interface DateInputCalendarHeaderProps {
  month: CalendarMonth;
  onYearPress: () => void;
}

export const DateInputCalendarHeader: FC<DateInputCalendarHeaderProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { currentLanguage } = useLanguage();

  const date = new Date(props.month.getTime());
  const dateLocale = currentLanguage === Locale.ru ? ruLocale : enUS;
  const monthLabel = format(date, 'LLLL', { locale: dateLocale });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap4]}>
      <Typography
        size={16}
        weight={600}>
        {capitalizedMonth}
      </Typography>
      <Pressable
        onPress={props.onYearPress}
        hitSlop={8}>
        <Typography
          size={16}
          weight={600}
          color={themeColors.primary400}>
          {String(props.month.getFullYear())}
        </Typography>
      </Pressable>
    </View>
  );
};
