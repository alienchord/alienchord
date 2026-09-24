import type { Release } from "@/types/release";

export const releases: Release[] = [
  {
    id: "My-Remedy",

    title: "My Remedy",

    type: "single",

    releaseDate: "January 2023",

    cover:
      "https://uevvudtqmboijprbohfd.supabase.co/storage/v1/object/public/media/covers/37720317eebdfb0d5deb8f0235414fb4-1790186649609.jpg",

    audio:
      "https://uevvudtqmboijprbohfd.supabase.co/storage/v1/object/public/media/audio/alien-chord-my-remedy-1790186721959.wav",

    description: {
      en: "A heartfelt electronic release blending emotional atmosphere with modern energy.",

      ru: "Эмоциональный электронный релиз, объединяющий атмосферу, энергию и современное звучание.",
    },

    tracks: [
      {
        title: "My Remedy",
        audio:
          "https://uevvudtqmboijprbohfd.supabase.co/storage/v1/object/public/media/audio/alien-chord-my-remedy-1790186721959.wav",
      },
    ],

    links: {
      spotify:
        "https://open.spotify.com/track/1xcRQGiuncpVzJrsWQ6X0X?si=549ccdd1a34d47a2",

      appleMusic:
        "https://music.apple.com/us/album/my-remedy-single/1662256805",

      youtube:
        "https://youtu.be/CpEBFM25YLY?si=uMsBsE8_A5mBD95j",

      yandexMusic:
        "https://music.yandex.ru/album/24515899?utm_source=web&utm_medium=copy_link",

      soundcloud: "",
    },
  },
];