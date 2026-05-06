import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

// Import translations
import en from "../locales/en.json";
import es from "../locales/es.json";

// Define available resources
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: I18nManager.isRTL ? "es" : "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages--naming-resources
    fallbackLng: "en", // use en if selected lng is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
