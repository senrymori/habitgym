import { FC, ReactElement } from 'react';
import { View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { ExerciseHistoryRecord, HistoryItem } from '../gym-program-history-types';
import { formatHistoryShortDate } from '../gym-program-history-utils';
import { ExerciseHistoryItem } from './ExerciseHistoryItem';

interface HistoryCardProps {
  item: HistoryItem;
}

function renderExerciseHistoryItem(record: ExerciseHistoryRecord): ReactElement {
  return (
    <ExerciseHistoryItem
      key={record.programExerciseId}
      item={record}
    />
  );
}

export const HistoryCard: FC<HistoryCardProps> = function (props) {
  const dateLabel = formatHistoryShortDate(props.item.startedAt);
  const progressLabel = `${props.item.completedSets}/${props.item.totalSets}`;

  return (
    <Card style={sharedLayoutStyles.gap12}>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <Typography
          weight={600}
          size={16}>
          {dateLabel}
        </Typography>
        <Typography
          size={14}
          colorVariant={'textSecondary'}>
          {progressLabel}
        </Typography>
      </View>
      <View style={sharedLayoutStyles.gap8}>{props.item.exercises.map(renderExerciseHistoryItem)}</View>
    </Card>
  );
};
