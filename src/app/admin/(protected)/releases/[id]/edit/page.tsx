"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Track = {
title: string;
audio: string;
};

type Release = {
id: string;
title: string;
type: string;
releaseDate: string;
cover: string;
audio: string;
description: {
en: string;
ru: string;
};
tracks: Track[];
links: {
spotify: string;
appleMusic: string;
yandexMusic: string;
youtube: string;
soundcloud: string;
};
};

export default function EditReleasePage() {
const params = useParams();
const router = useRouter();

const rawId = params.id;
const id = Array.isArray(rawId) ? rawId[0] : rawId;

const [release, setRelease] = useState<Release | null>(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [uploading, setUploading] = useState(false);
const [message, setMessage] = useState("");

useEffect(() => {
if (!id) {
setLoading(false);
return;
}

async function loadRelease() {
  try {
    setLoading(true);
    setMessage("");

    const url =
      "/api/admin/releases/" + encodeURIComponent(id ?? "");

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to load release."
      );
    }

    setRelease(data.release);
  } catch (error) {
    console.error(error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Failed to load release."
    );
  } finally {
    setLoading(false);
  }
}

loadRelease();

}, [id]);

function updateField<K extends keyof Release>(
field: K,
value: Release[K]
) {
if (!release) return;

setRelease({
  ...release,
  [field]: value,
});

}

function updateDescription(
language: "en" | "ru",
value: string
) {
if (!release) return;

setRelease({
  ...release,
  description: {
    ...release.description,
    [language]: value,
  },
});

}

function updateLink(
platform:
| "spotify"
| "appleMusic"
| "yandexMusic"
| "youtube"
| "soundcloud",
value: string
) {
if (!release) return;

setRelease({
  ...release,
  links: {
    ...release.links,
    [platform]: value,
  },
});

}

function updateTrack(
index: number,
field: "title" | "audio",
value: string
) {
if (!release) return;

const tracks = [...release.tracks];

tracks[index] = {
  ...tracks[index],
  [field]: value,
};

setRelease({
  ...release,
  tracks,
});

}

function addTrack() {
if (!release) return;

setRelease({
  ...release,
  tracks: [
    ...release.tracks,
    {
      title: "",
      audio: "",
    },
  ],
});

}

function removeTrack(index: number) {
if (!release) return;

setRelease({
  ...release,
  tracks: release.tracks.filter((_, i) => i !== index),
});

}

async function uploadFile(
file: File,
type: "cover" | "audio"
) {
try {
setUploading(true);
setMessage("");

  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch(
    "/api/admin/releases/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Upload failed."
    );
  }

  return data.path as string;
} catch (error) {
  console.error(error);

  setMessage(
    error instanceof Error
      ? error.message
      : "Upload failed."
  );

  return null;
} finally {
  setUploading(false);
}

}

async function handleCoverUpload(
event: React.ChangeEvent<HTMLInputElement>
) {
const file = event.target.files?.[0];

if (!file || !release) return;

const uploadedPath = await uploadFile(file, "cover");

if (uploadedPath) {
  setRelease({
    ...release,
    cover: uploadedPath,
  });

  setMessage("New cover uploaded. Save changes to apply it.");
}

event.target.value = "";

}

async function handleMainAudioUpload(
event: React.ChangeEvent<HTMLInputElement>
) {
const file = event.target.files?.[0];

if (!file || !release) return;

const uploadedPath = await uploadFile(file, "audio");

if (uploadedPath) {
  setRelease({
    ...release,
    audio: uploadedPath,
  });

  setMessage(
    "New main audio uploaded. Save changes to apply it."
  );
}

event.target.value = "";

}

async function handleTrackAudioUpload(
event: React.ChangeEvent<HTMLInputElement>,
index: number
) {
const file = event.target.files?.[0];

if (!file || !release) return;

const uploadedPath = await uploadFile(file, "audio");

if (uploadedPath) {
  const tracks = [...release.tracks];

  tracks[index] = {
    ...tracks[index],
    audio: uploadedPath,
  };

  setRelease({
    ...release,
    tracks,
  });

  setMessage(
    "Track audio uploaded. Save changes to apply it."
  );
}

event.target.value = "";

}

async function handleSave(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();

if (!release || !id) return;

try {
  setSaving(true);
  setMessage("");

  const url =
    "/api/admin/releases/" + encodeURIComponent(id ?? "");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(release),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to save release."
    );
  }

  setRelease(data.release);
  setMessage("Release saved successfully.");
} catch (error) {
  console.error(error);

  setMessage(
    error instanceof Error
      ? error.message
      : "Failed to save release."
  );
} finally {
  setSaving(false);
}

}

async function handleDelete() {
if (!id) return;

const confirmed = window.confirm(
  "Are you sure you want to delete this release?"
);

if (!confirmed) return;

try {
  setSaving(true);
  setMessage("");

  const url =
    "/api/admin/releases/" + encodeURIComponent(id ?? "");

  const response = await fetch(url, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to delete release."
    );
  }

  router.push("/admin/releases");
  router.refresh();
} catch (error) {
  console.error(error);

  setMessage(
    error instanceof Error
      ? error.message
      : "Failed to delete release."
  );

  setSaving(false);
}

}

if (loading) {
return (
<main className="min-h-screen bg-black px-6 py-12 text-white">
<div className="mx-auto max-w-5xl">
<p className="text-sm text-white/50">
Loading release...
</p>
</div>
</main>
);
}

