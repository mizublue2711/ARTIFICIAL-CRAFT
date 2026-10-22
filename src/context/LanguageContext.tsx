import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'VI';

export interface Translations {
  heroTitleLine1: string;
  heroTitleLine2: string;
  subtitle: string;
  ctaButton: string;
  exportBlueprint: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Where Meticulous Graphic Design Meets Deterministic AI Automation.',
    ctaButton: 'Launch Autopilot Studio',
    exportBlueprint: 'Export HD Diagram',
  },
  VI: {
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Nơi Thiết Kế Đồ Họa Tỉ Mẩn Gặp Tự Động Hóa AI Xác Định.',
    ctaButton: 'Kích Hoạt Autopilot Studio',
    exportBlueprint: 'Xuất Ảnh Sơ Đồ HD',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ac_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved === 'EN' || saved === 'VI') {
        return saved;
      }
    }
    return 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
