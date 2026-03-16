import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';

interface SegmentItemProps {
  item: string;
  isSelected: boolean;
  onPress: () => void;
  textColor: string;
  textSecondaryColor: string;
}

export const SegmentItem: FC<SegmentItemProps> = function (props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={styles.segment}>
      <Typography
        size={14}
        weight={props.isSelected ? 600 : 400}
        color={props.isSelected ? props.textColor : props.textSecondaryColor}>
        {props.item}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    zIndex: 1,
  },
});
