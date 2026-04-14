import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitTabStackNavigationScreenProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { useHabitCreate } from './use-habit-create';
import { HabitForm } from './components/HabitForm';

export const HabitCreateScreen: FC<HabitTabStackNavigationScreenProps<'HabitCreate'>> = function (props) {
  const habitId = props.route.params?.habitId;
  const safeAreaStyles = useSafeAreaStyles();
  const themeColors = useAppThemeColors();
  const { translations } = useLanguage();
  const { form, onSubmit, isEdit, isReady } = useHabitCreate(habitId);
  const { isValid, isSubmitting } = form.formState;

  const saveDisabled = !isValid || isSubmitting || !isReady;

  return (
    <View style={safeAreaStyles.pLayoutGrow}>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.mb16]}>
        <ButtonIcon
          icon={IconEnum.Back}
          variant={'outline'}
          colorVariant={'primary'}
          onPress={props.navigation.goBack}
        />
        <Typography
          size={18}
          weight={700}>
          {isEdit ? translations.habits.create.editTitle : translations.habits.newHabit}
        </Typography>
        <Pressable
          onPress={onSubmit}
          disabled={saveDisabled}
          style={[
            styles.save,
            sharedLayoutStyles.br12,
            sharedLayoutStyles.center,
            { backgroundColor: saveDisabled ? themeColors.primary200 : themeColors.primary500 },
          ]}>
          <Typography
            weight={700}
            color={themeColors.strongWhite}>
            {translations.habits.save}
          </Typography>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={sharedLayoutStyles.pb24}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <HabitForm form={form} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  save: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
