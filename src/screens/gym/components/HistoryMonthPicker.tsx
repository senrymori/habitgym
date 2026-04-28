import { FC } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { enUS, ru as ruLocale } from 'date-fns/locale';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Locale } from '@providers/language/localized-strings';

interface HistoryMonthPickerProps {
  visibleMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const HistoryMonthPicker: FC<HistoryMonthPickerProps> = function (props) {
  const { currentLanguage } = useLanguage();
  const dateLocale = currentLanguage === Locale.ru ? ruLocale : enUS;
  const monthLabel = format(props.visibleMonth, 'LLLL', { locale: dateLocale });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const yearLabel = format(props.visibleMonth, 'yyyy');

  return (
    <Card variant={'secondary'}>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <ButtonIcon
          icon={IconEnum.ChevronLeft}
          variant={'outline'}
          colorVariant={'contrast'}
          size={'small'}
          onPress={props.onPrev}
        />
        <Typography
          weight={600}
          size={16}>
          {`${capitalizedMonth}, ${yearLabel}`}
        </Typography>
        <ButtonIcon
          icon={IconEnum.ChevronRight}
          variant={'outline'}
          colorVariant={'contrast'}
          size={'small'}
          onPress={props.onNext}
        />
      </View>
    </Card>
  );
};
