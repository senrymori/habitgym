import { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { TrackSection } from '../track-main-consts';

interface TrackSectionCardProps {
  item: TrackSection;
  onPress: () => void;
}

export const TrackSectionCard: FC<TrackSectionCardProps> = function (props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}>
      <Card style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap12]}>
        <Typography
          size={24}
          icon={props.item.iconName}
        />
        <Typography weight={600}>{props.item.title}</Typography>
      </Card>
    </TouchableOpacity>
  );
};
