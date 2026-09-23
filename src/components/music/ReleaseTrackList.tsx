"use client";

import { usePlayer } from "@/components/music/PlayerProvider";

type Track = {
  title: string;
  audio: string;
};

type ReleaseTrackListProps = {
  tracks: Track[];
  cover?: string;
};

export default function ReleaseTrackList({
  tracks,
  cover,
}: ReleaseTrackListProps) {
  const { playTrack, currentTrack } = usePlayer();

  return (
    <div className="mt-4 space-y-2">
      {tracks.map((track, index) => {
        const isActive =
          currentTrack?.audio === track.audio;

        return (
          <button
            key={`${track.title}-${index}`}
            type="button"
            disabled={!track.audio}
            onClick={() => {
              if (!track.audio) return;

              playTrack({
                title: track.title,
                audio: track.audio,
                cover,
              });
            }}
            className={`
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              transition-all
              duration-300
              ${
                isActive
                  ? "bg-cyan-300/10 text-cyan-200"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }
              ${
                !track.audio
                  ? "cursor-default opacity-40"
                  : "cursor-pointer"
              }
            `}
          >
            <span className="w-8 shrink-0 text-xs text-white/30">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="flex-1">
              {track.title}
            </span>

            {isActive && (
              <span className="text-xs text-cyan-300">
                ▶
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}