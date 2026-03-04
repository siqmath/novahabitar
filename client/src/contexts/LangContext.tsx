import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { type Lang, translations, type Translations } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "pt",
  t: translations.pt,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [lang, setLangState] = useState<Lang>("pt");

  // Detect lang from URL on mount and navigation
  useEffect(() => {
    if (location.startsWith("/en")) {
      setLangState("en");
    } else {
      setLangState("pt");
    }
  }, [location]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    // Preserve hash/path after lang prefix
    const currentPath = location.replace(/^\/(pt|en)/, "") || "/";
    navigate(`/${newLang}${currentPath === "/" ? "" : currentPath}`);
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
