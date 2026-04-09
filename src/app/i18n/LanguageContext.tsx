"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Language } from "./types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "vzxab-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "zh";
  }
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored === "zh" || stored === "en") {
    return stored;
  }
  return "zh";
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguageState(getInitialLanguage());
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage }}
    >
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
