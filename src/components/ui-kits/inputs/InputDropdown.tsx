import { Fragment, ReactElement, useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet.tsx';
import { IS_ANDROID } from '@constants/device-consts.ts';
import { InputText } from './InputText.tsx';
import { DropdownOption, InputDropdownProps } from './input-dropdown-types.ts';
import { InputDropdownIosPicker } from './InputDropdownIosPicker.tsx';
import { ButtonText } from '@ui-kits/Button/ButtonText.tsx';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { textStylesShared } from '@ui-kits/Typography/typography-styles.ts';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';

export const InputDropdown = function <T extends object = DropdownOption>(
  props: InputDropdownProps<T>
): ReactElement | null {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string | number | undefined>(undefined);
  const pickerRef = useRef<Picker<string | number>>(null);

  const { options, value, onChange, valueKey, labelKey, ...inputProps } = props;

  const resolvedValueKey = (valueKey ?? 'value') as keyof T;
  const resolvedLabelKey = (labelKey ?? 'label') as keyof T;

  const selectedOption = options.find((opt) => opt[resolvedValueKey] === value);
  const displayValue = selectedOption ? String(selectedOption[resolvedLabelKey]) : '';

  function handleClose() {
    setIsOpen(false);
  }

  const renderItem = useCallback(
    (option: T) => (
      <Picker.Item
        key={String(option[resolvedValueKey])}
        label={String(option[resolvedLabelKey])}
        value={option[resolvedValueKey] as string | number}
      />
    ),
    []
  );

  return (
    <Fragment>
      <Pressable
        disabled={inputProps.disabled}
        onPress={() => {
          if (IS_ANDROID) {
            pickerRef.current?.focus();
          } else {
            setPendingValue(value as string | number);
            setIsOpen(true);
          }
        }}>
        <View pointerEvents={'none'}>
          <InputText
            {...inputProps}
            isStyleFocused={!!displayValue}
            value={displayValue}
            editable={false}
            showSoftInputOnFocus={false}
            rightIcon={IconEnum.ChevronDownOutline}
          />
        </View>
      </Pressable>
      {IS_ANDROID ? (
        <Picker
          ref={pickerRef}
          selectedValue={value as string | number}
          onValueChange={(itemValue) => {
            onChange(itemValue as T[keyof T]);
          }}
          style={styles.hiddenPicker}>
          {options.map(renderItem)}
        </Picker>
      ) : (
        <ModalBottomSheet
          isVisible={isOpen}
          onClose={handleClose}>
          <View>
            <Pressable onPress={handleClose}>
              <Typography
                align={'right'}
                style={[textStylesShared.underline, sharedLayoutStyles.mt8, sharedLayoutStyles.phLayout]}>
                {translations.common.close}
              </Typography>
            </Pressable>
            <InputDropdownIosPicker
              value={pendingValue}
              onChange={setPendingValue}
              options={options}
              renderItem={renderItem}
            />
            <View style={safeAreaStyles.pbPhLayout}>
              <ButtonText
                text={translations.common.confirm}
                onPress={() => {
                  if (pendingValue !== undefined) {
                    onChange(pendingValue as T[keyof T]);
                  }
                  setIsOpen(false);
                }}
              />
            </View>
          </View>
        </ModalBottomSheet>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  hiddenPicker: {
    position: 'absolute',
    height: 0,
    overflow: 'hidden',
    opacity: 0,
  },
});
