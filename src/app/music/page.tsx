"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/language/LanguageProvider";

type Release = {
id: string;
title: string;
type: string;
releaseDate: string;
cover: string;
};

export default function MusicPage() {
const { language } = useLanguage();

const [releases, setReleases] = useState<Release[]>([]);
const [loading, setLoading] = useState(true);

const isRU = language === "RU";

useEffect(() => {
async function loadReleases() {
try {
const response = await fetch("/api/admin/releases", {
cache: "no-store",
});

    if (!response.ok) {
      throw new Error("Failed to load releases");
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.releases)) {
      setReleases(data.releases);
    }
  } catch (error) {
    console.error("Failed to load releases:", error);
  } finally {
    setLoading(false);
  }
}

loadReleases();

}, []);

return (
<main className=" min-h-screen bg-[#030308] text-white px-6 pt-28 pb-32 " >
<Navbar />

  <div
    className="
      mx-auto
      max-w-6xl
    "
  >
    {/* HEADER */}

    <div className="mb-16">
      <p
        className="
          mb-4
          font-[var(--font-inter)]
          text-[11px]
          uppercase
          tracking-[0.35em]
          text-cyan-300/65
        "
      >
        ALIEN CHORD
      </p>

      <h1
        className="
          font-[var(--font-syne)]
          text-5xl
          tracking-[0.18em]
          text-[#EAFBFF]
          md:text-6xl
        "
      >
        {isRU ? "МУЗЫКА" : "MUSIC"}
      </h1>

      <div
        className="
          mt-6
          h-px
          w-full
          bg-white/[0.07]
        "
      />
    </div>

    {/* RELEASES */}

    {loading ? (
      <div
        className="
          font-[var(--font-inter)]
          text-[11px]
          uppercase
          tracking-[0.3em]
          text-white/30
        "
      >
        {isRU ? "ЗАГРУЗКА..." : "LOADING..."}
      </div>
    ) : releases.length === 0 ? (
      <div
        className="
          font-[var(--font-inter)]
          text-[11px]
          uppercase
          tracking-[0.3em]
          text-white/30
        "
      >
        {isRU ? "РЕЛИЗОВ ПОКА НЕТ" : "NO RELEASES YET"}
      </div>
    ) : (
      <div
        className="
          grid
          gap-x-8
          gap-y-14
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {releases.map((release) => (
          <Link
            key={release.id}
            href={`/music/${release.id}`}
            className="
              group
              block
            "
          >
            {/* COVER */}

            <div
              className="
                relative
                aspect-square
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.03]
                transition-all
                duration-500
                group-hover:border-cyan-300/30
                group-hover:shadow-[0_0_40px_rgba(103,232,249,0.08)]
              "
            >
              <img
                src={release.cover}
                alt={release.title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.025]
                "
              />

              {/* HOVER OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-end
                  justify-end
                  bg-gradient-to-t
                  from-black/45
                  via-transparent
                  to-transparent
                  p-5
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              >
                <span
                  className="
                    font-[var(--font-inter)]
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-cyan-200
                  "
                >
                  {isRU
                    ? "ОТКРЫТЬ РЕЛИЗ →"
                    : "VIEW RELEASE →"}
                </span>
              </div>

              {/* CYAN EDGE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  border
                  border-cyan-300/0
                  transition-all
                  duration-500
                  group-hover:border-cyan-300/15
                "
              />
            </div>

            {/* INFO */}

            <div
              className="
                mt-5
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div>
                <h2
                  className="
                    font-[var(--font-syne)]
                    text-xl
                    tracking-[0.12em]
                    text-white/90
                    transition-colors
                    duration-300
                    group-hover:text-cyan-100
                  "
                >
                  {release.title}
                </h2>

                <p
                  className="
                    mt-2
                    font-[var(--font-inter)]
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  {isRU
                    ? release.type === "album"
                      ? "Альбом"
                      : "Сингл"
                    : release.type === "album"
                      ? "Album"
                      : "Single"}{" "}
                  • {release.releaseDate}
                </p>
              </div>

              {/* ARROW */}

              <span
                className="
                  pt-1
                  text-[10px]
                  tracking-[0.2em]
                  text-white/20
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-cyan-300/60
                "
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</main>

);
}