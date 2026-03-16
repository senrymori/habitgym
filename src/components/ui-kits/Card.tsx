import { FC, PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppThemeStyles } from '@providers/theme/AppThemeStylesProvider';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

interface CardProps extends PropsWithChildren {
  variant?: 'secondary' | 'tertiary';
  style?: StyleProp<ViewStyle>;
}

export const Card: FC<CardProps> = function (props) {
  const { isLight } = useThemeConfig();
  const themeStyles = useAppThemeStyles();

  const backgroundStyle =
    props.variant === 'tertiary' ? themeStyles.backgroundTertiary : themeStyles.backgroundSecondary;
  const borderStyle = props.variant ? themeStyles.borderSecondary : themeStyles.borderMain;

  return (
    <View
      style={[styles.container, backgroundStyle, isLight && [sharedLayoutStyles.border1, borderStyle], props.style]}>
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
