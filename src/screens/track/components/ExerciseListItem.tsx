import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Badge } from '@ui-kits/Badge';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useObserveRecord } from '@utils/hooks/useObserveRecord';
import { GymExercise } from '@db/models/GymExercise';

interface ExerciseListItemProps {
  item: GymExercise;
  onPress: () => void;
}

export const ExerciseListItem: FC<ExerciseListItemProps> = function (props) {
  const { translations } = useLanguage();
  const item = useObserveRecord(props.item);
  const tags = item.parsedTags;

  const typeLabel =
    item.exerciseType === 'strength' ? translations.track.exercise.strength : translations.track.exercise.cardio;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}>
      <Card style={sharedLayoutStyles.gap8}>
        <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
          <Typography
            weight={600}
            style={sharedLayoutStyles.flex1}>
            {item.title}
          </Typography>
          <Badge text={typeLabel} />
        </View>
        {tags.length > 0 && (
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.flexWrap, sharedLayoutStyles.gap8]}>
            {tags.map(renderTag)}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

function renderTag(tag: string) {
  return (
    <Typography
      key={tag}
      size={12}
      colorVariant={'textSecondary'}>
      {`#${tag}`}
    </Typography>
  );
}
