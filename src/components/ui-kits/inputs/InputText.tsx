import { forwardRef, useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Typography } from '@ui-kits/Typography/Typography';
import { inputSizeConfig } from './input-consts';
import { InputTextProps, isMaskedInput } from './input-types';
import { resolveInputState } from './input-utils';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider.tsx';
import { useInputStyles } from '@ui-kits/inputs/input-hooks.ts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

export const InputText = forwardRef<TextInput, InputTextProps>(function (props, ref) {
  const { label, errorText, disabled, leftIcon, rightIcon, rightElement, containerStyle, ...restProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useThemeConfig();

  const state = resolveInputState({ errorText, disabled, isFocused, isDark });
  const inputStyles = useInputStyles(state);
  const masked = isMaskedInput(restProps);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<InputTextProps['onFocus']>>[0]) => {
      setIsFocused(true);
      restProps.onFocus?.(e);
    },
    [restProps.onFocus]
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<InputTextProps['onBlur']>>[0]) => {
      setIsFocused(false);
      restProps.onBlur?.(e);
    },
    [restProps.onBlur]
  );

  const handleMaskedChangeText = useCallback(
    (maskedValue: string, unmasked: string) => {
      restProps.onChangeText?.(maskedValue);
      if (masked) {
        restProps.onChangeUnmasked?.(unmasked);
      }
    },
    [restProps.onChangeText, masked && restProps.onChangeUnmasked]
  );

  const sharedProps = {
    ...restProps,
    ref,
    editable: !disabled && (restProps.editable ?? true),
    placeholderTextColor: inputStyles.placeholderColor,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const inputStyle = [inputStyles.textStyle, styles.input, restProps.style];

  return (
    <Pressable style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Typography
          size={inputSizeConfig.labelSize}
          weight={500}
          color={inputStyles.labelColor}>
          {label}
        </Typography>
      ) : null}
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8, inputStyles.containerStyle]}>
        {leftIcon ? (
          <Typography
            icon={leftIcon}
            size={inputSizeConfig.fontSize}
            color={inputStyles.placeholderColor}
          />
        ) : null}
        {masked ? (
          <MaskedTextInput
            {...sharedProps}
            mask={restProps.mask}
            keyboardType={'phone-pad'}
            onChangeText={handleMaskedChangeText}
            style={inputStyle}
          />
        ) : (
          <TextInput
            {...sharedProps}
            onChangeText={restProps.onChangeText}
            style={inputStyle}
          />
        )}
        {rightIcon ? (
          <Typography
            icon={rightIcon}
            size={inputSizeConfig.fontSize}
            color={inputStyles.placeholderColor}
          />
        ) : (
          rightElement ?? null
        )}
      </View>
      {errorText ? (
        <Typography
          size={inputSizeConfig.errorSize}
          weight={400}
          color={inputStyles.errorColor}>
          {errorText}
        </Typography>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  input: {
    flex: 1,
    fontFamily: 'Manrope-Regular',
    padding: 0,
  },
});
