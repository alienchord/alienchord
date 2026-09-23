"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type Track = {
  title: string;
  audio: string;
  cover?: string;
};

type GlobalPlayerProps = {
  track: Track | null;
  autoPlay?: boolean;
};

export default function GlobalPlayer({
  track,
  autoPlay = false,
}: GlobalPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !track) {
      return;
    }

    audio.src = track.audio;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audio.removeEventListener(
        "durationchange",
        handleDurationChange
      );
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !track || !autoPlay) {
      return;
    }

    const playAudio = async () => {
      try {
        await audio.play();
      } catch {
        // Browser may block autoplay.
      }
    };

    playAudio();
  }, [track, autoPlay]);

  function togglePlay() {
    const audio = audioRef.current;

    if (!audio || !track) {
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function handleSeek(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const value = Number(event.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  }

  function formatTime(time: number) {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  if (!track) {
    return null;
  }

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#050505]/95 backdrop-blur-xl">
      <audio ref={audioRef} />

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 md:px-8">

        {track.cover && (
          <img
            src={track.cover}
            alt={track.title}
            className="h-10 w-10 shrink-0 rounded-md object-cover"
          />
        )}

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-cyan-300/60 hover:text-cyan-300"
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>

        <div className="min-w-0 flex-1">

          <div className="mb-1 flex items-center justify-between gap-4">
            <p className="truncate text-[11px] uppercase tracking-[0.15em] text-white/80">
              {track.title}
            </p>

            <span className="shrink-0 text-[10px] text-white/30">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="relative h-5 flex items-center">

            <div className="absolute left-0 right-0 h-[2px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-cyan-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!duration}
              aria-label="Track progress"
              className="
                absolute
                left-0
                top-1/2
                z-10
                h-5
                w-full
                -translate-y-1/2
                cursor-pointer
                appearance-none
                bg-transparent
                accent-cyan-300
                disabled:cursor-default
              "
            />

          </div>

        </div>

      </div>
    </div>
  );
}