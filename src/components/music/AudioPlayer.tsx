"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
};

export default function AudioPlayer({
  src,
  title,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const newTime = Number(event.target.value);

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <div
      className="
      mt-8
      w-full
      "
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />

      <div
        className="
        flex
        items-center
        gap-5
        "
      >

        <button
          type="button"
          onClick={togglePlay}
          aria-label={
            isPlaying
              ? `Pause ${title}`
              : `Play ${title}`
          }
          className="
          w-12
          h-12
          shrink-0
          rounded-full
          border
          border-white/10
          bg-white/5
          text-white
          flex
          items-center
          justify-center
          transition-all
          duration-300
          hover:border-white/30
          hover:bg-white/10
          "
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>

        <div className="flex-1">

          <p
            className="
            mb-3
            text-xs
            uppercase
            tracking-[0.2em]
            text-white/60
            "
          >
            {title}
          </p>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="
            w-full
            accent-cyan-300
            cursor-pointer
            "
          />

          <div
            className="
            mt-2
            flex
            justify-between
            text-[10px]
            tracking-[0.15em]
            text-white/30
            "
          >
            <span>{formatTime(currentTime)}</span>

            <span>{formatTime(duration)}</span>
          </div>

        </div>

      </div>
    </div>
  );
}