"use client";

import { useLanguage } from "@/components/language/LanguageProvider";
import type { LocalizedText } from "@/types/release";

type ReleaseLanguageContentProps = {
  en?: string;
  ru?: string;
  description?: LocalizedText;
};

export default function ReleaseLanguageContent({
  en,
  ru,
  description,
}: ReleaseLanguageContentProps) {
  const { language } = useLanguage();

  const isRU = language === "RU";

  // Если передан description
  if (description) {
    return (
      <>
        {isRU
          ? description.ru
          : description.en}
      </>
    );
  }

  // Обычный перевод EN / RU
  return (
    <>
      {isRU ? ru : en}
    </>
  );
}