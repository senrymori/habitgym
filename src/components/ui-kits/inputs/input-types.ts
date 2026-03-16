import { ReactNode } from 'react';
import { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { IconEnum } from '@ui-kits/Typography/typography-consts';

export type InputState = 'active-light' | 'active-dark' | 'focused' | 'error' | 'disabled';

export interface InputBaseProps extends TextInputProps {
  label?: string;
  errorText?: string;
  disabled?: boolean;
  leftIcon?: IconEnum;
  rightIcon?: IconEnum;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface InputMaskedProps extends InputBaseProps {
  mask: string;
  onChangeUnmasked?: (unmasked: string) => void;
}

export type InputTextProps = InputBaseProps | InputMaskedProps;

type InputCustomKeys = 'label' | 'errorText' | 'disabled';
export type InputRestProps = Omit<InputBaseProps, InputCustomKeys> | Omit<InputMaskedProps, InputCustomKeys>;

export function isMaskedInput(props: InputRestProps): props is Omit<InputMaskedProps, InputCustomKeys> {
  return 'mask' in props && !!props.mask;
}
