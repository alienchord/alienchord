"use client";

import { usePlayer } from "@/components/music/PlayerProvider";

type ReleasePlayerButtonProps = {
  title: string;
  audio?: string;
  cover?: string;
};

export default function ReleasePlayerButton({
  title,
  audio,
  cover,
}: ReleasePlayerButtonProps) {
  const { playTrack } = usePlayer();

  if (!audio) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        playTrack({
          title,
          audio,
          cover,
        })
      }
      className="
      mt-8
      inline-flex
      items-center
      justify-center
      gap-3
      rounded-full
      border
      border-cyan-300/30
      bg-cyan-300/10
      px-7
      py-3.5
      text-xs
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

      Play on Site
    </button>
  );
}