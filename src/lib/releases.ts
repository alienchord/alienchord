import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { releases as staticReleases } from "@/data/releases";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

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

function toAdminRelease(content: unknown): AdminRelease | null {
  if (!content || typeof content !== "object") {
    return null;
  }

  return content as AdminRelease;
}

export async function getAdminReleases(): Promise<AdminRelease[]> {
  try {
    const rows = await prisma.releaseData.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });

    const savedReleases: AdminRelease[] = [];

    for (const row of rows) {
      const release = toAdminRelease(row.content);

      if (release) {
        savedReleases.push(release);
      }
    }

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
    console.error("Failed to read releases from database:", error);

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
  try {
    await prisma.$transaction(async (tx) => {
      await tx.releaseData.deleteMany();

      for (const release of releases) {
        await tx.releaseData.create({
          data: {
            id: release.id,
            content: release,
          },
        });
      }
    });
  } catch (error) {
    console.error("Failed to save releases to database:", error);
    throw error;
  }
}