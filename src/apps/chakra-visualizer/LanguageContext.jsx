// @ts-nocheck
/* eslint-disable */
import { createContext, useContext, useState } from 'react';
import { en, zh } from './i18n';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

const translations = { en, zh };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });

  const handleSetLang = (newLang) => {
    setLang(newLang);
    try { localStorage.setItem('chakra-lang', newLang); } catch {}
  };

  const t = (key, params) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    let result = val ?? key;
    if(params && typeof result === 'string'){
      for(const [p, v] of Object.entries(params)){
        result = result.replace(`{${p}}`, v);
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
