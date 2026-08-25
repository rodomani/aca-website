import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import ko from "./locales/ko";

export const supportedLanguages = ["en", "ko"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const resources = {
  en: { translation: en },
  ko: { translation: ko },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: supportedLanguages,
    fallbackLng: "en",
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "website-language",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;