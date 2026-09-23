"use client";

import { useEffect, useState } from "react";

type Content = {
  EN: {
    hero: {
      subtitle: string;
      listen: string;
      scroll: string;
    };
    nav: {
      music: string;
      visuals: string;
      about: string;
      contact: string;
    };
    latestRelease: {
      label: string;
      play: string;
      viewAll: string;
    };
    visualsPreview: {
      image: string;
      label: string;
      counter: string;
      topLabel: string;
      explore: string;
      eyebrow: string;
      titleFirst: string;
      titleSecond: string;
      titleThird: string;
      description: string;
      enterVisuals: string;
      bottomLabel: string;
    };
    visuals: {
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
        one: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
        two: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
        three: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
      };
    };
    about: {
      label: string;
      role: string;
      statement: {
        first: string;
        second: string;
      };
      description: string;
      experience: string;
      footer: string;
    };
    contact: {
      label: string;
      signal: string;
      title: string;
      move: string;
      description: {
        first: string;
        second: string;
      };
      getInTouch: string;
      instagram: string;
    };
  };

  RU: {
    hero: {
      subtitle: string;
      listen: string;
      scroll: string;
    };
    nav: {
      music: string;
      visuals: string;
      about: string;
      contact: string;
    };
    latestRelease: {
      label: string;
      play: string;
      viewAll: string;
    };
    visualsPreview: {
      image: string;
      label: string;
      counter: string;
      topLabel: string;
      explore: string;
      eyebrow: string;
      titleFirst: string;
      titleSecond: string;
      titleThird: string;
      description: string;
      enterVisuals: string;
      bottomLabel: string;
    };
    visuals: {
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
        one: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
        two: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
        three: {
          category: string;
          title: {
            first: string;
            second: string;
            third: string;
          };
          description: string;
          code: string;
        };
      };
    };
    about: {
      label: string;
      role: string;
      statement: {
        first: string;
        second: string;
      };
      description: string;
      experience: string;
      footer: string;
    };
    contact: {
      label: string;
      signal: string;
      title: string;
      description: {
        first: string;
        second: string;
      };
      getInTouch: string;
      instagram: string;
    };
  };
};

