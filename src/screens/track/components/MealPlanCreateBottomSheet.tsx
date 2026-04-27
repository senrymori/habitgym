import { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { InputText } from '@ui-kits/inputs/InputText';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';

interface MealPlanCreateBottomSheetProps {
  isVisible: boolean;
  mode: 'create' | 'rename';
  initialName?: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void> | void;
}

export const MealPlanCreateBottomSheet: FC<MealPlanCreateBottomSheetProps> = function (props) {
  const { translations } = useLanguage();
  const safeAreaStyles = useSafeAreaStyles();
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (props.isVisible) {
      setValue(props.initialName ?? '');
      setError(undefined);
      setIsSaving(false);
    }
  }, [props.isVisible, props.initialName]);

  function handleChange(next: string) {
    setValue(next);
    if (error) setError(undefined);
  }

  async function handleSave() {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(translations.track.meal.planNameRequired);
      return;
    }
    setIsSaving(true);
    try {
      await props.onSubmit(trimmed);
      props.onClose();
    } finally {
      setIsSaving(false);
    }
  }

  const label =
    props.mode === 'rename'
      ? translations.track.meal.renamePlan
      : translations.track.meal.newPlan;

  return (
    <ModalBottomSheet
      isVisible={props.isVisible}
      onClose={props.onClose}>
      <View style={[sharedLayoutStyles.p16, sharedLayoutStyles.gap16, safeAreaStyles.pb]}>
        <InputText
          label={label}
          placeholder={translations.track.meal.planNamePlaceholder}
          value={value}
          onChangeText={handleChange}
          errorText={error}
          autoFocus={true}
        />
        <ButtonText
          text={translations.track.meal.save}
          variant={'fill'}
          colorVariant={'primary'}
          loading={isSaving}
          onPress={handleSave}
        />
      </View>
    </ModalBottomSheet>
  );
};
