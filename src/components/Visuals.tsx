"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

const fallbackVisualImages = [
  {
    number: "01",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85",
    position: "center",
  },
  {
    number: "02",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
    position: "center",
  },
  {
    number: "03",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1800&q=85",
    position: "center",
  },
];

const fallbackGalleryItems = [
  {
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
    category: "LIVE",
    title: "LIVE / 01",
    size: "large" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=85",
    category: "STAGE",
    title: "LIVE / 02",
    size: "small" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
    category: "MOTION",
    title: "FRAME / 03",
    size: "small" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    category: "IDENTITY",
    title: "FRAME / 04",
    size: "wide" as const,
  },
];

type GalleryItemData = {
  image: string;
  category: string;
  title: string;
  size: "large" | "small" | "wide";
};

type VisualCardData = {
  number: string;
  category: string;
  title: {
    first: string;
    second: string;
    third: string;
  };
  description: string;
  image: string;
  position: string;
  code: string;
};

function VisualCard({ item }: { item: VisualCardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const titleTargetRef = useRef({
    x: 0,
    y: 0,
  });

  const titleCurrentRef = useRef({
    x: 0,
    y: 0,
  });

  const animationFrameRef = useRef<number | null>(null);

  const animateTitle = () => {
    const title = titleRef.current;

    if (!title) {
      animationFrameRef.current = null;
      return;
    }

    const current = titleCurrentRef.current;
    const target = titleTargetRef.current;

    current.x += (target.x - current.x) * 0.055;
    current.y += (target.y - current.y) * 0.055;

    title.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

    const distance =
      Math.abs(target.x - current.x) +
      Math.abs(target.y - current.y);

    if (distance > 0.01) {
      animationFrameRef.current =
        requestAnimationFrame(animateTitle);
    } else {
      current.x = target.x;
      current.y = target.y;

      title.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      animationFrameRef.current = null;
    }
  };

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const image = imageRef.current;
    const glow = glowRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (image) {
      image.style.setProperty(
        "--image-x",
        `${x * 7}px`
      );

      image.style.setProperty(
        "--image-y",
        `${y * 7}px`
      );
    }

    titleTargetRef.current.x = x * 2.5;
    titleTargetRef.current.y = y * 2.5;

    if (animationFrameRef.current === null) {
      animationFrameRef.current =
        requestAnimationFrame(animateTitle);
    }

    if (glow) {
      glow.style.setProperty(
        "--gx",
        `${50 + x * 10}%`
      );

      glow.style.setProperty(
        "--gy",
        `${50 + y * 10}%`
      );
    }
  };

  const handleLeave = () => {
    const image = imageRef.current;
    const glow = glowRef.current;

    if (image) {
      image.style.setProperty(
        "--image-x",
        "0px"
      );

      image.style.setProperty(
        "--image-y",
        "0px"
      );
    }

    titleTargetRef.current.x = 0;
    titleTargetRef.current.y = 0;

    if (animationFrameRef.current === null) {
      animationFrameRef.current =
        requestAnimationFrame(animateTitle);
    }

    if (glow) {
      glow.style.setProperty("--gx", "50%");
      glow.style.setProperty("--gy", "50%");
    }
  };

  return (
    <section className="visuals-panel relative flex min-h-[100svh] w-full items-center justify-center px-5 py-20 md:px-10 md:py-24 lg:px-20 lg:py-28">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="visual-card group relative w-full max-w-[1380px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#07070b] shadow-[0_40px_120px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-[1200ms] ease-out hover:border-cyan-300/[0.16] hover:shadow-[0_50px_150px_rgba(0,0,0,0.55)]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={imageRef}
            src={item.image}
            alt=""
            className="
              visual-image
              absolute
              inset-[-3%]
              h-[106%]
              w-[106%]
              object-cover
              grayscale
              opacity-45
              transition-[transform,filter,opacity]
              duration-[1800ms]
              ease-out
              group-hover:grayscale-0
              group-hover:opacity-60
            "
            style={{
              objectPosition: item.position,
              transform:
                "translate3d(var(--image-x, 0px), var(--image-y, 0px), 0) scale(1.025)",
            }}
          />

          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.38)_42%,rgba(0,0,0,0.82)_100%)]
              transition-opacity
              duration-[1600ms]
              group-hover:opacity-80
            "
          />

          <div
            ref={glowRef}
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-30
              transition-opacity
              duration-[1600ms]
              group-hover:opacity-100
            "
            style={{
              background:
                "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(34,211,238,0.10), transparent 34%)",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.018]
              transition-opacity
              duration-[1400ms]
              group-hover:opacity-[0.04]
            "
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-[2rem]
              border
              border-white/[0.035]
              transition-colors
              duration-[1200ms]
              group-hover:border-cyan-300/[0.14]
            "
          />
        </div>

        <div
          className="
            relative
            z-10
            flex
            min-h-[680px]
            flex-col
            justify-between
            p-7
            md:min-h-[740px]
            md:p-12
            lg:min-h-[780px]
            lg:p-16
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  uppercase
                  tracking-[0.38em]
                  text-white/35
                  transition-colors
                  duration-1000
                  group-hover:text-white/60
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-cyan-300/40
                    transition-all
                    duration-[1200ms]
                    group-hover:w-10
                    group-hover:bg-cyan-200/70
                  "
                />

                {item.number}
              </div>

              <div
                className="
                  mt-4
                  text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-cyan-300/55
                  transition-colors
                  duration-1000
                  group-hover:text-cyan-200/80
                "
              >
                {item.category}
              </div>
            </div>

            <div className="text-right">
              <div
                className="
                  hidden
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-white/20
                  transition-colors
                  duration-1000
                  md:block
                  group-hover:text-white/40
                "
              >
                ALIEN CHORD
                <br />
                VISUAL SYSTEM
              </div>

              <div
                className="
                  mt-3
                  hidden
                  text-[8px]
                  uppercase
                  tracking-[0.25em]
                  text-cyan-300/20
                  md:block
                "
              >
                {item.code}
              </div>
            </div>
          </div>

          <div className="max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
              <div
                className="
                  h-px
                  w-12
                  bg-cyan-300/45
                  transition-all
                  duration-[1400ms]
                  group-hover:w-20
                  group-hover:bg-cyan-200/80
                  group-hover:shadow-[0_0_14px_rgba(0,245,255,0.35)]
                "
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.32em]
                  text-white/15
                  transition-colors
                  duration-1000
                  group-hover:text-white/35
                "
              >
                SIGNAL ACTIVE
              </span>
            </div>

            <h2
              ref={titleRef}
              className="
                visual-title
                font-[var(--font-syne)]
                text-[2.55rem]
                font-medium
                leading-[0.95]
                tracking-[-0.035em]
                text-white
                will-change-transform
                transition-[text-shadow]
                duration-[1200ms]
                ease-out
                md:text-6xl
                lg:text-[5.6rem]
                group-hover:[text-shadow:0_0_50px_rgba(0,245,255,0.08)]
              "
              style={{
                transform:
                  "translate3d(0px, 0px, 0)",
              }}
            >
              {item.title.first}
              <br />
              {item.title.second}
              <br />
              <span className="text-white/70">
                {item.title.third}
              </span>
            </h2>

            <div className="mt-8 flex items-start gap-4">
              <div
                className="
                  mt-2
                  h-7
                  w-px
                  shrink-0
                  bg-cyan-300/25
                  transition-all
                  duration-[1400ms]
                  group-hover:h-10
                  group-hover:bg-cyan-200/50
                "
              />

              <p
                className="
                  max-w-md
                  text-sm
                  leading-7
                  text-white/35
                  transition-colors
                  duration-[1200ms]
                  group-hover:text-white/60
                "
              >
                {item.description}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-end
              justify-between
              gap-6
              border-t
              border-white/[0.05]
              pt-5
              transition-colors
              duration-[1200ms]
              group-hover:border-cyan-300/[0.09]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                text-[9px]
                uppercase
                tracking-[0.28em]
                text-white/20
                transition-colors
                duration-1000
                group-hover:text-white/40
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-cyan-300/55
                  shadow-[0_0_12px_rgba(103,232,249,0.6)]
                  transition-all
                  duration-[1200ms]
                  group-hover:scale-125
                  group-hover:bg-cyan-200
                "
              />

              MOVE / CREATE / BECOME
            </div>

            <div
              className="
                hidden
                text-[9px]
                uppercase
                tracking-[0.28em]
                text-white/15
                transition-colors
                duration-1000
                sm:block
                group-hover:text-white/35
              "
            >
              {item.code}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryItem({
  item,
}: {
  item: GalleryItemData;
}) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-[1.25rem]
        border
        border-white/[0.07]
        bg-[#08080c]
        ${
          item.size === "large"
            ? "md:row-span-2"
            : item.size === "wide"
              ? "md:col-span-2"
              : ""
        }
      `}
    >
      <div
        className="
          relative
          h-full
          min-h-[260px]
          overflow-hidden
          md:min-h-[320px]
        "
      >
        <img
          src={item.image}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            grayscale
            opacity-55
            transition-[transform,filter,opacity]
            duration-[1600ms]
            ease-out
            group-hover:scale-[1.035]
            group-hover:grayscale-0
            group-hover:opacity-75
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/15
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-[1200ms]
            group-hover:opacity-100
          "
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.08), transparent 45%)",
          }}
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            flex
            items-end
            justify-between
            p-5
            md:p-6
          "
        >
          <div>
            <div
              className="
                text-[8px]
                uppercase
                tracking-[0.35em]
                text-cyan-300/55
                transition-colors
                duration-700
                group-hover:text-cyan-200/80
              "
            >
              {item.category}
            </div>

            <div
              className="
                mt-2
                font-[var(--font-syne)]
                text-sm
                tracking-[-0.01em]
                text-white/75
                transition-colors
                duration-700
                group-hover:text-white
              "
            >
              {item.title}
            </div>
          </div>

          <span
            className="
              text-[9px]
              text-white/20
              transition-colors
              duration-700
              group-hover:text-white/50
            "
          >
            ↗
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Visuals() {
  const { language } = useLanguage();
  const content = useSiteContent();

  const fallbackVisuals = {
    label:
      language === "RU"
        ? "ALIEN CHORD / ВИЗУАЛ"
        : "ALIEN CHORD / VISUALS",

    heroTitle: {
      first: language === "RU" ? "ЗВУК" : "SOUND",
      second: language === "RU" ? "СТАНОВИТСЯ" : "BECOMES",
      third: language === "RU" ? "СИГНАЛОМ." : "SIGNAL.",
    },

    heroDescription:
      language === "RU"
        ? "Визуальная система, построенная на движении, создании и решении действовать."
        : "A visual system built around movement, creation and the decision to act.",

    experiences:
      language === "RU"
        ? "03 ЭКСПЕРИМЕНТА"
        : "03 EXPERIENCES",

    language:
      language === "RU"
        ? "ВИЗУАЛЬНЫЙ ЯЗЫК / 01"
        : "VISUAL LANGUAGE / 01",

    categories:
      language === "RU"
        ? "ДВИЖЕНИЕ / АЙДЕНТИКА / СОЗДАНИЕ"
        : "MOTION / IDENTITY / CREATION",

    signalActive:
      language === "RU"
        ? "СИГНАЛ АКТИВЕН"
        : "SIGNAL ACTIVE",

    visualSystem: "ALIEN CHORD / VISUAL SYSTEM",

    bottom:
      language === "RU"
        ? "ДВИГАЙСЯ / СОЗДАВАЙ / СТАНОВИСЬ"
        : "MOVE / CREATE / BECOME",

    galleryLabel:
      language === "RU"
        ? "ВИЗУАЛЬНЫЙ АРХИВ"
        : "VISUAL ARCHIVE",

    galleryTitle:
      language === "RU"
        ? "ГАЛЕРЕЯ"
        : "GALLERY",

    galleryDescription:
      language === "RU"
        ? "Кадры из мира Alien Chord."
        : "Frames from the world around Alien Chord.",

    gallery:
      language === "RU"
        ? "ГАЛЕРЕЯ"
        : "GALLERY",

    liveSoon:
      language === "RU"
        ? "LIVE / СКОРО"
        : "LIVE / SOON",

    motionSoon:
      language === "RU"
        ? "MOTION / СКОРО"
        : "MOTION / SOON",

    btsSoon:
      language === "RU"
        ? "BTS / СКОРО"
        : "BTS / SOON",

    end:
      language === "RU"
        ? "МУЗЫКА / ДВИЖЕНИЕ / УНИКАЛЬНОСТЬ"
        : "MUSIC / MOTION / IDENTITY",

    cards: {
      one: {
        category:
          language === "RU"
            ? "АЙДЕНТИКА"
            : "IDENTITY",

        title: {
          first:
            language === "RU"
              ? "НЕ ЖДИ"
              : "DON'T WAIT FOR",

          second:
            language === "RU"
              ? "СИГНАЛ."
              : "THE SIGNAL.",

          third:
            language === "RU"
              ? "СТАНЬ ИМ."
              : "BECOME IT.",
        },

        description:
          language === "RU"
            ? "Идентичность — это не статичный образ. Это сигнал в движении."
            : "Identity is not a static image. It is a signal in motion.",

        code: "AC / ID-01",
      },

      two: {
        category:
          language === "RU"
            ? "ДВИЖЕНИЕ"
            : "MOTION",

        title: {
          first:
            language === "RU"
              ? "ДВИГАЙСЯ ДО"
              : "MOVE BEFORE",

          second:
            language === "RU"
              ? "ТОГО, КАК"
              : "YOU FEEL",

          third:
            language === "RU"
              ? "БУДЕШЬ ГОТОВ."
              : "READY.",
        },

        description:
          language === "RU"
            ? "Движение начинается раньше уверенности. Оно создаёт направление."
            : "Momentum begins before certainty. Movement creates direction.",

        code: "AC / MT-02",
      },

      three: {
        category:
          language === "RU"
            ? "СОЗДАНИЕ"
            : "CREATION",

        title: {
          first:
            language === "RU"
              ? "СОЗДАЙ ТО,"
              : "MAKE SOMETHING",

          second:
            language === "RU"
              ? "ЧЕГО НЕ БЫЛО"
              : "THAT DIDN'T EXIST",

          third:
            language === "RU"
              ? "ВЧЕРА."
              : "YESTERDAY.",
        },

        description:
          language === "RU"
            ? "Создавай без разрешения. Оставляй след там, где его ещё не было."
            : "Create without permission. Leave a trace that wasn't there before.",

        code: "AC / CR-03",
      },
    },
  };

  const savedVisuals =
    content?.[language]?.visuals;

  const visuals = {
    ...fallbackVisuals,
    ...(savedVisuals ?? {}),

    heroTitle: {
      ...fallbackVisuals.heroTitle,
      ...(savedVisuals?.heroTitle ?? {}),
    },

    cards: {
      ...fallbackVisuals.cards,
      ...(savedVisuals?.cards ?? {}),

      one: {
        ...fallbackVisuals.cards.one,
        ...(savedVisuals?.cards?.one ?? {}),
        title: {
          ...fallbackVisuals.cards.one.title,
          ...(savedVisuals?.cards?.one?.title ?? {}),
        },
      },

      two: {
        ...fallbackVisuals.cards.two,
        ...(savedVisuals?.cards?.two ?? {}),
        title: {
          ...fallbackVisuals.cards.two.title,
          ...(savedVisuals?.cards?.two?.title ?? {}),
        },
      },

      three: {
        ...fallbackVisuals.cards.three,
        ...(savedVisuals?.cards?.three ?? {}),
        title: {
          ...fallbackVisuals.cards.three.title,
          ...(savedVisuals?.cards?.three?.title ?? {}),
        },
      },
    },
  };

  const cards = [
    {
      ...visuals.cards.one,
      number: "01",
      image:
        visuals.cards.one.image ||
        fallbackVisualImages[0].image,
      position:
        visuals.cards.one.position ||
        fallbackVisualImages[0].position,
    },
    {
      ...visuals.cards.two,
      number: "02",
      image:
        visuals.cards.two.image ||
        fallbackVisualImages[1].image,
      position:
        visuals.cards.two.position ||
        fallbackVisualImages[1].position,
    },
    {
      ...visuals.cards.three,
      number: "03",
      image:
        visuals.cards.three.image ||
        fallbackVisualImages[2].image,
      position:
        visuals.cards.three.position ||
        fallbackVisualImages[2].position,
    },
  ];

  const galleryItems: GalleryItemData[] =
    savedVisuals?.galleryItems &&
    savedVisuals.galleryItems.length > 0
      ? savedVisuals.galleryItems
      : fallbackGalleryItems;

  return (
    <main className="min-h-screen overflow-hidden bg-[#030308] text-white">
      <section className="relative flex min-h-[82svh] items-end overflow-hidden px-6 pb-20 md:px-12 md:pb-24 lg:px-20 lg:pb-28">
        <div className="pointer-events-none absolute left-1/2 top-[30%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-[150px]" />

        <div
          className="
            pointer-events-none
            absolute
            right-[-10%]
            top-[15%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-blue-500/[0.02]
            blur-[130px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.016]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />

        <div className="relative z-10 w-full">
          <div
            className="
              mb-7
              flex
              items-center
              gap-4
              text-[10px]
              uppercase
              tracking-[0.45em]
              text-cyan-300/60
            "
          >
            <span className="h-px w-8 bg-cyan-300/45" />
            {visuals.label}
          </div>

          <h1
            className="
              max-w-6xl
              font-[var(--font-syne)]
              text-6xl
              font-medium
              leading-[0.9]
              tracking-[-0.045em]
              text-white
              md:text-8xl
              lg:text-[9rem]
            "
          >
            {visuals.heroTitle.first}
            <br />
            {visuals.heroTitle.second}
            <br />

            <span
              className="
                text-white/[0.22]
                transition-colors
                duration-[1200ms]
                hover:text-cyan-300/40
              "
            >
              {visuals.heroTitle.third}
            </span>
          </h1>

          <div
            className="
              mt-10
              flex
              max-w-xl
              items-start
              gap-5
            "
          >
            <div className="mt-2 h-px w-10 shrink-0 bg-cyan-300/55" />

            <p
              className="
                text-sm
                leading-7
                text-white/40
              "
            >
              {visuals.heroDescription}
            </p>
          </div>

          <div
            className="
              mt-16
              flex
              items-center
              gap-8
              text-[8px]
              uppercase
              tracking-[0.3em]
              text-white/20
            "
          >
            <span>{visuals.experiences}</span>

            <span className="h-px w-8 bg-white/10" />

            <span>{visuals.language}</span>

            <span className="hidden md:inline">
              {visuals.categories}
            </span>
          </div>
        </div>
      </section>

      {cards.map((item) => (
        <VisualCard
          key={item.number}
          item={item}
        />
      ))}

      <section
        className="
          relative
          px-5
          py-24
          md:px-10
          md:py-32
          lg:px-20
        "
      >
        <div className="mx-auto max-w-[1380px]">
          <div
            className="
              mb-12
              flex
              flex-col
              gap-8
              md:mb-16
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-4
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-cyan-300/55
                "
              >
                <span className="h-px w-8 bg-cyan-300/45" />
                {visuals.galleryLabel}
              </div>

              <h2
                className="
                  font-[var(--font-syne)]
                  text-5xl
                  font-medium
                  leading-[0.95]
                  tracking-[-0.035em]
                  md:text-7xl
                  lg:text-[6.5rem]
                "
              >
                {visuals.galleryTitle}
              </h2>
            </div>

            <div
              className="
                max-w-sm
                text-sm
                leading-7
                text-white/30
                md:text-right
              "
            >
              {visuals.galleryDescription}
            </div>
          </div>

          <div
            className="
              grid
              auto-rows-[260px]
              grid-cols-1
              gap-4
              md:auto-rows-[320px]
              md:grid-cols-2
              lg:gap-5
            "
          >
            {galleryItems.map((item, index) => (
              <GalleryItem
                key={`${item.title}-${index}`}
                item={item}
              />
            ))}
          </div>

          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-x-8
              gap-y-3
              border-t
              border-white/[0.06]
              pt-6
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-cyan-300/55
              "
            >
              {visuals.gallery}
            </span>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/20
              "
            >
              {visuals.liveSoon}
            </span>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/20
              "
            >
              {visuals.motionSoon}
            </span>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/20
              "
            >
              {visuals.btsSoon}
            </span>
          </div>
        </div>
      </section>

      <section
        className="
          relative
          flex
          min-h-[45svh]
          items-center
          justify-center
          overflow-hidden
          px-6
          py-24
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[380px]
            w-[380px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-400/[0.035]
            blur-[140px]
          "
        />

        <div className="relative z-10 text-center">
          <div
            className="
              mb-7
              text-[9px]
              uppercase
              tracking-[0.4em]
              text-white/20
            "
          >
            ALIEN CHORD
          </div>

          <div
            className="
              mx-auto
              h-px
              w-16
              bg-cyan-300/35
            "
          />

          <p
            className="
              mt-7
              font-[var(--font-syne)]
              text-xl
              tracking-[-0.01em]
              text-white/35
              md:text-2xl
            "
          >
            {visuals.end}
          </p>
        </div>
      </section>
    </main>
  );
}