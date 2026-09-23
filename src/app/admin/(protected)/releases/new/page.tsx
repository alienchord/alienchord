"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Track = {
title: string;
audio: string;
uploading: boolean;
error: string;
};

export default function NewReleasePage() {
const router = useRouter();

const [type, setType] = useState("single");

const [coverPath, setCoverPath] = useState("");
const [coverUploading, setCoverUploading] = useState(false);
const [coverError, setCoverError] = useState("");

const [tracks, setTracks] = useState<Track[]>([
{
title: "",
audio: "",
uploading: false,
error: "",
},
]);

const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState("");

async function uploadCover(file: File) {
const formData = new FormData();

formData.append("file", file);
formData.append("type", "cover");

setCoverUploading(true);
setCoverError("");

try {
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  setCoverPath(data.path);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Upload failed.";

  setCoverError(message);
} finally {
  setCoverUploading(false);
}

}

async function uploadTrackAudio(file: File, index: number) {
const formData = new FormData();

formData.append("file", file);
formData.append("type", "audio");

setTracks((current) =>
  current.map((track, trackIndex) =>
    trackIndex === index
      ? {
          ...track,
          uploading: true,
          error: "",
        }
      : track
  )
);

try {
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  setTracks((current) =>
    current.map((track, trackIndex) =>
      trackIndex === index
        ? {
            ...track,
            audio: data.path,
            uploading: false,
            error: "",
          }
        : track
    )
  );
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Upload failed.";

  setTracks((current) =>
    current.map((track, trackIndex) =>
      trackIndex === index
        ? {
            ...track,
            uploading: false,
            error: message,
          }
        : track
    )
  );
}

}

function handleCoverChange(
event: React.ChangeEvent<HTMLInputElement>
) {
const file = event.target.files?.[0];

if (!file) return;

uploadCover(file);

}

function handleTrackAudioChange(
event: React.ChangeEvent<HTMLInputElement>,
index: number
) {
const file = event.target.files?.[0];

if (!file) return;

uploadTrackAudio(file, index);

}

function updateTrack(
index: number,
field: "title",
value: string
) {
setTracks((current) =>
current.map((track, trackIndex) =>
trackIndex === index
? {
...track,
[field]: value,
}
: track
)
);
}

function addTrack() {
setTracks((current) => [
...current,
{
title: "",
audio: "",
uploading: false,
error: "",
},
]);
}

function removeTrack(index: number) {
setTracks((current) =>
current.filter((_, trackIndex) => trackIndex !== index)
);
}

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();

setSaving(true);
setSaveError("");

const formData = new FormData(event.currentTarget);

const id = String(formData.get("id") || "").trim();
const title = String(formData.get("title") || "").trim();
const releaseDate = String(
  formData.get("releaseDate") || ""
).trim();

if (!id || !title || !releaseDate) {
  setSaveError(
    "Please fill in Release Title, Release Date and Release ID."
  );
  setSaving(false);
  return;
}

if (!coverPath) {
  setSaveError("Please upload a cover.");
  setSaving(false);
  return;
}

const cleanTracks = tracks
  .map((track) => ({
    title: track.title.trim() || title,
    audio: track.audio,
  }))
  .filter((track) => track.audio);

if (cleanTracks.length === 0) {
  setSaveError("Please upload at least one WAV file.");
  setSaving(false);
  return;
}

if (tracks.some((track) => track.uploading)) {
  setSaveError("Please wait until all audio files finish uploading.");
  setSaving(false);
  return;
}

const release = {
  id,
  title,
  type,
  releaseDate,

  cover: coverPath,

  audio: cleanTracks[0].audio,

  description: {
    en: String(
      formData.get("description-en") || ""
    ).trim(),

    ru: String(
      formData.get("description-ru") || ""
    ).trim(),
  },

  tracks: cleanTracks,

  links: {
    spotify: String(
      formData.get("spotify") || ""
    ).trim(),

    appleMusic: String(
      formData.get("appleMusic") || ""
    ).trim(),

    yandexMusic: String(
      formData.get("yandexMusic") || ""
    ).trim(),

    youtube: String(
      formData.get("youtube") || ""
    ).trim(),

    soundcloud: String(
      formData.get("soundcloud") || ""
    ).trim(),
  },
};

try {
  const response = await fetch(
    "/api/admin/releases",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(release),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to save release."
    );
  }

  router.push("/admin/releases");
  router.refresh();
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Failed to save release.";

  setSaveError(message);
  setSaving(false);
}

}

