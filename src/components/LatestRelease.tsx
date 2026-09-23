
"use client";

import Link from "next/link";
import { releases } from "@/data/releases";
import GlassCard from "@/components/ui/GlassCard";
import { usePlayer } from "@/components/music/PlayerProvider";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

export default function LatestRelease() {
  const latestRelease = releases[0];

  const { playTrack } = usePlayer();
  const { language } = useLanguage();
  const content = useSiteContent();
const t = content[language].latestRelease;

  const isRU = language === "RU";

  if (!latestRelease) {
    return null;
  }

  const handlePlay = () => {
    if (!latestRelease.audio) {
      return;
    }

    playTrack({
      title: latestRelease.title,
      audio: latestRelease.audio,
      cover: latestRelease.cover,
    });
  };

  const description = isRU
    ? latestRelease.description.ru
    : latestRelease.description.en;

  return (
    <section
      id="latest-release"
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        px-6
        py-20
        md:px-6
        md:py-32
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
        "
      >
        {/* SECTION HEADER */}

        <div className="mb-9 text-center md:mb-14">
          <p
            className="
              font-[var(--font-inter)]
              text-[11px]
              uppercase
              tracking-[0.35em]
              text-cyan-300/60
            "
          >
           {t.label}
          </p>

          <h2
            className="
              mt-3
              font-[var(--font-syne)]
              text-3xl
              tracking-[0.16em]
              text-[#F4F7FF]
              md:mt-4
              md:text-5xl
              md:tracking-[0.2em]
            "
          >
            {latestRelease.title}
          </h2>
        </div>

        {/* RELEASE */}

        <div
          className="
            grid
            items-center
            gap-8
            md:grid-cols-2
            md:gap-12
          "
        >
          {/* COVER */}

          <GlassCard>
            <Link
              href={`/music/${latestRelease.id}`}
              className="
                group
                block
              "
            >
              <div
                className="
                  aspect-square
                  overflow-hidden
                  rounded-2xl
                "
              >
                <img
                  src={latestRelease.cover}
                  alt={latestRelease.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-[1.03]
                  "
                />
              </div>
            </Link>
          </GlassCard>

          {/* INFORMATION */}

          <div
            className="
              flex
              flex-col
              justify-center
              py-0
              md:min-h-full
              md:py-2
            "
          >
            {/* META */}

            <p
              className="
                font-[var(--font-inter)]
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-cyan-300/60
              "
            >
              {isRU ? "Сингл" : "Single"}{" "}
              • {latestRelease.releaseDate}
            </p>

            {/* TITLE */}

            <h3
              className="
                mt-3
                font-[var(--font-syne)]
                text-2xl
                tracking-[0.1em]
                text-[#F4F7FF]
                md:mt-4
                md:text-4xl
                md:tracking-[0.12em]
              "
            >
              {latestRelease.title}
            </h3>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-md
                font-[var(--font-inter)]
                text-base
                leading-7
                text-white/45
                md:mt-7
                md:leading-8
              "
            >
              {description}
            </p>

            {/* PLAY */}

            <div className="mt-6 md:mt-8">
              <button
                type="button"
                onClick={handlePlay}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  border
                  border-cyan-300/30
                  bg-cyan-300/10
                  px-7
                  py-3
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-cyan-200
                  transition-all
                  duration-300
                  hover:border-cyan-300/50
                  hover:bg-cyan-300/15
                  hover:text-white
                "
              >
                <span className="text-sm">
                  ▶
                </span>

                {t.play}
              </button>
            </div>

            {/* PLATFORMS */}

            <div
              className="
                mt-6
                grid
                max-w-md
                grid-cols-2
                gap-2
                md:mt-7
                md:gap-2.5
              "
            >
              {latestRelease.links.spotify && (
                <a
                  href={latestRelease.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    px-4
                    py-2
                    text-[11px]
                    uppercase
                    tracking-[0.16em]
                    text-white/45
                    transition-all
                    duration-300
                    hover:border-cyan-300/35
                    hover:text-cyan-200
                  "
                >
                  Spotify
                </a>
              )}

              {latestRelease.links.appleMusic && (
                <a
                  href={latestRelease.links.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    px-4
                    py-2
                    text-[11px]
                    uppercase
                    tracking-[0.16em]
                    text-white/45
                    transition-all
                    duration-300
                    hover:border-cyan-300/35
                    hover:text-cyan-200
                  "
                >
                  Apple Music
                </a>
              )}

              {latestRelease.links.yandexMusic && (
                <a
                  href={latestRelease.links.yandexMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    px-4
                    py-2
                    text-[11px]
                    uppercase
                    tracking-[0.16em]
                    text-white/45
                    transition-all
                    duration-300
                    hover:border-cyan-300/35
                    hover:text-cyan-200
                  "
                >
                  Yandex Music
                </a>
              )}

              {latestRelease.links.youtube && (
                <a
                  href={latestRelease.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    px-4
                    py-2
                    text-[11px]
                    uppercase
                    tracking-[0.16em]
                    text-white/45
                    transition-all
                    duration-300
                    hover:border-cyan-300/35
                    hover:text-cyan-200
                  "
                >
                  YouTube
                </a>
              )}
            </div>

            {/* VIEW ALL MUSIC */}

            <Link
              href="/music"
              className="
                group
                mt-6
                inline-flex
                w-full
                max-w-md
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
                md:mt-7
                md:pt-5
              "
            >
              <span
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-cyan-300/65
                  transition-colors
                  duration-300
                  group-hover:text-cyan-200
                "
              >
                {t.viewAll}
              </span>

              <span
                className="
                  text-lg
                  text-cyan-300/50
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-cyan-200
                "
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

