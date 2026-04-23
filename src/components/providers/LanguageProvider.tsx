"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface BilingualContent {
  en: string;
  ar: string;
}

interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  t: (content: BilingualContent | string | undefined | null) => string;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  dir: "ltr",
  t: (content) => typeof content === "string" ? content : content?.en || "",
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && ["en", "ar"].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  const dir = lang === "ar" ? "rtl" : "ltr";

  const t = (content: BilingualContent | string | undefined | null): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    return content[lang] || content.en || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function BilingualText({ content, className = "" }: { 
  content: BilingualContent | string | undefined | null; 
  className?: string;
}) {
  const { t } = useLanguage();
  return <span className={className}>{t(content)}</span>;
}

export function BilingualTextarea({ content, className = "" }: { 
  content: { en: string; ar: string }; 
  className?: string;
}) {
  const { lang } = useLanguage();
  return <span className={className}>{content[lang] || content.en}</span>;
}