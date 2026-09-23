"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { translations } from "@/data/translations";

type VisualCardContent = {
  category?: string;

  title?: {
    first?: string;
    second?: string;
    third?: string;
  };

  description?: string;
  image?: string;
  position?: string;
  code?: string;
};

type GalleryItemContent = {
  image: string;
  category: string;
  title: string;
  size: "large" | "small" | "wide";
};

type VisualsContent = {
  label?: string;

  heroTitle?: {
    first?: string;
    second?: string;
    third?: string;
  };

  heroDescription?: string;
  experiences?: string;
  language?: string;
  categories?: string;
  signalActive?: string;
  visualSystem?: string;
  bottom?: string;

  galleryLabel?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  gallery?: string;

  liveSoon?: string;
  motionSoon?: string;
  btsSoon?: string;
  end?: string;

  cards?: {
    one?: VisualCardContent;
    two?: VisualCardContent;
    three?: VisualCardContent;
  };

  galleryItems?: GalleryItemContent[];
};

type VisualsPreviewContent = {
  image?: string;
  label?: string;
  counter?: string;
  topLabel?: string;
  explore?: string;
  eyebrow?: string;
  titleFirst?: string;
  titleSecond?: string;
  titleThird?: string;
  description?: string;
  enterVisuals?: string;
  bottomLabel?: string;
};

type TranslationLanguageContent =
  (typeof translations)[keyof typeof translations];

type LanguageContent = TranslationLanguageContent & {
  visuals?: VisualsContent;
  visualsPreview?: VisualsPreviewContent;
};

type SiteContent = {
  EN: LanguageContent;
  RU: LanguageContent;
};

const defaultContent =
  translations as unknown as SiteContent;

const SiteContentContext =
  createContext<SiteContent>(defaultContent);

export function SiteContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent: SiteContent;
}) {
  const [content, setContent] =
    useState<SiteContent>(initialContent);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(
          `/api/admin/website?t=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (
          data?.content?.EN &&
          data?.content?.RU
        ) {
          setContent(
            data.content as SiteContent
          );
        }
      } catch (error) {
        console.error(
          "Failed to load site content:",
          error
        );
      }
    }

    loadContent();

    const handleUpdate = () => {
      loadContent();
    };

    window.addEventListener(
      "alien-chord-content-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "alien-chord-content-updated",
        handleUpdate
      );
    };
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}