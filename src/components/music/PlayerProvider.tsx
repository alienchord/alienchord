"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import GlobalPlayer from "./GlobalPlayer";

type Track = {
  title: string;
  audio: string;
  cover?: string;
};

type PlayerContextType = {
  playTrack: (track: Track) => void;
  currentTrack: Track | null;
};

const PlayerContext =
  createContext<PlayerContextType | null>(null);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentTrack, setCurrentTrack] =
    useState<Track | null>(null);

  const [autoPlay, setAutoPlay] = useState(false);

  const playTrack = (track: Track) => {
    setAutoPlay(true);
    setCurrentTrack(track);
  };

  return (
    <PlayerContext.Provider
      value={{
        playTrack,
        currentTrack,
      }}
    >
      {children}

      <GlobalPlayer
        track={currentTrack}
        autoPlay={autoPlay}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider"
    );
  }

  return context;
}