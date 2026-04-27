import { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ModalBottomSheet } from '@components/modals/ModalBottomSheet';
import { InputText } from '@ui-kits/inputs/InputText';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { MealItemFormValues } from '../meal-plan-types';

interface MealItemEditBottomSheetProps {
  isVisible: boolean;
  mode: 'create' | 'edit';
  initialItem?: MealPlanItem | null;
  onClose: () => void;
  onSubmit: (values: MealItemFormValues) => Promise<void> | void;
}

const emptyValues: MealItemFormValues = {
  productName: '',
  grams: '',
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
};

export const MealItemEditBottomSheet: FC<MealItemEditBottomSheetProps> = function (props) {
  const { translations } = useLanguage();
  const safeAreaStyles = useSafeAreaStyles();
  const [values, setValues] = useState<MealItemFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof MealItemFormValues, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!props.isVisible) return;
    if (props.initialItem) {
      setValues({
        productName: props.initialItem.productName,
        grams: String(props.initialItem.grams),
        calories: String(props.initialItem.calories),
        protein: String(props.initialItem.protein),
        fat: String(props.initialItem.fat),
        carbs: String(props.initialItem.carbs),
      });
    } else {
      setValues(emptyValues);
    }
    setErrors({});
    setIsSaving(false);
  }, [props.isVisible, props.initialItem]);

  function setField(key: keyof MealItemFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): Partial<Record<keyof MealItemFormValues, string>> {
    const next: Partial<Record<keyof MealItemFormValues, string>> = {};
    if (!values.productName.trim()) {
      next.productName = translations.track.meal.productNameRequired;
    }
    const grams = parseNumber(values.grams);
    if (!Number.isFinite(grams) || grams <= 0) {
      next.grams = translations.track.meal.gramsRequired;
    }
    for (const key of ['calories', 'protein', 'fat', 'carbs'] as const) {
      const num = parseNumber(values[key]);
      if (!Number.isFinite(num) || num < 0) {
        next[key] = translations.track.meal.invalidNumber;
      }
    }
    return next;
  }

  async function handleSave() {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setIsSaving(true);
    try {
      await props.onSubmit(values);
      props.onClose();
    } finally {
      setIsSaving(false);
    }
  }

  const title =
    props.mode === 'edit'
      ? translations.track.meal.editItem
      : translations.track.meal.newItem;

  return (
    <ModalBottomSheet
      isVisible={props.isVisible}
      onClose={props.onClose}>
      <View style={[sharedLayoutStyles.p16, sharedLayoutStyles.gap16, safeAreaStyles.pb]}>
        <Typography
          size={18}
          weight={700}>
          {title}
        </Typography>
        <InputText
          label={translations.track.meal.productName}
          placeholder={translations.track.meal.productNamePlaceholder}
          value={values.productName}
          onChangeText={(v) => setField('productName', v)}
          errorText={errors.productName}
          autoFocus={true}
        />
        <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap12]}>
          <View style={sharedLayoutStyles.flex1}>
            <InputText
              label={translations.track.meal.grams}
              keyboardType={'decimal-pad'}
              value={values.grams}
              onChangeText={(v) => setField('grams', v)}
              errorText={errors.grams}
            />
          </View>
          <View style={sharedLayoutStyles.flex1}>
            <InputText
              label={translations.track.meal.calories}
              keyboardType={'decimal-pad'}
              value={values.calories}
              onChangeText={(v) => setField('calories', v)}
              errorText={errors.calories}
            />
          </View>
        </View>
        <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap12]}>
          <View style={sharedLayoutStyles.flex1}>
            <InputText
              label={translations.track.meal.fat}
              keyboardType={'decimal-pad'}
              value={values.fat}
              onChangeText={(v) => setField('fat', v)}
              errorText={errors.fat}
            />
          </View>
          <View style={sharedLayoutStyles.flex1}>
            <InputText
              label={translations.track.meal.protein}
              keyboardType={'decimal-pad'}
              value={values.protein}
              onChangeText={(v) => setField('protein', v)}
              errorText={errors.protein}
            />
          </View>
          <View style={sharedLayoutStyles.flex1}>
            <InputText
              label={translations.track.meal.carbs}
              keyboardType={'decimal-pad'}
              value={values.carbs}
              onChangeText={(v) => setField('carbs', v)}
              errorText={errors.carbs}
            />
          </View>
        </View>
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

function parseNumber(value: string): number {
  return parseFloat(value.replace(',', '.'));
}
