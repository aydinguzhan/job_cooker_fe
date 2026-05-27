import { createContext } from "react";

export type Language = "tr" | "en";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
