import { FC, useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { Controller, FormProvider } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { InputText } from '@ui-kits/inputs/InputText';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Header } from '@components/Header';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { TrackTabStackNavigationScreenProps } from '@navigation/home-tabs/track-tab-stack/track-tab-stack-types';
import { useExerciseActions, useExerciseDetail } from './exercise-detail-hooks';
import { exerciseTypeSegments } from './exercise-detail-consts';
import { ExerciseTagsAutocomplete } from './components/ExerciseTagsAutocomplete';

export const ExerciseDetailScreen: FC<TrackTabStackNavigationScreenProps<'ExerciseDetail'>> = function (props) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();

  const exerciseId = props.route.params?.exerciseId;
  const { form, isEdit, isReady } = useExerciseDetail(exerciseId);
  const { saveExercise, deleteExercise } = useExerciseActions(exerciseId);
  const { control } = form;
  const { isValid, isSubmitting } = form.formState;

  const onSubmit = useMemo(
    () =>
      form.handleSubmit(async (values) => {
        await saveExercise(values);
        props.navigation.goBack();
      }),
    [form, saveExercise, props.navigation]
  );

  const handleDeletePress = useCallback(() => {
    Alert.alert(
      translations.track.exercise.deleteConfirmTitle,
      translations.track.exercise.deleteConfirmMessage,
      [
        { text: translations.track.exercise.cancel, style: 'cancel' },
        {
          text: translations.track.exercise.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteExercise();
            props.navigation.goBack();
          },
        },
      ]
    );
  }, [translations, deleteExercise, props.navigation]);

  const saveDisabled = !isValid || isSubmitting || !isReady;

  return (
    <View style={[safeAreaStyles.pLayoutGrow, sharedLayoutStyles.flex1]}>
      <Header
        isBack={true}
        title={isEdit ? translations.track.exercise.edit : translations.track.exercise.addExercise}
        rightElement={
          isEdit ? (
            <ButtonIcon
              icon={IconEnum.Trash}
              colorVariant={'contrast'}
              onPress={handleDeletePress}
            />
          ) : undefined
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[sharedLayoutStyles.gap16, sharedLayoutStyles.pv24, sharedLayoutStyles.flexGrow1]}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <FormProvider {...form}>
          <Controller
            control={control}
            name={'title'}
            rules={{
              required: translations.track.exercise.validation.titleRequired,
              validate: (value) =>
                value.trim().length > 0 || translations.track.exercise.validation.titleRequired,
            }}
            render={({ field, fieldState }) => (
              <InputText
                label={translations.track.exercise.name}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={translations.track.exercise.namePlaceholder}
                errorText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name={'description'}
            render={({ field }) => (
              <InputText
                label={translations.track.exercise.description}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={translations.track.exercise.descriptionPlaceholder}
                multiline={true}
              />
            )}
          />
          <Controller
            control={control}
            name={'exerciseType'}
            render={({ field }) => {
              const index = exerciseTypeSegments.indexOf(field.value);
              return (
                <SegmentedControl
                  segments={[translations.track.exercise.strength, translations.track.exercise.cardio]}
                  selectedIndex={index < 0 ? 0 : index}
                  onChange={(i) => field.onChange(exerciseTypeSegments[i])}
                />
              );
            }}
          />
          <Controller
            control={control}
            name={'tags'}
            render={({ field }) => (
              <ExerciseTagsAutocomplete
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <View style={sharedLayoutStyles.flex1} />
          <ButtonText
            text={translations.track.exercise.save}
            onPress={onSubmit}
            disabled={saveDisabled}
          />
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};
