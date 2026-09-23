"use client";

import { useLanguage } from "@/components/language/LanguageProvider";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="
        text-sm
        tracking-[0.2em]
        text-white/70
        transition-all
        duration-300
        hover:text-cyan-300
      "
    >
      {language}
    </button>
  );
}