import { FC } from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { TextProps } from './typography-types.ts';
import { weightToFontFamily } from './typography-consts.ts';

export const Typography: FC<TextProps> = function (props) {
  const {
    align = 'left',
    size = 16,
    weight = 400,
    colorVariant,
    color,
    transform,
    icon,
    style,
    children,
    ...rest
  } = props;

  const themeColors = useAppThemeColors();

  const textStyle: TextStyle = {
    textAlign: align,
    fontSize: size,
    fontFamily: icon ? 'icomoon' : weightToFontFamily[weight],
    textTransform: transform,
  };

  // Priority: color > colorVariant > default (text)
  if (color) {
    textStyle.color = color;
  } else if (colorVariant) {
    textStyle.color = themeColors[colorVariant];
  } else {
    textStyle.color = themeColors.text;
  }

  const content = icon ?? children;

  return (
    <RNText
      style={[textStyle, style]}
      {...rest}>
      {content}
    </RNText>
  );
};
