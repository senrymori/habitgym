import { FC } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitTabStackNavigationScreenProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { useHabitCreate } from './use-habit-create';
import { HabitForm } from './components/form-creation/HabitForm.tsx';
import { Header } from '@components/Header.tsx';
import { ButtonText } from '@ui-kits/Button/ButtonText.tsx';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export const HabitCreateScreen: FC<HabitTabStackNavigationScreenProps<'HabitCreate'>> = function ({
  navigation,
  route,
}) {
  const habitId = route.params?.habitId;
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const { form, onSubmit, isEdit, isReady } = useHabitCreate(habitId);
  const { isValid, isSubmitting } = form.formState;

  const saveDisabled = !isValid || isSubmitting || !isReady;

  return (
    <View style={[safeAreaStyles.ptPhLayout, sharedLayoutStyles.flex1]}>
      <Header
        isBack={false}
        title={isEdit ? translations.habits.create.editTitle : translations.habits.newHabit}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={[sharedLayoutStyles.flexGrow1, sharedLayoutStyles.pv24]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <HabitForm
          form={form}
          isEdit={isEdit}
        />
        <View style={sharedLayoutStyles.flex1} />
        <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
          {!!habitId && (
            <ButtonIcon
              colorVariant={'contrast'}
              size={'large'}
              icon={IconEnum.Back}
              onPress={() => navigation.goBack()}
            />
          )}

          <ButtonText
            style={sharedLayoutStyles.flex1}
            text={translations.habits.save}
            onPress={onSubmit}
            disabled={saveDisabled}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
