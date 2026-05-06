import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import { Platform } from "react-native";

import en from "../locales/en.json";
import es from "../locales/es.json";

let currentLanguage = I18nManager.isRTL ? "es" : "en";

export const changeLanguage = async (lng: string) => {
  currentLanguage = lng;
  await i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => currentLanguage;

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n.use(initReactI18next).init({
  resources,
  lng: currentLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;