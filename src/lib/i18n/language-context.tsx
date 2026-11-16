'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getLocalizedPath: (path: string, targetLang?: Language) => string;
  t: Translations;
  formatCurrency: (amount: number | null | undefined) => string;
  formatDate: (dateStr: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>('km');

  // Strip existing /km or /en prefix and return a path with target language
  const getLocalizedPath = useCallback(
    (path: string, targetLang?: Language): string => {
      const activeLang = targetLang || language;
      const stripped = path.replace(/^\/(km|en)(\/|$)/, '/');
      const clean = stripped.startsWith('/') ? stripped : `/${stripped}`;
      return `/${activeLang}${clean === '/' ? '' : clean}`;
    },
    [language]
  );

  // Sync language with current URL path or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/km/') || currentPath === '/km') {
      setLanguageState('km');
      try {
        localStorage.setItem('engineerbiz_lang', 'km');
        document.cookie = 'engineerbiz_lang=km; path=/; max-age=31536000; SameSite=Lax';
      } catch (_) {}
    } else if (currentPath.startsWith('/en/') || currentPath === '/en') {
      setLanguageState('en');
      try {
        localStorage.setItem('engineerbiz_lang', 'en');
        document.cookie = 'engineerbiz_lang=en; path=/; max-age=31536000; SameSite=Lax';
      } catch (_) {}
    } else {
      let active: Language = 'km';
      try {
        const saved = localStorage.getItem('engineerbiz_lang') as Language;
        if (saved === 'km' || saved === 'en') {
          active = saved;
        }
      } catch (_) {}
      setLanguageState(active);

      // Auto redirect unprefixed paths to include language prefix (e.g. /dashboard -> /km/dashboard)
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      if (currentPath === '/') {
        router.replace(`/${active}/dashboard`);
      } else {
        router.replace(`/${active}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}${search}${hash}`);
      }
    }
  }, [pathname, router]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('engineerbiz_lang', lang);
      document.cookie = `engineerbiz_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (_) {}

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      const newPath = getLocalizedPath(currentPath, lang);
      const targetUrl = `${newPath}${search}${hash}`;

      router.push(targetUrl);
    }
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      if (language === 'km') {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        getLocalizedPath,
        t: translations[language],
        formatCurrency,
        formatDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
