import { useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { inputSizeConfig } from './input-consts';
import { getInputColorKeys } from './input-color-config';
import { InputState } from '@ui-kits/inputs/input-types.ts';
import { getValueIfTruthy } from '@utils/common-utils.ts';

export interface InputStyles {
  containerStyle: ViewStyle;
  textStyle: TextStyle;
  labelColor: string;
  placeholderColor: string;
  errorColor: string;
}

export function useInputStyles(state: InputState, isMultiline?: boolean): InputStyles {
  const themeColors = useAppThemeColors();

  return useMemo(() => {
    const colorKeys = getInputColorKeys(state);

    return {
      containerStyle: {
        height: isMultiline ? 'auto' : inputSizeConfig.height,
        minHeight: getValueIfTruthy(inputSizeConfig.height, !!isMultiline),
        maxHeight: getValueIfTruthy(200, !!isMultiline),
        paddingVertical: getValueIfTruthy(4, isMultiline),
        borderRadius: inputSizeConfig.borderRadius,
        paddingHorizontal: inputSizeConfig.paddingHorizontal,
        borderWidth: inputSizeConfig.borderWidth,
        borderColor: themeColors[colorKeys.border],
        backgroundColor: themeColors[colorKeys.background],
      },
      textStyle: {
        color: themeColors[colorKeys.text],
        fontSize: inputSizeConfig.fontSize,
      },
      labelColor: themeColors[colorKeys.label],
      placeholderColor: themeColors[colorKeys.placeholder],
      errorColor: themeColors[colorKeys.error],
    };
  }, [state, themeColors]);
}
