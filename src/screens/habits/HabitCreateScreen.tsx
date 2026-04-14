import { FC } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitTabStackNavigationScreenProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { useHabitCreate } from './use-habit-create';
import { HabitForm } from './components/HabitForm';
import { Header } from '@components/Header.tsx';
import { ButtonText } from '@ui-kits/Button/ButtonText.tsx';

export const HabitCreateScreen: FC<HabitTabStackNavigationScreenProps<'HabitCreate'>> = function (props) {
  const habitId = props.route.params?.habitId;
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const { form, onSubmit, isEdit, isReady } = useHabitCreate(habitId);
  const { isValid, isSubmitting } = form.formState;

  const saveDisabled = !isValid || isSubmitting || !isReady;

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <Header
        isBack={false}
        title={isEdit ? translations.habits.create.editTitle : translations.habits.newHabit}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={sharedLayoutStyles.pv24}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <HabitForm form={form} />

        <ButtonText
          text={translations.habits.save}
          onPress={onSubmit}
          disabled={saveDisabled}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
