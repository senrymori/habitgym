import { FC, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useThemeConfig } from '@providers/theme/ThemeConfigProvider';
import logoDark from '@assets/images/logo_for_dark.png';
import logoLight from '@assets/images/logo_for_light.png';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { RootNavigationScreenProps } from '@navigation/navigation-types.ts';

export const SplashScreen: FC<RootNavigationScreenProps<'Splash'>> = function ({ navigation }) {
  const { isDark } = useThemeConfig();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center]}>
      <Image
        source={isDark ? logoDark : logoLight}
        style={styles.logo}
        resizeMode={'contain'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
  },
});
