export type LocalizedText = {
  en: string;
  ru: string;
};

export type ReleaseTrack = {
  title: string;
  audio?: string;
};

export type Release = {
  id: string;

  title: string;

  type: string;

  releaseDate: string;

  cover: string;

  audio?: string;

  description: LocalizedText;

  tracks: {
    title: string;
    audio: string;
  }[];

  links: {
    spotify?: string;
    appleMusic?: string;
    yandexMusic?: string;
    youtube?: string;
    soundcloud?: string;
  };
};