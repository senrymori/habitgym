import { ReactElement, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

interface InputDropdownIosPickerProps<T> {
  value: string | number | undefined;
  onChange: (v: string | number) => void;
  options: T[];
  renderItem: (option: T) => ReactElement;
}

// Wraps Picker in local state to prevent the scroll-back flicker on iOS.
// See https://github.com/react-native-picker/picker/issues/431
export function InputDropdownIosPicker<T extends object>(props: InputDropdownIosPickerProps<T>): ReactElement {
  const [localValue, setLocalValue] = useState(props.value);

  useEffect(() => {
    if (localValue === undefined) return;
    props.onChange(localValue);
  }, [localValue]);

  return (
    <Picker
      selectedValue={localValue}
      onValueChange={(itemValue) => setLocalValue(itemValue as string | number)}>
      {props.options.map(props.renderItem)}
    </Picker>
  );
}