import { FC } from 'react';
import { View } from 'react-native';
import { parseISO } from 'date-fns';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { formatShortDate } from '@utils/date-utils';
import { WeightHistoryEntry } from '../weight-progress-types';
import { formatDeltaShort, formatWeightLabel } from '../weight-progress-utils';

interface WeightHistoryCardProps {
  item: WeightHistoryEntry;
  color: string;
}

export const WeightHistoryCard: FC<WeightHistoryCardProps> = function (props) {
  const { translations } = useLanguage();

  const weightText = formatWeightLabel(props.item.weight, props.item.unit, translations);
  const dateText = formatShortDate(parseISO(props.item.date));
  const hasDelta = props.item.deltaFromPrevious !== null;

  return (
    <Card>
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.rowJustifyBetween]}>
        <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
          <Typography
            size={16}
            weight={600}>
            {weightText}
          </Typography>
          {hasDelta ? (
            <Typography
              size={16}
              weight={500}
              color={props.color}>
              {`(${formatDeltaShort(props.item.deltaFromPrevious as number)})`}
            </Typography>
          ) : null}
        </View>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {dateText}
        </Typography>
      </View>
    </Card>
  );
};
