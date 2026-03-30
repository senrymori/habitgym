import { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

interface CardProps extends ViewProps {
  variant?: 'secondary' | 'tertiary';
  style?: StyleProp<ViewStyle>;
}

export const Card: FC<CardProps> = function (props) {
  const themeStyles = useAppThemeStyles();

  const { variant, ...viewProps } = props;

  const backgroundStyle = variant === 'tertiary' ? themeStyles.backgroundTertiary : themeStyles.backgroundSecondary;
  const borderStyle = variant ? themeStyles.borderSecondary : themeStyles.borderMain;

  return (
    <View
      {...viewProps}
      style={[styles.container, backgroundStyle, sharedLayoutStyles.border1, borderStyle, viewProps.style]}>
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
