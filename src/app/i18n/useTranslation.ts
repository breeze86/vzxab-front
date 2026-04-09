"use client";

import { useLanguage } from "./LanguageContext";
import { getTranslation } from "./translations";

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const t = getTranslation(language);

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isZh: language === "zh",
    isEn: language === "en",
  };
}
