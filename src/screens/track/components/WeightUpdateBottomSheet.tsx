import { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { InputText } from '@ui-kits/inputs/InputText';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { WeightUnit } from '@db/db-types';

interface WeightUpdateBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  defaultUnit: WeightUnit;
  onSubmit: (weight: number, unit: WeightUnit) => Promise<void> | void;
}

export const WeightUpdateBottomSheet: FC<WeightUpdateBottomSheetProps> = function (props) {
  const { translations } = useLanguage();
  const safeAreaStyles = useSafeAreaStyles();
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Reset local state on close so the next open starts clean
  useEffect(() => {
    if (!props.isVisible) {
      setValue('');
      setError(undefined);
      setIsSaving(false);
    }
  }, [props.isVisible]);

  async function handleSave() {
    const parsed = parseFloat(value.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError(translations.track.weight.errorInvalid);
      return;
    }
    setIsSaving(true);
    try {
      await props.onSubmit(parsed, props.defaultUnit);
      props.onClose();
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(next: string) {
    setValue(next);
    if (error) setError(undefined);
  }

  return (
    <ModalBottomSheet
      isVisible={props.isVisible}
      onClose={props.onClose}>
      <View style={[sharedLayoutStyles.p16, sharedLayoutStyles.gap16, safeAreaStyles.pb]}>
        <InputText
          label={translations.track.weight.update}
          placeholder={translations.track.weight.placeholder}
          keyboardType={'decimal-pad'}
          value={value}
          onChangeText={handleChange}
          errorText={error}
          autoFocus={true}
        />
        <ButtonText
          text={translations.track.weight.save}
          variant={'fill'}
          colorVariant={'primary'}
          loading={isSaving}
          onPress={handleSave}
        />
      </View>
    </ModalBottomSheet>
  );
};
