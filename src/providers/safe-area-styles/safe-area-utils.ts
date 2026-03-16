import { EdgeInsets } from 'react-native-safe-area-context';
import { layoutPadding } from '@ui-kits/shared-styles.ts';
import { Platform } from 'react-native';

export function getBottomInset(insets: EdgeInsets, bottomPadding: number = layoutPadding) {
  if (Platform.OS !== 'android') return insets.bottom || bottomPadding;
  return insets.bottom + bottomPadding;
}
