"use client";

import Link from "next/link";
import { releases } from "@/data/releases";
import GlassCard from "@/components/ui/GlassCard";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function Discography() {
  const { language } = useLanguage();

  const isRU = language === "RU";

  if (!releases.length) {
    return null;
  }

  return (
    <section
      id="music"
      className="
        relative
        px-6
        py-32
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >
        {/* HEADER */}

        <div className="mb-14">
          <p
            className="
              font-[var(--font-inter)]
              text-[13px]
              uppercase
              tracking-[0.35em]
              text-cyan-300/60
            "
          >
            {isRU ? "Музыка" : "Music"}
          </p>

          <h2
            className="
              mt-4
              font-[var(--font-syne)]
              text-4xl
              tracking-[0.15em]
              text-[#F4F7FF]
              md:text-5xl
            "
          >
            {isRU ? "Релизы" : "Releases"}
          </h2>
        </div>

        {/* RELEASES */}

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {releases.map((release) => {
            const title = release.title;

            return (
              <Link
                key={release.id}
                href={`/music/${release.id}`}
                className="group"
              >
                <GlassCard>
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={release.cover}
                      alt={title}
                      className="
                        aspect-square
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.03]
                      "
                    />
                  </div>

                  <div className="px-1 pb-1 pt-6">
                    <p
                      className="
                        font-[var(--font-inter)]
                        text-[11px]
                        uppercase
                        tracking-[0.25em]
                        text-cyan-300/50
                      "
                    >
                      {release.type} • {release.releaseDate}
                    </p>

                    <h3
                      className="
                        mt-3
                        font-[var(--font-syne)]
                        text-xl
                        tracking-[0.1em]
                        text-[#F4F7FF]
                        transition-colors
                        duration-300
                        group-hover:text-cyan-200
                      "
                    >
                      {title}
                    </h3>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>

        {/* VIEW ALL */}

        <div className="mt-12">
          <Link
            href="/music"
            className="
              inline-flex
              items-center
              gap-4
              border-b
              border-cyan-300/20
              pb-2
              font-[var(--font-inter)]
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-cyan-300/65
              transition-all
              duration-300
              hover:border-cyan-300/50
              hover:text-cyan-200
            "
          >
            {isRU ? "Смотреть всю музыку" : "View All Music"}

            <span
              className="
                text-base
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
