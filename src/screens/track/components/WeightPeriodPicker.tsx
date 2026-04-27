import { FC, useMemo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { ru as ruLocale } from 'date-fns/locale';
import { InputDropdown } from '@ui-kits/inputs/InputDropdown';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Locale } from '@providers/language/localized-strings';

interface WeightPeriodPickerProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const yearsBack = 4;

export const WeightPeriodPicker: FC<WeightPeriodPickerProps> = function (props) {
  const { currentLanguage } = useLanguage();

  const monthOptions = useMemo(() => {
    const dateLocale = currentLanguage === Locale.ru ? ruLocale : undefined;
    return Array.from({ length: 12 }, (_, i) => {
      const label = format(new Date(2024, i, 1), 'LLLL', { locale: dateLocale });
      return {
        value: i,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };
    });
  }, [currentLanguage]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: yearsBack + 1 }, (_, i) => {
      const year = currentYear - yearsBack + i;
      return { value: year, label: String(year) };
    });
  }, []);

  function handleMonthChange(value: number | string) {
    props.onChange(Number(value), props.year);
  }

  function handleYearChange(value: number | string) {
    props.onChange(props.month, Number(value));
  }

  return (
    <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap12]}>
      <View style={sharedLayoutStyles.flex1}>
        <InputDropdown
          options={monthOptions}
          value={props.month}
          onChange={handleMonthChange}
        />
      </View>
      <View style={sharedLayoutStyles.flex1}>
        <InputDropdown
          options={yearOptions}
          value={props.year}
          onChange={handleYearChange}
        />
      </View>
    </View>
  );
};
