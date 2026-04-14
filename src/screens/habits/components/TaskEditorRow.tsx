import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { InputText } from '@ui-kits/inputs/InputText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { TimeField } from './TimeField';

interface TaskEditorRowProps {
  index: number;
  onRemove: () => void;
}

export const TaskEditorRow: FC<TaskEditorRowProps> = function (props) {
  const { setValue, watch } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const time = watch(`tasks.${props.index}.time`);
  const label = watch(`tasks.${props.index}.label`);

  return (
    <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
      <TimeField
        value={time}
        onChange={(t) => setValue(`tasks.${props.index}.time`, t, { shouldValidate: true, shouldDirty: true })}
      />
      <View style={sharedLayoutStyles.flex1}>
        <InputText
          value={label}
          onChangeText={(v) => setValue(`tasks.${props.index}.label`, v, { shouldValidate: true, shouldDirty: true })}
          placeholder={translations.habits.create.placeholderTaskLabel}
        />
      </View>
      <Pressable onPress={props.onRemove}>
        <Typography
          icon={IconEnum.Trash}
          size={20}
          color={themeColors.error}
        />
      </Pressable>
    </View>
  );
};
