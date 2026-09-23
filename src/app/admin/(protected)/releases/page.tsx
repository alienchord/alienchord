"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Release = {
id: string;
title: string;
type: string;
releaseDate: string;
cover: string;
audio: string;
description: {
en: string;
ru: string;
};
tracks: {
title: string;
audio: string;
}[];
links: {
spotify: string;
appleMusic: string;
yandexMusic: string;
youtube: string;
soundcloud: string;
};
};

export default function AdminReleasesPage() {
const [releases, setReleases] = useState<Release[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadReleases() {
try {
const response = await fetch("/api/admin/releases", {
cache: "no-store",
});

    if (!response.ok) {
      throw new Error("Failed to load releases.");
    }

    const data = await response.json();

    const savedReleases: Release[] = Array.isArray(data.releases)
      ? data.releases
      : [];

    setReleases(savedReleases);
  } catch (error) {
    console.error("Failed to load admin releases:", error);
    setReleases([]);
  } finally {
    setLoading(false);
  }
}

loadReleases();

}, []);

return (
<section className="min-h-screen px-6 py-10 md:px-12 md:py-14">
<div className="mx-auto max-w-6xl">
<div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
<div>
<p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/60">
Alien Chord / Admin
</p>

        <h1 className="mt-4 font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
          Releases
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
          Manage music releases, artwork, audio files and streaming links.
        </p>
      </div>

      <Link
        href="/admin/releases/new"
        className="
          inline-flex
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-cyan-300/30
          bg-cyan-300/10
          px-5
          py-3
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-cyan-200
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-cyan-300/60
          hover:bg-cyan-300/15
        "
      >
        + Add Release
      </Link>
    </div>

    <div className="mt-8 flex items-center justify-between">
      <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
        {loading
          ? "Loading releases..."
          : `${releases.length.toString().padStart(2, "0")} releases`}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.8)]" />

        <span className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/50">
          Admin Data
        </span>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {releases.map((release) => (
        <div
          key={release.id}
          className="
            group
            rounded-2xl
            border
            border-white/10
            bg-white/[0.025]
            p-4
            transition-all
            duration-300
            hover:border-white/15
            hover:bg-white/[0.04]
            md:p-5
          "
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
              {release.cover ? (
                <img
                  src={release.cover}
                  alt={release.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.2em] text-white/20">
                  No Cover
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/60">
                  {release.type}
                </span>

                <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  {release.releaseDate}
                </span>
              </div>

              <h2 className="mt-2 truncate font-[var(--font-syne)] text-2xl uppercase tracking-[-0.02em] text-white">
                {release.title}
              </h2>

              <p className="mt-2 truncate font-mono text-[10px] text-white/20">
                {release.id}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/music/${release.id}`}
                target="_blank"
                className="
                  rounded-full
                  border
                  border-white/10
                  px-4
                  py-2.5
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-white/40
                  transition-all
                  duration-300
                  hover:border-white/20
                  hover:text-white
                "
              >
                View
              </Link>

              <Link
                href={`/admin/releases/${release.id}/edit`}
                className="
                  rounded-full
                  border
                  border-cyan-300/20
                  bg-cyan-300/[0.05]
                  px-4
                  py-2.5
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-cyan-300/70
                  transition-all
                  duration-300
                  hover:border-cyan-300/40
                  hover:bg-cyan-300/10
                  hover:text-cyan-200
                "
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    {!loading && releases.length === 0 && (
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
          No releases yet
        </p>

        <Link
          href="/admin/releases/new"
          className="mt-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-cyan-200 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-300/15"
        >
          + Add Release
        </Link>
      </div>
    )}
  </div>
</section>

);
}