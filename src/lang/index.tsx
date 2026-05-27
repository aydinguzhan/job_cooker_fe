import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LanguageContext, type Language } from "./context";
import en from "./en.json";
import tr from "./tr.json";

type TranslationValue = string | Record<string, TranslationValue>;

type TranslationDictionary = Record<string, TranslationValue>;

const LANGUAGE_STORAGE_KEY = "app_language";

const resources: Record<Language, TranslationDictionary> = {
  tr,
  en,
};

function getNestedValue(
  dictionary: TranslationDictionary,
  key: string
): string | undefined {
  const value = key
    .split(".")
    .reduce<TranslationValue | undefined>((current, part) => {
      if (!current || typeof current === "string") {
        return undefined;
      }

      return current[part];
    }, dictionary);

  return typeof value === "string" ? value : undefined;
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "tr";
  }

  const savedLanguage = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  ) as Language | null;

  if (savedLanguage === "tr" || savedLanguage === "en") {
    return savedLanguage;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith("tr") ? "tr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
  }

  function t(key: string, variables?: Record<string, string | number>) {
    const selectedResource = resources[language];
    const fallbackResource = resources.tr;

    const rawValue =
      getNestedValue(selectedResource, key) ??
      getNestedValue(fallbackResource, key) ??
      key;

    if (!variables) {
      return rawValue;
    }

    return Object.entries(variables).reduce((message, [variableKey, value]) => {
      return message.replaceAll(`{${variableKey}}`, String(value));
    }, rawValue);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
