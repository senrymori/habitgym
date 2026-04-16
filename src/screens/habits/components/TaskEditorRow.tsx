import { FC } from 'react';
import { View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { InputText } from '@ui-kits/inputs/InputText';
import { TimeInput } from '@ui-kits/inputs/TimeInput';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';

interface TaskEditorRowProps {
  index: number;
  onRemove: () => void;
  fieldPrefix?: string;
}

export const TaskEditorRow: FC<TaskEditorRowProps> = function (props) {
  const { setValue, watch } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const prefix = props.fieldPrefix ?? 'tasks';
  const time: string = watch(`${prefix}.${props.index}.time` as any) ?? '09:00';
  const label: string = watch(`${prefix}.${props.index}.label` as any) ?? '';

  return (
    <View style={[sharedLayoutStyles.rowAlignEnd, sharedLayoutStyles.gap8]}>
      <TimeInput
        value={time}
        onChange={(t) => setValue(`${prefix}.${props.index}.time` as any, t, { shouldValidate: true, shouldDirty: true })}
      />
      <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.gap8, sharedLayoutStyles.rowAlignCenter]}>
        <View style={sharedLayoutStyles.flex1}>
          <InputText
            value={label}
            onChangeText={(v) => setValue(`${prefix}.${props.index}.label` as any, v, { shouldValidate: true, shouldDirty: true })}
            placeholder={translations.habits.create.placeholderTaskLabel}
          />
        </View>
        <ButtonIcon
          icon={IconEnum.Trash}
          variant={'fill'}
          colorVariant={'contrast'}
          onPress={props.onRemove}
        />
      </View>
    </View>
  );
};
