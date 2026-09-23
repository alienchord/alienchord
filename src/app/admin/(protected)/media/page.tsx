"use client";

import { useEffect, useState } from "react";

type VisualCard = {
  category: string;
  title: {
    first: string;
    second: string;
    third: string;
  };
  description: string;
  code: string;
  image?: string;
  position?: string;
};

type GalleryItem = {
  image: string;
  category: string;
  title: string;
  size: "large" | "small" | "wide";
};

type VisualsContent = {
  label: string;
  heroTitle: {
    first: string;
    second: string;
    third: string;
  };
  heroDescription: string;
  experiences: string;
  language: string;
  categories: string;
  signalActive: string;
  visualSystem: string;
  bottom: string;
  galleryLabel: string;
  galleryTitle: string;
  galleryDescription: string;
  gallery: string;
  liveSoon: string;
  motionSoon: string;
  btsSoon: string;
  end: string;
  cards: {
    one: VisualCard;
    two: VisualCard;
    three: VisualCard;
  };
  galleryItems?: GalleryItem[];
};

type SiteContent = {
  EN: {
    visuals: VisualsContent;
  };
  RU: {
    visuals: VisualsContent;
  };
};

const emptyGalleryItem: GalleryItem = {
  image: "",
  category: "LIVE",
  title: "LIVE / 01",
  size: "small",
};

