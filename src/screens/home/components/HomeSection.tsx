import { FC, PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { Typography } from '@ui-kits/Typography/Typography.tsx';

interface Props extends PropsWithChildren {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export const HomeSection: FC<Props> = function (props) {
  return (
    <View style={[sharedLayoutStyles.gap8, props.style]}>
      <Typography weight={700}>{props.title}</Typography>
      {props.children}
    </View>
  );
};
