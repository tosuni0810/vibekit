"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "ko" | "en";

const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void }>({
  language: "ko",
  toggleLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");

  useEffect(() => {
    const saved = window.localStorage.getItem("vibekit-language");
    if (saved === "en" || saved === "ko") setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("vibekit-language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, toggleLanguage: () => setLanguage((value) => value === "ko" ? "en" : "ko") }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
