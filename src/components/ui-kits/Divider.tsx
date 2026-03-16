import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider.tsx';

interface Props {
  color?: string;
  isVertical?: boolean;
}

export const Divider: FC<Props> = function (props) {
  const themeStyles = useAppThemeStyles();
  return (
    <View
      style={[
        themeStyles.backgroundTertiary,
        props.isVertical ? ownStyles.vertical : ownStyles.horizontal,
        props.color && { backgroundColor: props.color },
      ]}
    />
  );
};

const ownStyles = StyleSheet.create({
  horizontal: {
    height: 1,
  },
  vertical: {
    height: '100%',
    width: 1,
  },
});
