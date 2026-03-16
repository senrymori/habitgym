import { FC, useMemo } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider.tsx';

export const BadgeVariant = {
  Fill: 'Fill',
  Outline: 'Outline',
} as const;
type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant];
interface BadgeProps {
  icon?: IconEnum;
  text: string;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
  isStatusMode?: boolean;
  textTransform?: TextStyle['textTransform'];
  variant?: BadgeVariant;
}

export const Badge: FC<BadgeProps> = function (props) {
  const { variant } = props;
  const { isLight } = useThemeConfig();
  const themeColors = useAppThemeColors();

  const badgeStyles = useMemo(() => {
    const backgroundColor =
      props.color ??
      props.backgroundColor ??
      (isLight ? themeColors.backgroundTertiary : themeColors.backgroundSecondary);
    const borderColor = props.color ?? props.borderColor ?? themeColors.border;
    switch (variant) {
      case BadgeVariant.Fill:
        return {
          backgroundColor,
        };
      case BadgeVariant.Outline:
        return {
          borderWidth: 2,
          borderColor,
        };
      default:
        return {
          borderWidth: 2,
          backgroundColor: backgroundColor + '20',
          borderColor: borderColor,
        };
    }
  }, [variant, themeColors]);

  return (
    <View style={[styles.container, badgeStyles, props.style]}>
      {props.icon && (
        <Typography
          icon={props.icon}
          size={14}
          color={props.color ?? props.iconColor ?? themeColors.primary400}
        />
      )}

      {props.isStatusMode && (
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: props.color ?? props.iconColor ?? themeColors.primary400 },
          ]}
        />
      )}

      <Typography
        size={14}
        weight={600}
        transform={props.textTransform ?? 'uppercase'}
        color={props.color ?? props.textColor}>
        {props.text}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusContainer: {
    width: 10,
    height: 10,
    borderRadius: 12,
  },
});