const defaultVisualsPreview = {
  image:
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85",
  label: "Visuals",
  counter: "01 / 03",
  topLabel: "SOUND / MOTION / IDENTITY",
  explore: "Explore",
  eyebrow: "Alien Chord / Visuals",
  titleFirst: "SOUND",
  titleSecond: "BECOMES",
  titleThird: "SIGNAL.",
  description:
    "Visuals built around sound, movement and identity. A different way to experience Alien Chord.",
  enterVisuals: "Enter Visuals",
  bottomLabel: "MUSIC / MOTION / IDENTITY",
};

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
        {title}
      </h2>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function WebsiteAdminPage() {
  const [language, setLanguage] = useState<"EN" | "RU">("EN");
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/admin/website", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load website content.");
        }

        const data = await response.json();

        if (!data?.content?.EN || !data?.content?.RU) {
          throw new Error("Invalid website content structure.");
        }

        const normalizedContent: Content = {
          ...data.content,

          EN: {
            ...data.content.EN,

            visualsPreview: {
              ...defaultVisualsPreview,
              ...(data.content.EN.visualsPreview || {}),
            },
          },

          RU: {
            ...data.content.RU,

            visualsPreview: {
              ...defaultVisualsPreview,
              ...(data.content.RU.visualsPreview || {}),
            },
          },
        };

        setContent(normalizedContent);
      } catch (error) {
        console.error(
          "Failed to load website content:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  function updateField(
    section: keyof Content["EN"],
    field: string,
    value: string
  ) {
    if (!content) return;

    setContent((current) => {
      if (!current) return current;

      return {
        ...current,

        [language]: {
          ...current[language],

          [section]: {
            ...(current[language][section] as object),
            [field]: value,
          },
        },
      };
    });
  }

  function updateNestedField(
    section: keyof Content["EN"],
    group: string,
    field: string,
    value: string
  ) {
    if (!content) return;

    setContent((current) => {
      if (!current) return current;

      const currentSection =
        current[language][section] as Record<
          string,
          unknown
        >;

      const currentGroup =
        currentSection[group] as Record<
          string,
          unknown
        >;

      return {
        ...current,

        [language]: {
          ...current[language],

          [section]: {
            ...currentSection,

            [group]: {
              ...currentGroup,
              [field]: value,
            },
          },
        },
      };
    });
  }

  function updateVisualsPreviewField(
    field: keyof Content["EN"]["visualsPreview"],
    value: string
  ) {
    if (!content) return;

    setContent((current) => {
      if (!current) return current;

      return {
        ...current,

        [language]: {
          ...current[language],

          visualsPreview: {
            ...current[language].visualsPreview,
            [field]: value,
          },
        },
      };
    });
  }

  async function uploadVisualsPreviewImage(
    file: File
  ) {
    setUploadingImage(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      // Upload API expects "cover", not "image"
      formData.append("type", "cover");

      const response = await fetch(
        "/api/admin/releases/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const rawResponse = await response.text();

      let data: any = {};

      try {
        data = rawResponse
          ? JSON.parse(rawResponse)
          : {};
      } catch {
        throw new Error(
          `Upload failed (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Failed to upload image (${response.status}).`
        );
      }

      const imagePath =
        data?.path ||
        data?.url ||
        data?.file?.path ||
        data?.file?.url;

      if (!imagePath) {
        throw new Error(
          "Upload succeeded, but no image path was returned."
        );
      }

      updateVisualsPreviewField(
        "image",
        imagePath
      );

      setMessage(
        "Image uploaded. Click Save to apply it."
      );
    } catch (error) {
      console.error(
        "Failed to upload Visuals Preview image:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  function updateCardField(
    card: "one" | "two" | "three",
    field:
      | "category"
      | "description"
      | "code",
    value: string
  ) {
    if (!content) return;

    setContent((current) => {
      if (!current) return current;

      return {
        ...current,

        [language]: {
          ...current[language],

          visuals: {
            ...current[language].visuals,

            cards: {
              ...current[language].visuals.cards,

              [card]: {
                ...current[language].visuals.cards[
                  card
                ],
                [field]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateCardTitle(
    card: "one" | "two" | "three",
    line: "first" | "second" | "third",
    value: string
  ) {
    if (!content) return;

    setContent((current) => {
      if (!current) return current;

      return {
        ...current,

        [language]: {
          ...current[language],

          visuals: {
            ...current[language].visuals,

            cards: {
              ...current[language].visuals.cards,

              [card]: {
                ...current[language].visuals.cards[
                  card
                ],

                title: {
                  ...current[language].visuals.cards[
                    card
                  ].title,

                  [line]: value,
                },
              },
            },
          },
        },
      };
    });
  }

  async function saveContent() {
    if (!content) return;

    setSaving(true);
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

      const rawResponse = await response.text();

      let data: any = {};

      try {
        data = rawResponse
          ? JSON.parse(rawResponse)
          : {};
      } catch {
        throw new Error(
          `Save failed (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Failed to save content (${response.status}).`
        );
      }

      const savedContent: Content = {
        ...data.content,

        EN: {
          ...data.content.EN,

          visualsPreview: {
            ...defaultVisualsPreview,
            ...(data.content.EN.visualsPreview || {}),
          },
        },

        RU: {
          ...data.content.RU,

          visualsPreview: {
            ...defaultVisualsPreview,
            ...(data.content.RU.visualsPreview || {}),
          },
        },
      };

      setContent(savedContent);
      setMessage("Saved successfully.");

      window.dispatchEvent(
        new Event("alien-chord-content-updated")
      );
    } catch (error) {
      console.error(
        "Failed to save website content:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030308] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-[#030308] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-red-400">
            Failed to load website content.
          </p>
        </div>
      </main>
    );
  }

  const current = content[language];

  return (
    <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">

        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300">
              Alien Chord
            </p>

            <h1 className="text-3xl font-medium tracking-tight">
              Website
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Edit the public website content.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setLanguage("EN")}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                language === "EN"
                  ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("RU")}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                language === "RU"
                  ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="rounded-full bg-white px-5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>

          </div>
        </header>

        {message && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/60">
            {message}
          </div>
        )}

        <Section title="Navigation">

          <Input
            label="Music"
            value={current.nav.music}
            onChange={(value) =>
              updateField("nav", "music", value)
            }
          />

          <Input
            label="Visuals"
            value={current.nav.visuals}
            onChange={(value) =>
              updateField("nav", "visuals", value)
            }
          />

          <Input
            label="About"
            value={current.nav.about}
            onChange={(value) =>
              updateField("nav", "about", value)
            }
          />

          <Input
            label="Contact"
            value={current.nav.contact}
            onChange={(value) =>
              updateField("nav", "contact", value)
            }
          />

        </Section>

        <Section title="Hero">

          <Input
            label="Subtitle"
            value={current.hero.subtitle}
            onChange={(value) =>
              updateField("hero", "subtitle", value)
            }
          />

          <Input
            label="Listen button"
            value={current.hero.listen}
            onChange={(value) =>
              updateField("hero", "listen", value)
            }
          />

          <Input
            label="Scroll"
            value={current.hero.scroll}
            onChange={(value) =>
              updateField("hero", "scroll", value)
            }
          />

        </Section>

        <Section title="Latest Release">

          <Input
            label="Label"
            value={current.latestRelease.label}
            onChange={(value) =>
              updateField(
                "latestRelease",
                "label",
                value
              )
            }
          />

          <Input
            label="Play button"
            value={current.latestRelease.play}
            onChange={(value) =>
              updateField(
                "latestRelease",
                "play",
                value
              )
            }
          />

          <Input
            label="View all music"
            value={current.latestRelease.viewAll}
            onChange={(value) =>
              updateField(
                "latestRelease",
                "viewAll",
                value
              )
            }
          />

        </Section>

        <Section title="Visuals — Home Preview">

          <div className="space-y-3">

            <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50">
              Main image
            </label>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">

              {current.visualsPreview.image && (
                <img
                  src={current.visualsPreview.image}
                  alt="Visuals Preview"
                  className="h-64 w-full object-cover"
                />
              )}

            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploadingImage}
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (file) {
                  uploadVisualsPreviewImage(file);
                }

                event.currentTarget.value = "";
              }}
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-xs file:font-medium file:text-black hover:border-cyan-400/40"
            />

            <p className="text-[11px] text-white/30">
              {uploadingImage
                ? "Uploading..."
                : "JPG, PNG or WEBP. Upload the image, then click Save."}
            </p>

          </div>

          <Input
            label="Label"
            value={current.visualsPreview.label}
            onChange={(value) =>
              updateVisualsPreviewField(
                "label",
                value
              )
            }
          />

          <Input
            label="Counter"
            value={current.visualsPreview.counter}
            onChange={(value) =>
              updateVisualsPreviewField(
                "counter",
                value
              )
            }
          />

          <Input
            label="Top label"
            value={current.visualsPreview.topLabel}
            onChange={(value) =>
              updateVisualsPreviewField(
                "topLabel",
                value
              )
            }
          />

          <Input
            label="Explore"
            value={current.visualsPreview.explore}
            onChange={(value) =>
              updateVisualsPreviewField(
                "explore",
                value
              )
            }
          />

          <Input
            label="Eyebrow"
            value={current.visualsPreview.eyebrow}
            onChange={(value) =>
              updateVisualsPreviewField(
                "eyebrow",
                value
              )
            }
          />

          <Input
            label="Title — first"
            value={current.visualsPreview.titleFirst}
            onChange={(value) =>
              updateVisualsPreviewField(
                "titleFirst",
                value
              )
            }
          />

          <Input
            label="Title — second"
            value={current.visualsPreview.titleSecond}
            onChange={(value) =>
              updateVisualsPreviewField(
                "titleSecond",
                value
              )
            }
          />

          <Input
            label="Title — third"
            value={current.visualsPreview.titleThird}
            onChange={(value) =>
              updateVisualsPreviewField(
                "titleThird",
                value
              )
            }
          />

          <Textarea
            label="Description"
            value={current.visualsPreview.description}
            onChange={(value) =>
              updateVisualsPreviewField(
                "description",
                value
              )
            }
          />

          <Input
            label="Enter Visuals"
            value={current.visualsPreview.enterVisuals}
            onChange={(value) =>
              updateVisualsPreviewField(
                "enterVisuals",
                value
              )
            }
          />

          <Input
            label="Bottom label"
            value={current.visualsPreview.bottomLabel}
            onChange={(value) =>
              updateVisualsPreviewField(
                "bottomLabel",
                value
              )
            }
          />

        </Section>

        <Section title="Visuals — Main">

          <Input
            label="Label"
            value={current.visuals.label}
            onChange={(value) =>
              updateField("visuals", "label", value)
            }
          />

          <Input
            label="Hero title — first"
            value={current.visuals.heroTitle.first}
            onChange={(value) =>
              updateNestedField(
                "visuals",
                "heroTitle",
                "first",
                value
              )
            }
          />

          <Input
            label="Hero title — second"
            value={current.visuals.heroTitle.second}
            onChange={(value) =>
              updateNestedField(
                "visuals",
                "heroTitle",
                "second",
                value
              )
            }
          />

          <Input
            label="Hero title — third"
            value={current.visuals.heroTitle.third}
            onChange={(value) =>
              updateNestedField(
                "visuals",
                "heroTitle",
                "third",
                value
              )
            }
          />

          <Textarea
            label="Hero description"
            value={current.visuals.heroDescription}
            onChange={(value) =>
              updateField(
                "visuals",
                "heroDescription",
                value
              )
            }
          />

          <Input
            label="Experiences"
            value={current.visuals.experiences}
            onChange={(value) =>
              updateField(
                "visuals",
                "experiences",
                value
              )
            }
          />

          <Input
            label="Visual language"
            value={current.visuals.language}
            onChange={(value) =>
              updateField(
                "visuals",
                "language",
                value
              )
            }
          />

          <Input
            label="Categories"
            value={current.visuals.categories}
            onChange={(value) =>
              updateField(
                "visuals",
                "categories",
                value
              )
            }
          />

          <Input
            label="Signal active"
            value={current.visuals.signalActive}
            onChange={(value) =>
              updateField(
                "visuals",
                "signalActive",
                value
              )
            }
          />

          <Input
            label="Visual system"
            value={current.visuals.visualSystem}
            onChange={(value) =>
              updateField(
                "visuals",
                "visualSystem",
                value
              )
            }
          />

          <Input
            label="Bottom"
            value={current.visuals.bottom}
            onChange={(value) =>
              updateField(
                "visuals",
                "bottom",
                value
              )
            }
          />

        </Section>

        <Section title="Visuals — Cards">

          {(
            [
              ["one", "Card 01"],
              ["two", "Card 02"],
              ["three", "Card 03"],
            ] as const
          ).map(([card, cardTitle]) => (
            <div
              key={card}
              className="space-y-5 rounded-xl border border-white/10 bg-black/20 p-5"
            >

              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                {cardTitle}
              </h3>

              <Input
                label="Category"
                value={
                  current.visuals.cards[card]
                    .category
                }
                onChange={(value) =>
                  updateCardField(
                    card,
                    "category",
                    value
                  )
                }
              />

              <Input
                label="Title — first"
                value={
                  current.visuals.cards[card]
                    .title.first
                }
                onChange={(value) =>
                  updateCardTitle(
                    card,
                    "first",
                    value
                  )
                }
              />

              <Input
                label="Title — second"
                value={
                  current.visuals.cards[card]
                    .title.second
                }
                onChange={(value) =>
                  updateCardTitle(
                    card,
                    "second",
                    value
                  )
                }
              />

              <Input
                label="Title — third"
                value={
                  current.visuals.cards[card]
                    .title.third
                }
                onChange={(value) =>
                  updateCardTitle(
                    card,
                    "third",
                    value
                  )
                }
              />

              <Textarea
                label="Description"
                value={
                  current.visuals.cards[card]
                    .description
                }
                onChange={(value) =>
                  updateCardField(
                    card,
                    "description",
                    value
                  )
                }
              />

              <Input
                label="Code"
                value={
                  current.visuals.cards[card]
                    .code
                }
                onChange={(value) =>
                  updateCardField(
                    card,
                    "code",
                    value
                  )
                }
              />

            </div>
          ))}

        </Section>

        <Section title="Visuals — Gallery">

          <Input
            label="Gallery label"
            value={current.visuals.galleryLabel}
            onChange={(value) =>
              updateField(
                "visuals",
                "galleryLabel",
                value
              )
            }
          />

          <Input
            label="Gallery title"
            value={current.visuals.galleryTitle}
            onChange={(value) =>
              updateField(
                "visuals",
                "galleryTitle",
                value
              )
            }
          />

          <Textarea
            label="Gallery description"
            value={
              current.visuals.galleryDescription
            }
            onChange={(value) =>
              updateField(
                "visuals",
                "galleryDescription",
                value
              )
            }
          />

          <Input
            label="Gallery"
            value={current.visuals.gallery}
            onChange={(value) =>
              updateField(
                "visuals",
                "gallery",
                value
              )
            }
          />

          <Input
            label="Live"
            value={current.visuals.liveSoon}
            onChange={(value) =>
              updateField(
                "visuals",
                "liveSoon",
                value
              )
            }
          />

          <Input
            label="Motion"
            value={current.visuals.motionSoon}
            onChange={(value) =>
              updateField(
                "visuals",
                "motionSoon",
                value
              )
            }
          />

          <Input
            label="BTS"
            value={current.visuals.btsSoon}
            onChange={(value) =>
              updateField(
                "visuals",
                "btsSoon",
                value
              )
            }
          />

          <Input
            label="End"
            value={current.visuals.end}
            onChange={(value) =>
              updateField(
                "visuals",
                "end",
                value
              )
            }
          />

        </Section>

        <Section title="About">

          <Input
            label="Label"
            value={current.about.label}
            onChange={(value) =>
              updateField(
                "about",
                "label",
                value
              )
            }
          />

          <Input
            label="Role"
            value={current.about.role}
            onChange={(value) =>
              updateField(
                "about",
                "role",
                value
              )
            }
          />

          <Input
            label="Statement — first"
            value={current.about.statement.first}
            onChange={(value) =>
              updateNestedField(
                "about",
                "statement",
                "first",
                value
              )
            }
          />

          <Input
            label="Statement — second"
            value={current.about.statement.second}
            onChange={(value) =>
              updateNestedField(
                "about",
                "statement",
                "second",
                value
              )
            }
          />

          <Textarea
            label="Description"
            value={current.about.description}
            onChange={(value) =>
              updateField(
                "about",
                "description",
                value
              )
            }
          />

          <Input
            label="Experience"
            value={current.about.experience}
            onChange={(value) =>
              updateField(
                "about",
                "experience",
                value
              )
            }
          />

          <Input
            label="Footer"
            value={current.about.footer}
            onChange={(value) =>
              updateField(
                "about",
                "footer",
                value
              )
            }
          />

        </Section>

        <Section title="Contact">

          <Input
            label="Label"
            value={current.contact.label}
            onChange={(value) =>
              updateField(
                "contact",
                "label",
                value
              )
            }
          />

          <Input
            label="Signal"
            value={current.contact.signal}
            onChange={(value) =>
              updateField(
                "contact",
                "signal",
                value
              )
            }
          />

          <Input
            label="Title"
            value={current.contact.title}
            onChange={(value) =>
              updateField(
                "contact",
                "title",
                value
              )
            }
          />

          {language === "EN" && (
            <Input
              label="Move"
              value={content.EN.contact.move}
              onChange={(value) =>
                setContent((current) => {
                  if (!current) return current;

                  return {
                    ...current,

                    EN: {
                      ...current.EN,

                      contact: {
                        ...current.EN.contact,
                        move: value,
                      },
                    },
                  };
                })
              }
            />
          )}

          <Input
            label="Description — first"
            value={current.contact.description.first}
            onChange={(value) =>
              updateNestedField(
                "contact",
                "description",
                "first",
                value
              )
            }
          />

          <Input
            label="Description — second"
            value={current.contact.description.second}
            onChange={(value) =>
              updateNestedField(
                "contact",
                "description",
                "second",
                value
              )
            }
          />

          <Input
            label="Get in touch"
            value={current.contact.getInTouch}
            onChange={(value) =>
              updateField(
                "contact",
                "getInTouch",
                value
              )
            }
          />

          <Input
            label="Instagram"
            value={current.contact.instagram}
            onChange={(value) =>
              updateField(
                "contact",
                "instagram",
                value
              )
            }
          />

        </Section>

        <div className="flex justify-end border-t border-white/10 pt-6">

          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="rounded-full bg-cyan-300 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>
    </main>
  );
}