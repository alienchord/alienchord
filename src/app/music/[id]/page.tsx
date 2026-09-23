export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import GlassCard from "@/components/ui/GlassCard";
import PlatformButton from "@/components/ui/PlatformButton";
import Link from "next/link";
import ReleasePlayerButton from "@/components/music/ReleasePlayerButton";
import ReleaseLanguageContent from "@/components/music/ReleaseLanguageContent";
import ReleaseTrackList from "@/components/music/ReleaseTrackList";
import { getReleaseById } from "@/lib/releases";

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const release = await getReleaseById(id);

  if (!release) {
    return (
      <main
        className="
          min-h-screen
          bg-[#030308]
          px-6
          py-32
          text-white
        "
      >
        <div className="mx-auto max-w-5xl">
          <Link
            href="/music"
            className="
              inline-flex
              items-center
              gap-3
              text-xs
              uppercase
              tracking-[0.3em]
              text-white/50
              transition-all
              duration-300
              hover:text-cyan-300
            "
          >
            <span className="text-base">←</span>

            <ReleaseLanguageContent
              en="ALL MUSIC"
              ru="ВСЯ МУЗЫКА"
            />
          </Link>

          <h1
            className="
              mt-12
              font-[var(--font-syne)]
              text-4xl
            "
          >
            <ReleaseLanguageContent
              en="Release not found"
              ru="Релиз не найден"
            />
          </h1>
        </div>
      </main>
    );
  }

  const mainTrack = release.tracks?.[0];

  return (
    <main
      className="
        min-h-screen
        bg-[#030308]
        px-6
        pt-28
        pb-32
        text-white
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          href="/music"
          className="
            group
            mb-10
            inline-flex
            items-center
            gap-3
            text-xs
            uppercase
            tracking-[0.3em]
            text-white/50
            transition-all
            duration-300
            hover:text-white
          "
        >
          <span
            className="
              text-base
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          >
            ←
          </span>

          <ReleaseLanguageContent
            en="ALL MUSIC"
            ru="ВСЯ МУЗЫКА"
          />
        </Link>

        {/* RELEASE */}

        <div
          className="
            grid
            items-start
            gap-12
            md:grid-cols-[1.05fr_0.95fr]
            md:gap-14
          "
        >

          {/* COVER */}

          <div className="flex w-full justify-center">
            <GlassCard>
              <div
                className="
                  aspect-square
                  w-full
                  max-w-[520px]
                  overflow-hidden
                  rounded-2xl
                "
              >
                {release.cover ? (
                  <img
                    src={release.cover}
                    alt={release.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      hover:scale-[1.015]
                    "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-[10px] uppercase tracking-[0.3em] text-white/20">
                    No Cover
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* INFORMATION */}

          <div className="flex flex-col justify-between">

            {/* TOP */}

            <div>

              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                "
              >
                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.32em]
                    text-cyan-300/75
                  "
                >
                  <ReleaseLanguageContent
                    en="OUT NOW"
                    ru="УЖЕ ВЫШЕЛ"
                  />
                </span>

                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-white/20
                  "
                />

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-white/35
                  "
                >
                  {release.type} • {release.releaseDate}
                </span>
              </div>

              {/* TITLE */}

              <h1
                className="
                  mt-5
                  font-[var(--font-syne)]
                  text-4xl
                  leading-[1.05]
                  tracking-[0.08em]
                  text-[#EAFBFF]
                  md:text-[3.2rem]
                "
              >
                {release.title}
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-lg
                  text-sm
                  leading-7
                  text-white/45
                "
              >
                <ReleaseLanguageContent
                  description={release.description}
                />
              </p>

              {/* PLAYER */}

              {mainTrack?.audio && (
                <div className="mt-7">
                  <ReleasePlayerButton
                    title={
                      mainTrack.title || release.title
                    }
                    audio={mainTrack.audio}
                    cover={release.cover}
                  />
                </div>
              )}

            </div>

            {/* BOTTOM */}

            <div>

              {/* TRACKLIST */}

              <div
                className="
                  mt-10
                  border-t
                  border-white/[0.07]
                  pt-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <h2
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.32em]
                      text-white/30
                    "
                  >
                    <ReleaseLanguageContent
                      en="TRACKLIST"
                      ru="ТРЕКЛИСТ"
                    />
                  </h2>

                  <span
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    {release.tracks.length
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>

                <ReleaseTrackList
                  tracks={release.tracks}
                  cover={release.cover}
                />
              </div>

              {/* PLATFORMS */}

              <div
                className="
                  mt-6
                  border-t
                  border-white/[0.07]
                  pt-5
                "
              >
                <h2
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.32em]
                    text-white/30
                  "
                >
                  <ReleaseLanguageContent
                    en="LISTEN NOW"
                    ru="СЛУШАТЬ"
                  />
                </h2>

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  {release.links.spotify && (
                    <PlatformButton
                      name="Spotify"
                      href={release.links.spotify}
                    />
                  )}

                  {release.links.appleMusic && (
                    <PlatformButton
                      name="Apple Music"
                      href={release.links.appleMusic}
                    />
                  )}

                  {release.links.yandexMusic && (
                    <PlatformButton
                      name="Yandex Music"
                      href={release.links.yandexMusic}
                    />
                  )}

                  {release.links.youtube && (
                    <PlatformButton
                      name="YouTube"
                      href={release.links.youtube}
                    />
                  )}

                  {release.links.soundcloud && (
                    <PlatformButton
                      name="SoundCloud"
                      href={release.links.soundcloud}
                    />
                  )}
                </div>
              </div>

              {/* BACK TO MUSIC */}

              <Link
                href="/music"
                className="
                  group
                  mt-7
                  inline-flex
                  w-full
                  items-center
                  justify-between
                  border-t
                  border-white/10
                  pt-5
                "
              >
                <span
                  className="
                    text-[12px]
                    uppercase
                    tracking-[0.25em]
                    text-cyan-300/65
                    transition-colors
                    duration-300
                    group-hover:text-cyan-200
                  "
                >
                  <ReleaseLanguageContent
                    en="ALL MUSIC"
                    ru="ВСЯ МУЗЫКА"
                  />
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
      </div>
    </main>
  );
}