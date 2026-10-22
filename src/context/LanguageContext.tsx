import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Language, Translations, translations } from '../locales/translations';

export type { Language, Translations };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language | string) => void;
  toggleLanguage: () => void;
  changeLanguage: (lang: Language | string) => void;
  t: ((key: string) => string) & Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ac_lang';

const normalizeLanguage = (langStr: string | null | undefined): Language => {
  if (!langStr) return 'en';
  const lower = langStr.toLowerCase();
  if (lower === 'vi') return 'vi';
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return normalizeLanguage(saved);
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language | string) => {
    const normalized = normalizeLanguage(lang);
    setLanguageState(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, normalized);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'vi' : 'en';
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
    }
  }, [language]);

  const t = useMemo(() => {
    const currentDict = translations[language] || translations.en;
    const translateFn = (key: string): string => {
      if (key in currentDict) {
        return currentDict[key as keyof Translations];
      }
      return key;
    };

    return new Proxy(translateFn, {
      get(target, prop, receiver) {
        if (typeof prop === 'string' && prop in currentDict) {
          return currentDict[prop as keyof Translations];
        }
        return Reflect.get(target, prop, receiver);
      },
    }) as ((key: string) => string) & Translations;
  }, [language]);

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      changeLanguage: setLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
