import { FC } from 'react';
import { View } from 'react-native';
import { parseISO } from 'date-fns';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { formatShortDate } from '@utils/date-utils';
import { WeightSummary } from '../weight-progress-types';
import { formatDeltaLabel, formatWeightLabel } from '../weight-progress-utils';

interface WeightSummaryCardsProps {
  summary: WeightSummary;
}

const placeholder = '—';

export const WeightSummaryCards: FC<WeightSummaryCardsProps> = function (props) {
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();

  const current = props.summary.current;
  const delta = props.summary.deltaFromPrevious;

  const currentValue = current ? formatWeightLabel(current.weight, current.unit, translations) : placeholder;
  const deltaValue =
    delta !== null && current ? formatDeltaLabel(delta, current.unit, translations) : placeholder;
  const deltaColor = resolveDeltaColor(delta, themeColors.success, themeColors.error, themeColors.text);
  const lastDate = current ? formatShortDate(parseISO(current.date)) : '';

  return (
    <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap12]}>
      <Card style={sharedLayoutStyles.flex1}>
        <Typography
          size={28}
          weight={700}>
          {currentValue}
        </Typography>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {translations.track.weight.now}
        </Typography>
      </Card>

      <Card style={sharedLayoutStyles.flex1}>
        <Typography
          size={28}
          weight={700}
          color={deltaColor}>
          {deltaValue}
        </Typography>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {lastDate || translations.track.weight.lastUpdated}
        </Typography>
      </Card>
    </View>
  );
};

function resolveDeltaColor(delta: number | null, positive: string, negative: string, neutral: string): string {
  if (delta === null || delta === 0) return neutral;
  return delta > 0 ? positive : negative;
}
