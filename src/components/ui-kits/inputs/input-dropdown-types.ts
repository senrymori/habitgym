import { InputBaseProps } from './input-types.ts';

export interface DropdownOption {
  label: string;
  value: string | number;
}

type InputDropdownBaseProps = Omit<
  InputBaseProps,
  'value' | 'onChange' | 'onChangeText' | 'editable' | 'showSoftInputOnFocus' | 'rightIcon'
>;

// valueKey and labelKey are required only when T is not DropdownOption
type DropdownKeys<T extends object> = T extends DropdownOption
  ? { valueKey?: keyof T; labelKey?: keyof T }
  : { valueKey: keyof T; labelKey: keyof T };

type DropdownValueKey<T extends object> = NonNullable<DropdownKeys<T>['valueKey']> & keyof T;

export type InputDropdownProps<T extends object = DropdownOption> = InputDropdownBaseProps & {
  options: T[];
  value?: T[DropdownValueKey<T>];
  onChange: (value: any) => void;
} & DropdownKeys<T>;
