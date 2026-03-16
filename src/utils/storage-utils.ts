import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const StorageKeysEnum = {
  Language: 'language',
  Theme: 'theme',
  Pin: 'pin',
} as const;
export type StorageKeysEnum = (typeof StorageKeysEnum)[keyof typeof StorageKeysEnum];

/**
 * Get value from storage by key
 * @param key - storage key
 * @returns stored value or null if not set
 */
export const getStorageValue = (key: string): null | string => {
  const value = storage.getString(key);
  if (!value) return null;
  return value;
};

/**
 * Set value in storage by key
 * @param key - storage key
 * @param value - value to save, if null or undefined - removes the key from storage
 */
export const setStorageValue = (key: string, value: string): void => {
  storage.set(key, value);
};

/**
 * Remove value from storage by key
 * @param key - storage key to remove
 */
export const removeStorageValue = (key: string): void => {
  storage.remove(key);
};
