import { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';
import { PinCodeNavigationScreenProps } from '@navigation/pin-code-stack/pin-code-stack-types.ts';
import { setStorageValue, StorageKeysEnum } from '@utils/storage-utils.ts';
import { PinDots } from './components/PinDots.tsx';
import { PinNumpad } from './components/PinNumpad.tsx';
import { PIN_LENGTH } from './pin-consts.ts';

export const PinSetupScreen: FC<PinCodeNavigationScreenProps<'PinSetup'>> = function ({ navigation }) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();

  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasError, setHasError] = useState(false);

  const currentPin = step === 'setup' ? pin : confirmPin;
  const setCurrentPin = step === 'setup' ? setPin : setConfirmPin;

  return (
    <View style={[safeAreaStyles.pLayoutGrowWithSpace, styles.container]}>
      <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap24]}>
        <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap8]}>
          <Typography
            size={24}
            weight={700}
            align={'center'}>
            {step === 'setup' ? translations.screens.pinSetup.title : translations.screens.pinSetup.confirmTitle}
          </Typography>
          <Typography
            color={themeColors.textSecondary}
            align={'center'}>
            {step === 'setup' ? translations.screens.pinSetup.subtitle : translations.screens.pinSetup.confirmSubtitle}
          </Typography>
        </View>

        <PinDots
          filledCount={currentPin.length}
          hasError={hasError}
        />

        {hasError && (
          <Typography
            size={14}
            color={themeColors.error}
            align={'center'}>
            {translations.screens.pinSetup.errorMismatch}
          </Typography>
        )}
      </View>

      <View style={sharedLayoutStyles.gap16}>
        {step === 'confirm' && (
          <TouchableOpacity
            onPress={() => {
              setStep('setup');
              setPin('');
              setConfirmPin('');
              setHasError(false);
            }}
            style={styles.changeButton}>
            <Typography
              weight={600}
              color={themeColors.primary400}
              align={'center'}>
              {translations.screens.pinSetup.changePin}
            </Typography>
          </TouchableOpacity>
        )}
        <PinNumpad
          onDigit={async (digit: string) => {
            if (hasError) return;
            if (currentPin.length >= PIN_LENGTH) return;

            const next = currentPin + digit;
            setCurrentPin(next);

            if (next.length === PIN_LENGTH) {
              if (step === 'setup') {
                setStep('confirm');
              } else {
                if (next === pin) {
                  setStorageValue(StorageKeysEnum.Pin, pin);
                  await Keychain.setGenericPassword('pin', pin, {
                    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                  });
                  navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] }));
                } else {
                  setHasError(true);
                  setTimeout(() => {
                    setConfirmPin('');
                    setHasError(false);
                  }, 600);
                }
              }
            }
          }}
          onBackspace={() => {
            if (hasError) return;
            setCurrentPin(currentPin.slice(0, -1));
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  changeButton: {
    paddingVertical: 4,
  },
});
