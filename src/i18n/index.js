import React, { createContext, useState, useContext, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import en from './en.json';
import te from './te.json';

const translations = { en, te };
const storage = new MMKV();

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('te'); // Default to Telugu for farmers

  useEffect(() => {
    const savedLocale = storage.getString('language');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLocale(lang);
    storage.set('language', lang);
  };

  const t = (key) => {
    return translations[locale][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ t, locale, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
