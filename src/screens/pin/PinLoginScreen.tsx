import { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { useSafeAreaStyles } from '@providers/safe-area-styles/SafeAreaStylesProvider.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';
import { PinCodeNavigationScreenProps } from '@navigation/pin-code-stack/pin-code-stack-types.ts';
import { getStorageValue, StorageKeysEnum } from '@utils/storage-utils.ts';
import { PinDots } from './components/PinDots.tsx';
import { PinNumpad } from './components/PinNumpad.tsx';
import { PIN_LENGTH } from './pin-consts.ts';
import { getValueIfTruthy } from '@utils/common-utils.ts';

export const PinLoginScreen: FC<PinCodeNavigationScreenProps<'PinLogin'>> = function ({ navigation }) {
  const safeAreaStyles = useSafeAreaStyles();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();

  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [biometryType, setBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);

  useEffect(() => {
    Keychain.getSupportedBiometryType().then((type) => {
      setBiometryType(type);
    });
  }, []);

  useEffect(() => {
    if (biometryType) {
      handleBiometric();
    }
  }, [biometryType]);

  function handleUnlock() {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeTabs' }] }));
  }

  async function handleBiometric() {
    try {
      const result = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: translations.screens.pinLogin.title,
        },
      });
      if (result) {
        handleUnlock();
      }
    } catch {
      // user cancelled or biometrics failed — do nothing
    }
  }

  return (
    <View style={[safeAreaStyles.pLayoutGrowWithSpace, styles.container]}>
      <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap24]}>
        <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap8]}>
          <Typography
            size={24}
            weight={700}
            align={'center'}>
            {translations.screens.pinLogin.title}
          </Typography>
          <Typography
            color={themeColors.primary500}
            align={'center'}>
            {translations.screens.pinLogin.subtitle}
          </Typography>
        </View>

        <PinDots
          filledCount={pin.length}
          hasError={hasError}
        />

        {hasError && (
          <Typography
            size={14}
            color={themeColors.error}
            align={'center'}>
            {translations.screens.pinLogin.errorWrong}
          </Typography>
        )}
      </View>

      <PinNumpad
        onDigit={(digit: string) => {
          if (hasError) return;
          if (pin.length >= PIN_LENGTH) return;

          const next = pin + digit;
          setPin(next);

          if (next.length === PIN_LENGTH) {
            const savedPin = getStorageValue(StorageKeysEnum.Pin);
            if (next === savedPin) {
              handleUnlock();
            } else {
              setHasError(true);
              setTimeout(() => {
                setPin('');
                setHasError(false);
              }, 600);
            }
          }
        }}
        onBackspace={() => {
          if (hasError) return;
          setPin(pin.slice(0, -1));
        }}
        onBiometric={getValueIfTruthy(handleBiometric, biometryType !== null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
});
