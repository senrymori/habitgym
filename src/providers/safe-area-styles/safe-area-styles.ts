// We should add here the most used safe area styles
import { EdgeInsets } from 'react-native-safe-area-context';
import { getBottomInset } from '@providers/safe-area-styles/safe-area-utils.ts';
import { StatusBar, StyleSheet } from 'react-native';
import { layoutPadding, sharedLayoutStyles } from '@ui-kits/shared-styles.ts';

export function getSafeAreaStyles(insets: EdgeInsets) {
  const bottomInset = getBottomInset(insets);

  return StyleSheet.create({
    pt: {
      paddingTop: insets.top || StatusBar.currentHeight,
    },
    ptPhLayout: {
      ...sharedLayoutStyles.phLayout,
      paddingTop: insets.top || StatusBar.currentHeight,
    },
    pbPhLayout: {
      ...sharedLayoutStyles.phLayout,
      paddingBottom: bottomInset,
    },
    pb: {
      paddingBottom: bottomInset,
    },
    pLayoutGrow: {
      ...sharedLayoutStyles.phLayout,
      ...sharedLayoutStyles.flexGrow1,
      paddingTop: insets.top || StatusBar.currentHeight,
      paddingBottom: bottomInset,
    },
    pLayoutGrowWithSpace: {
      ...sharedLayoutStyles.phLayout,
      ...sharedLayoutStyles.flexGrow1,
      paddingTop: (insets.top ?? StatusBar.currentHeight) + layoutPadding,
      paddingBottom: bottomInset + layoutPadding,
    },

    mbInset: {
      marginBottom: insets.bottom,
    },

    bottomPosition: {
      bottom: bottomInset,
    },
    topPosition: {
      top: insets.top || StatusBar.currentHeight,
    },
  });
}
