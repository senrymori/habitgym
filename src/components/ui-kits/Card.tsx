import { FC, PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

interface CardProps extends PropsWithChildren {
  variant?: 'secondary' | 'tertiary';
  style?: StyleProp<ViewStyle>;
}

export const Card: FC<CardProps> = function (props) {
  const themeStyles = useAppThemeStyles();

  const backgroundStyle =
    props.variant === 'tertiary' ? themeStyles.backgroundTertiary : themeStyles.backgroundSecondary;
  const borderStyle = props.variant ? themeStyles.borderSecondary : themeStyles.borderMain;

  return (
    <View style={[styles.container, backgroundStyle, sharedLayoutStyles.border1, borderStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
});