if (!release) {
return (
<main className="min-h-screen bg-black px-6 py-12 text-white">
<div className="mx-auto max-w-5xl">
<p className="mb-6 text-sm text-red-400">
{message || "Release not found."}
</p>

      <Link
        href="/admin/releases"
        className="text-sm text-white/70 transition hover:text-white"
      >
        ← Back to releases
      </Link>
    </div>
  </main>
);

}

return (
<main className="min-h-screen bg-black px-6 py-10 text-white">
<div className="mx-auto max-w-5xl">
<div className="mb-10 flex items-center justify-between gap-4">
<div>
<Link href="/admin/releases" className="mb-4 inline-block text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white" >
← Releases
</Link>

        <h1 className="text-3xl font-semibold tracking-tight">
          Edit Release
        </h1>

        <p className="mt-2 text-sm text-white/40">
          {release.id}
        </p>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={saving || uploading}
        className="rounded-full border border-red-500/30 px-5 py-2 text-xs uppercase tracking-[0.15em] text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 disabled:opacity-40"
      >
        Delete
      </button>
    </div>

    {message && (
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/70">
        {message}
      </div>
    )}

    <form
      onSubmit={handleSave}
      className="space-y-8"
    >
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="mb-6 text-lg font-medium">
          Basic information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Title
            </label>

            <input
              type="text"
              value={release.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Release date
            </label>

            <input
              type="text"
              value={release.releaseDate}
              onChange={(e) =>
                updateField(
                  "releaseDate",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Type
            </label>

            <select
              value={release.type}
              onChange={(e) =>
                updateField("type", e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none"
            >
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="album">Album</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Cover
            </label>

            <div className="rounded-2xl border border-white/10 bg-black p-4">
              <div className="mb-4 flex items-center gap-4">
                {release.cover && (
                  <img
                    src={release.cover}
                    alt={release.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/50">
                    {release.cover || "No cover"}
                  </p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/70 transition hover:border-white/30 hover:text-white">
                {uploading
                  ? "Uploading..."
                  : "Upload new cover"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverUpload}
                  disabled={uploading || saving}
                  className="hidden"
                />
              </label>

              <p className="mt-3 text-xs text-white/30">
                JPG, PNG or WEBP · max 10 MB
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Main audio
            </label>

            <div className="rounded-2xl border border-white/10 bg-black p-4">
              <p className="mb-4 truncate text-xs text-white/50">
                {release.audio || "No main audio"}
              </p>

              <label className="inline-flex cursor-pointer rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/70 transition hover:border-white/30 hover:text-white">
                {uploading
                  ? "Uploading..."
                  : "Upload new audio"}

                <input
                  type="file"
                  accept=".wav,audio/wav,audio/x-wav,audio/wave"
                  onChange={handleMainAudioUpload}
                  disabled={uploading || saving}
                  className="hidden"
                />
              </label>

              <p className="mt-3 text-xs text-white/30">
                WAV · max 200 MB
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="mb-6 text-lg font-medium">
          Description
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              English
            </label>

            <textarea
              value={release.description.en}
              onChange={(e) =>
                updateDescription(
                  "en",
                  e.target.value
                )
              }
              rows={5}
              className="w-full resize-y rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Russian
            </label>

            <textarea
              value={release.description.ru}
              onChange={(e) =>
                updateDescription(
                  "ru",
                  e.target.value
                )
              }
              rows={5}
              className="w-full resize-y rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">
            Tracks
          </h2>

          <button
            type="button"
            onClick={addTrack}
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/70 transition hover:border-white/30 hover:text-white"
          >
            + Add track
          </button>
        </div>

        <div className="space-y-5">
          {release.tracks.map((track, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-white/40">
                  Track {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeTrack(index)
                  }
                  className="text-xs text-red-400/70 transition hover:text-red-400"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Track title"
                  value={track.title}
                  onChange={(e) =>
                    updateTrack(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
                />

                <div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Audio path"
                      value={track.audio}
                      onChange={(e) =>
                        updateTrack(
                          index,
                          "audio",
                          e.target.value
                        )
                      }
                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
                    />

                    <label className="inline-flex shrink-0 cursor-pointer items-center rounded-2xl border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.1em] text-white/70 transition hover:border-white/30 hover:text-white">
                      Upload
                      <input
                        type="file"
                        accept=".wav,audio/wav,audio/x-wav,audio/wave"
                        onChange={(e) =>
                          handleTrackAudioUpload(
                            e,
                            index
                          )
                        }
                        disabled={uploading || saving}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="mt-2 text-xs text-white/30">
                    WAV · max 200 MB
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="mb-6 text-lg font-medium">
          Streaming links
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Spotify
            </label>

            <input
              type="url"
              value={release.links.spotify}
              onChange={(e) =>
                updateLink(
                  "spotify",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Apple Music
            </label>

            <input
              type="url"
              value={release.links.appleMusic}
              onChange={(e) =>
                updateLink(
                  "appleMusic",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Yandex Music
            </label>

            <input
              type="url"
              value={release.links.yandexMusic}
              onChange={(e) =>
                updateLink(
                  "yandexMusic",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              YouTube
            </label>

            <input
              type="url"
              value={release.links.youtube}
              onChange={(e) =>
                updateLink(
                  "youtube",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              SoundCloud
            </label>

            <input
              type="url"
              value={release.links.soundcloud}
              onChange={(e) =>
                updateLink(
                  "soundcloud",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pb-10">
        <Link
          href="/admin/releases"
          className="rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.15em] text-white/60 transition hover:border-white/20 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-white px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : saving
            ? "Saving..."
            : "Save changes"}
        </button>
      </div>
    </form>
  </div>
</main>

);
}