export default function VisualsAdminPage() {
  const [content, setContent] =
    useState<SiteContent | null>(null);

  const [language, setLanguage] =
    useState<"EN" | "RU">("EN");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/website",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error ||
            "Failed to load website content."
        );
        return;
      }

      setContent(data.content);
    } catch {
      setError(
        "Failed to load website content."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveContent() {
    if (!content) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/website",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error ||
            "Failed to save visuals."
        );
        return;
      }

      setContent(data.content);
      setMessage(
        "Visuals saved successfully."
      );
    } catch {
      setError(
        "Failed to save visuals."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    callback: (path: string) => void
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", "cover");

      const response = await fetch(
        "/api/admin/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error ||
            "Image upload failed."
        );
        return;
      }

      callback(data.path);

      setMessage(
        "Image uploaded. Don't forget to save."
      );
    } catch {
      setError(
        "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  function updateVisuals(
    updater: (
      visuals: VisualsContent
    ) => VisualsContent
  ) {
    if (!content) return;

    setContent({
      ...content,
      [language]: {
        ...content[language],
        visuals: updater(
          content[language].visuals
        ),
      },
    });
  }

  function updateCard(
    cardKey: "one" | "two" | "three",
    field: keyof VisualCard,
    value: string
  ) {
    updateVisuals((visuals) => ({
      ...visuals,
      cards: {
        ...visuals.cards,
        [cardKey]: {
          ...visuals.cards[cardKey],
          [field]: value,
        },
      },
    }));
  }

  function updateCardTitle(
    cardKey: "one" | "two" | "three",
    field: "first" | "second" | "third",
    value: string
  ) {
    updateVisuals((visuals) => ({
      ...visuals,
      cards: {
        ...visuals.cards,
        [cardKey]: {
          ...visuals.cards[cardKey],
          title: {
            ...visuals.cards[cardKey].title,
            [field]: value,
          },
        },
      },
    }));
  }

  function updateGalleryItem(
    index: number,
    field: keyof GalleryItem,
    value: string
  ) {
    updateVisuals((visuals) => {
      const galleryItems =
        visuals.galleryItems || [];

      return {
        ...visuals,
        galleryItems:
          galleryItems.map(
            (item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    [field]: value,
                  }
                : item
          ),
      };
    });
  }

  function addGalleryItem() {
    updateVisuals((visuals) => ({
      ...visuals,
      galleryItems: [
        ...(visuals.galleryItems || []),
        {
          ...emptyGalleryItem,
          title: `LIVE / ${
            (visuals.galleryItems?.length || 0) +
            1
          }`,
        },
      ],
    }));
  }

  function removeGalleryItem(
    index: number
  ) {
    updateVisuals((visuals) => ({
      ...visuals,
      galleryItems: (
        visuals.galleryItems || []
      ).filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  }

  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-white/30">
            Loading visuals...
          </p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-red-300">
            {error ||
              "Visuals content unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const visuals =
    content[language].visuals;

  return (
    <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300">
              Alien Chord
            </p>

            <h1 className="font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
              Visuals
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage the visual cards and gallery
              shown on the public website.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setLanguage("EN")
              }
              className={`rounded-lg border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                language === "EN"
                  ? "border-cyan-400/40 text-cyan-300"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() =>
                setLanguage("RU")
              }
              className={`rounded-lg border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                language === "RU"
                  ? "border-cyan-400/40 text-cyan-300"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="rounded-lg border border-cyan-400/40 bg-cyan-400/[0.06] px-5 py-2 text-[10px] uppercase tracking-[0.15em] text-cyan-300 transition hover:bg-cyan-400/[0.12] disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-xs text-cyan-300/80">
            {message}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              Visual Header
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {(
              [
                "first",
                "second",
                "third",
              ] as const
            ).map((field) => (
              <label key={field}>
                <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                  {field}
                </span>

                <input
                  value={
                    visuals.heroTitle[field]
                  }
                  onChange={(event) =>
                    updateVisuals(
                      (current) => ({
                        ...current,
                        heroTitle: {
                          ...current.heroTitle,
                          [field]:
                            event.target.value,
                        },
                      })
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
              Description
            </span>

            <textarea
              value={
                visuals.heroDescription
              }
              onChange={(event) =>
                updateVisuals(
                  (current) => ({
                    ...current,
                    heroDescription:
                      event.target.value,
                  })
                )
              }
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              Main Visual Cards
            </p>

            <p className="mt-2 text-xs text-white/30">
              Three main visuals displayed on the
              public Visuals page.
            </p>
          </div>

          {(
            [
              ["one", "01"],
              ["two", "02"],
              ["three", "03"],
            ] as const
          ).map(([cardKey, number]) => {
            const card =
              visuals.cards[cardKey];

            return (
              <div
                key={cardKey}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Visual / {number}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label>
                      <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                        Category
                      </span>

                      <input
                        value={card.category}
                        onChange={(event) =>
                          updateCard(
                            cardKey,
                            "category",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                        Description
                      </span>

                      <textarea
                        value={
                          card.description
                        }
                        onChange={(event) =>
                          updateCard(
                            cardKey,
                            "description",
                            event.target.value
                          )
                        }
                        rows={4}
                        className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                        Code
                      </span>

                      <input
                        value={card.code}
                        onChange={(event) =>
                          updateCard(
                            cardKey,
                            "code",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                      />
                    </label>
                  </div>

                  <div>
                    <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Title
                    </p>

                    {(
                      [
                        "first",
                        "second",
                        "third",
                      ] as const
                    ).map((field) => (
                      <input
                        key={field}
                        value={
                          card.title[field]
                        }
                        onChange={(event) =>
                          updateCardTitle(
                            cardKey,
                            field,
                            event.target.value
                          )
                        }
                        className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                      />
                    ))}

                    <p className="mb-2 mt-2 text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Image
                    </p>

                    {card.image && (
                      <img
                        src={card.image}
                        alt=""
                        className="mb-3 aspect-video w-full rounded-lg object-cover"
                      />
                    )}

                    <label className="block cursor-pointer rounded-lg border border-white/10 px-4 py-3 text-center text-[9px] uppercase tracking-[0.15em] text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-300">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={uploading}
                        onChange={(event) =>
                          uploadImage(
                            event,
                            (path) =>
                              updateCard(
                                cardKey,
                                "image",
                                path
                              )
                          )
                        }
                      />

                      {uploading
                        ? "Uploading..."
                        : "Upload Image"}
                    </label>

                    <label className="mt-3 block">
                      <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                        Image Position
                      </span>

                      <input
                        value={
                          card.position ||
                          "center"
                        }
                        onChange={(event) =>
                          updateCard(
                            cardKey,
                            "position",
                            event.target.value
                          )
                        }
                        placeholder="center"
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                Visual Archive
              </p>

              <p className="mt-2 text-xs text-white/30">
                Images displayed in the gallery.
              </p>
            </div>

            <button
              type="button"
              onClick={addGalleryItem}
              className="rounded-lg border border-white/10 px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              + Add Image
            </button>
          </div>

          {(visuals.galleryItems || [])
            .length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-xs text-white/30">
              No gallery images yet.
            </div>
          ) : (
            <div className="space-y-4">
              {(
                visuals.galleryItems || []
              ).map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="grid gap-5 md:grid-cols-[180px_1fr_auto] md:items-start">
                    <div>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-black/20 text-[9px] uppercase tracking-[0.15em] text-white/20">
                          No Image
                        </div>
                      )}

                      <label className="mt-3 block cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-center text-[9px] uppercase tracking-[0.12em] text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-300">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploading}
                          onChange={(event) =>
                            uploadImage(
                              event,
                              (path) =>
                                updateGalleryItem(
                                  index,
                                  "image",
                                  path
                                )
                            )
                          }
                        />

                        {uploading
                          ? "Uploading..."
                          : "Upload"}
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                          Category
                        </span>

                        <input
                          value={
                            item.category
                          }
                          onChange={(event) =>
                            updateGalleryItem(
                              index,
                              "category",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        />
                      </label>

                      <label>
                        <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                          Title
                        </span>

                        <input
                          value={item.title}
                          onChange={(event) =>
                            updateGalleryItem(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        />
                      </label>

                      <label>
                        <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                          Size
                        </span>

                        <select
                          value={item.size}
                          onChange={(event) =>
                            updateGalleryItem(
                              index,
                              "size",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        >
                          <option value="large">
                            Large
                          </option>
                          <option value="small">
                            Small
                          </option>
                          <option value="wide">
                            Wide
                          </option>
                        </select>
                      </label>

                      <label>
                        <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                          Image Path
                        </span>

                        <input
                          value={item.image}
                          onChange={(event) =>
                            updateGalleryItem(
                              index,
                              "image",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeGalleryItem(index)
                      }
                      className="rounded-lg border border-red-400/20 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-red-300/70 transition hover:border-red-400/40 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}