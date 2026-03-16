import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Locale, localizedStrings, Translations } from './localized-strings';
import * as RNLocalize from 'react-native-localize';
import { getStorageValue, setStorageValue, StorageKeysEnum } from '@utils/storage-utils';

interface LanguageContextValue {
  translations: Translations;
  setLanguage: (language: Locale) => void;
  currentLanguage: Locale;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: FC<PropsWithChildren> = function ({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(() => {
    const storedLanguage =
      (getStorageValue(StorageKeysEnum.Language) ?? RNLocalize.getLocales()[0]?.languageCode ?? Locale.en) as Locale;
    localizedStrings.setLanguage(storedLanguage);
    return storedLanguage;
  });

  const setLanguage = (language: Locale) => {
    localizedStrings.setLanguage(language);
    setCurrentLanguage(language);
    setStorageValue(StorageKeysEnum.Language, language);
  };

  const translations = useMemo(() => localizedStrings as unknown as Translations, [currentLanguage]);

  const value: LanguageContextValue = {
    translations,
    setLanguage,
    currentLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};