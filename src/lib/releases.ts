import { promises as fs } from "fs";
import path from "path";
import { releases as staticReleases } from "@/data/releases";

const dataDirectory = path.join(process.cwd(), "data");
const releasesFile = path.join(dataDirectory, "admin-releases.json");

export type Track = {
title: string;
audio: string;
};

export type AdminRelease = {
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

export type Release = AdminRelease;

function normalizeId(value: string) {
try {
return decodeURIComponent(value).trim().normalize("NFC");
} catch {
return value.trim().normalize("NFC");
}
}

export async function getAdminReleases(): Promise<AdminRelease[]> {
try {
const file = await fs.readFile(releasesFile, "utf8");
const data = JSON.parse(file);

const savedReleases: AdminRelease[] = Array.isArray(data)
  ? data
  : [];

const merged = [...staticReleases] as AdminRelease[];

for (const savedRelease of savedReleases) {
  const existingIndex = merged.findIndex(
    (release) =>
      normalizeId(String(release.id)) ===
      normalizeId(String(savedRelease.id))
  );

  if (existingIndex >= 0) {
    merged[existingIndex] = savedRelease;
  } else {
    merged.push(savedRelease);
  }
}

return merged;

} catch (error) {
console.error("Failed to read admin releases:", error);

return [...staticReleases] as AdminRelease[];

}
}

export async function getReleases(): Promise<Release[]> {
return getAdminReleases();
}

export async function getReleaseById(
id: string
): Promise<AdminRelease | undefined> {
const releases = await getAdminReleases();
const normalizedId = normalizeId(id);

return releases.find(
(release) =>
normalizeId(String(release.id)) === normalizedId
);
}

export async function saveAdminReleases(
releases: AdminRelease[]
): Promise<void> {
await fs.mkdir(dataDirectory, { recursive: true });

await fs.writeFile(
releasesFile,
JSON.stringify(releases, null, 2),
"utf8"
);
}