import { FC, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Controller, FormProvider } from 'react-hook-form';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { InputText } from '@ui-kits/inputs/InputText';
import { Header } from '@components/Header';
import { EmojiIconPicker } from '@components/emoji-icon-picker/EmojiIconPicker';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { GymTabStackNavigationScreenProps } from '@navigation/home-tabs/gym-tab-stack/gym-tab-stack-types';
import { ProgramExerciseEditor } from './components/ProgramExerciseEditor';
import { useGymProgramActions, useGymProgramDetail } from './gym-program-detail-hooks';

export const GymProgramDetailScreen: FC<GymTabStackNavigationScreenProps<'GymProgramDetail'>> = function ({
  navigation,
  route,
}) {
  const programId = route.params?.programId;
  const selectedExerciseId = route.params?.selectedExerciseId;

  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const { form, exercisesFieldArray, addExerciseFromId, isEdit, isReady } = useGymProgramDetail(programId);
  const { saveProgram } = useGymProgramActions();
  const { control, formState, handleSubmit } = form;
  const { isValid, isSubmitting } = formState;

  useEffect(() => {
    if (!selectedExerciseId) return;
    addExerciseFromId(selectedExerciseId);
    navigation.setParams({ selectedExerciseId: undefined });
  }, [selectedExerciseId, addExerciseFromId, navigation]);

  const handleAddExercisePress = useCallback(() => {
    navigation.navigate('ExerciseList', { mode: 'select' });
  }, [navigation]);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (values) => {
        try {
          await saveProgram(values, programId);
          navigation.goBack();
        } catch (e) {
          console.error('[GymProgramDetailScreen] save failed', e);
        }
      }),
    [handleSubmit, saveProgram, programId, navigation]
  );

  const saveDisabled = !isValid || isSubmitting || !isReady;

  return (
    <View style={[safeAreaStyles.ptPhLayout, sharedLayoutStyles.flex1]}>
      <Header
        isBack={true}
        title={isEdit ? translations.gym.programName : translations.gym.newProgram}
      />
      <NestableScrollContainer
        contentContainerStyle={[sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pv24, sharedLayoutStyles.gap16]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <FormProvider {...form}>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
            <Controller
              control={control}
              name={'icon'}
              render={({ field }) => (
                <EmojiIconPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={'title'}
                rules={{
                  required: translations.gym.validation.titleRequired,
                  validate: (v) => v.trim().length >= 1 || translations.gym.validation.titleRequired,
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    label={translations.gym.programName}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    errorText={fieldState.error?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name={'restBetweenExercises'}
            render={({ field }) => (
              <InputText
                label={`${translations.gym.restBetweenExercises}, ${translations.gym.minutes}`}
                value={restToString(field.value)}
                onChangeText={(t) => field.onChange(parseRest(t))}
                keyboardType={'number-pad'}
              />
            )}
          />

          <ProgramExerciseEditor
            exercisesFieldArray={exercisesFieldArray}
            onAddPress={handleAddExercisePress}
          />
        </FormProvider>

        <View style={sharedLayoutStyles.flex1} />

        <ButtonText
          text={translations.gym.save}
          onPress={onSubmit}
          disabled={saveDisabled}
        />
      </NestableScrollContainer>
    </View>
  );
};

function restToString(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '';
  return String(value);
}

function parseRest(text: string): number {
  if (text.length === 0) return 0;
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
