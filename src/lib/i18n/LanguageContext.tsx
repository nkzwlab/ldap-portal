"use client";

import React, { createContext, useContext, useState } from "react";
import { Language, translations, Translations } from "./translations";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ja",
  toggleLanguage: () => {},
  t: translations.ja,
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("ja");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ja" ? "en" : "ja"));
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
