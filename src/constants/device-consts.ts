import { Platform } from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const DEVICE_NAME = IS_IOS
  ? 'iPhone'
  : String((Platform.constants as { Model?: string }).Model ?? 'Android Device');

export const DEVICE_OS_VERSION = IS_IOS ? `iOS ${Platform.Version}` : `Android ${Platform.Version}`;

export const DEVICE_LOCATION = Intl.DateTimeFormat().resolvedOptions().timeZone;