return (
<section className="min-h-screen px-6 py-10 md:px-12 md:py-14">
<div className="mx-auto max-w-5xl">
<div className="border-b border-white/10 pb-8">
<Link href="/admin/releases" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/35 transition-colors duration-300 hover:text-cyan-300" >
<span className="text-base">←</span>
Releases
</Link>

      <p className="mt-10 text-[10px] uppercase tracking-[0.35em] text-cyan-300/60">
        Alien Chord / Admin
      </p>

      <h1 className="mt-4 font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
        New Release
      </h1>
    </div>

    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-10"
    >
      {/* BASIC INFORMATION */}

      <div>
        <SectionTitle
          number="01"
          title="Basic Information"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field
            label="Release Title"
            name="title"
            placeholder="My Remedy"
          />

          <div>
            <label
              htmlFor="type"
              className="text-[10px] uppercase tracking-[0.25em] text-white/35"
            >
              Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none transition-colors focus:border-cyan-300/40"
            >
              <option
                value="single"
                className="bg-[#09090b]"
              >
                Single
              </option>

              <option
                value="album"
                className="bg-[#09090b]"
              >
                Album
              </option>

              <option
                value="ep"
                className="bg-[#09090b]"
              >
                EP
              </option>
            </select>
          </div>

          <Field
            label="Release Date"
            name="releaseDate"
            placeholder="January 2023"
          />

          <Field
            label="Release ID"
            name="id"
            placeholder="My-Remedy"
          />
        </div>
      </div>

      {/* MEDIA */}

      <div>
        <SectionTitle
          number="02"
          title="Media"
        />

        <div className="mt-6">
          <label
            htmlFor="cover"
            className="text-[10px] uppercase tracking-[0.25em] text-white/35"
          >
            Cover
          </label>

          <label
            htmlFor="cover"
            className="mt-3 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-6 text-center transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.03]"
          >
            <input
              id="cover"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleCoverChange}
              className="hidden"
            />

            {coverUploading ? (
              <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">
                Uploading...
              </span>
            ) : coverPath ? (
              <>
                <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                  Cover uploaded
                </span>

                <span className="mt-3 break-all text-xs text-white/35">
                  {coverPath}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl text-white/25">
                  +
                </span>

                <span className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/35">
                  Select Cover
                </span>

                <span className="mt-2 text-xs text-white/20">
                  JPG / PNG / WEBP · max 10 MB
                </span>
              </>
            )}
          </label>

          {coverError && (
            <p className="mt-3 text-xs text-red-400/80">
              {coverError}
            </p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}

      <div>
        <SectionTitle
          number="03"
          title="Description"
        />

        <div className="mt-6 space-y-6">
          <TextArea
            label="English"
            name="description-en"
            placeholder="A heartfelt electronic release..."
          />

          <TextArea
            label="Russian"
            name="description-ru"
            placeholder="Эмоциональный электронный релиз..."
          />
        </div>
      </div>

      {/* TRACKS */}

      <div>
        <div className="flex items-center justify-between">
          <SectionTitle
            number="04"
            title="Tracks"
          />

          <button
            type="button"
            onClick={addTrack}
            className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-cyan-200/70 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:text-cyan-200"
          >
            + Add Track
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/50">
                  Track {String(index + 1).padStart(2, "0")}
                </span>

                {tracks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="text-[10px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-red-300/70"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`track-title-${index}`}
                    className="text-[10px] uppercase tracking-[0.25em] text-white/35"
                  >
                    Track Title
                  </label>

                  <input
                    id={`track-title-${index}`}
                    type="text"
                    value={track.title}
                    onChange={(event) =>
                      updateTrack(
                        index,
                        "title",
                        event.target.value
                      )
                    }
                    placeholder={
                      index === 0
                        ? "My Remedy"
                        : "Track title"
                    }
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/15 outline-none transition-colors focus:border-cyan-300/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`track-audio-${index}`}
                    className="text-[10px] uppercase tracking-[0.25em] text-white/35"
                  >
                    Track Audio
                  </label>

                  <label
                    htmlFor={`track-audio-${index}`}
                    className="mt-3 flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 text-center transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.03]"
                  >
                    <input
                      id={`track-audio-${index}`}
                      type="file"
                      accept=".wav,audio/wav,audio/x-wav,audio/wave"
                      onChange={(event) =>
                        handleTrackAudioChange(
                          event,
                          index
                        )
                      }
                      className="hidden"
                    />

                    {track.uploading ? (
                      <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">
                        Uploading...
                      </span>
                    ) : track.audio ? (
                      <>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                          Audio uploaded
                        </span>

                        <span className="mt-2 max-w-full break-all text-xs text-white/35">
                          {track.audio}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl text-white/25">
                          +
                        </span>

                        <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/35">
                          Select WAV
                        </span>

                        <span className="mt-1 text-xs text-white/20">
                          WAV · max 200 MB
                        </span>
                      </>
                    )}
                  </label>

                  {track.error && (
                    <p className="mt-3 text-xs text-red-400/80">
                      {track.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STREAMING */}

      <div>
        <SectionTitle
          number="05"
          title="Streaming Platforms"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field
            label="Spotify"
            name="spotify"
            placeholder="https://open.spotify.com/..."
          />

          <Field
            label="Apple Music"
            name="appleMusic"
            placeholder="https://music.apple.com/..."
          />

          <Field
            label="Yandex Music"
            name="yandexMusic"
            placeholder="https://music.yandex.ru/..."
          />

          <Field
            label="YouTube"
            name="youtube"
            placeholder="https://youtu.be/..."
          />

          <Field
            label="SoundCloud"
            name="soundcloud"
            placeholder="https://soundcloud.com/..."
          />
        </div>
      </div>

      {/* SAVE */}

      <div className="border-t border-white/10 pt-8">
        {saveError && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
            {saveError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/releases"
            className="rounded-full border border-white/10 px-6 py-3 text-center text-[10px] uppercase tracking-[0.25em] text-white/45 transition-all duration-300 hover:border-white/20 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              coverUploading ||
              tracks.some((track) => track.uploading)
            }
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-cyan-200 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving
              ? "Saving..."
              : "Save Release"}
          </button>
        </div>
      </div>
    </form>
  </div>
</section>

);
}

function SectionTitle({
number,
title,
}: {
number: string;
title: string;
}) {
return (
<div className="flex items-center gap-4">
<span className="text-[10px] tracking-[0.2em] text-cyan-300/50">
{number}
</span>

  <div className="h-px w-8 bg-white/10" />

  <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/35">
    {title}
  </h2>
</div>

);
}

function Field({
label,
name,
placeholder,
}: {
label: string;
name: string;
placeholder?: string;
}) {
return (
<div>
<label htmlFor={name} className="text-[10px] uppercase tracking-[0.25em] text-white/35" >
{label}
</label>

  <input
    id={name}
    name={name}
    type="text"
    placeholder={placeholder}
    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/15 outline-none transition-colors focus:border-cyan-300/40"
  />
</div>

);
}

function TextArea({
label,
name,
placeholder,
}: {
label: string;
name: string;
placeholder?: string;
}) {
return (
<div>
<label htmlFor={name} className="text-[10px] uppercase tracking-[0.25em] text-white/35" >
{label}
</label>

  <textarea
    id={name}
    name={name}
    rows={4}
    placeholder={placeholder}
    className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/80 placeholder:text-white/15 outline-none transition-colors focus:border-cyan-300/40"
  />
</div>

);
}