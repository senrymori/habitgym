import { FC, memo } from 'react';
import { Pressable, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { InputText } from '@ui-kits/inputs/InputText';
import { TimeInput } from '@ui-kits/inputs/TimeInput';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { TaskIndexBadge } from './TaskIndexBadge.tsx';

interface TaskEditorRowProps {
  index: number;
  onRemove: (index: number) => void;
  fieldPrefix?: string;
  useTaskTime: boolean;
  drag?: () => void;
  isActive?: boolean;
}

const TaskEditorRowBase: FC<TaskEditorRowProps> = function (props) {
  const { control } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const prefix = props.fieldPrefix ?? 'tasks';
  const timeName = `${prefix}.${props.index}.time` as const;
  const labelName = `${prefix}.${props.index}.label` as const;

  const leading = props.useTaskTime ? (
    <Controller
      control={control}
      name={timeName as any}
      render={({ field }) => (
        <TimeInput
          value={field.value || '09:00'}
          onChange={field.onChange}
        />
      )}
    />
  ) : (
    <TaskIndexBadge index={props.index} />
  );

  return (
    <Pressable
      onLongPress={props.drag}
      disabled={props.isActive}
      delayLongPress={200}
      style={[sharedLayoutStyles.rowAlignEnd, sharedLayoutStyles.gap8]}>
      {leading}
      <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.gap8, sharedLayoutStyles.rowAlignCenter]}>
        <View style={sharedLayoutStyles.flex1}>
          <Controller
            control={control}
            name={labelName as any}
            render={({ field }) => (
              <InputText
                value={field.value ?? ''}
                onChangeText={field.onChange}
                placeholder={translations.habits.create.placeholderTaskLabel}
              />
            )}
          />
        </View>
        <ButtonIcon
          icon={IconEnum.Trash}
          variant={'fill'}
          colorVariant={'contrast'}
          onPress={() => props.onRemove(props.index)}
        />
      </View>
    </Pressable>
  );
};

export const TaskEditorRow = memo(TaskEditorRowBase);
