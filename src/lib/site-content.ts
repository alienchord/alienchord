import { getPrisma } from "@/lib/prisma";
import { translations } from "@/data/translations";

export type SiteContent = typeof translations;

function deepMerge(
  defaults: any,
  overrides: any
): any {
  if (
    defaults === null ||
    typeof defaults !== "object" ||
    Array.isArray(defaults)
  ) {
    return overrides !== undefined
      ? overrides
      : defaults;
  }

  if (
    overrides === null ||
    typeof overrides !== "object" ||
    Array.isArray(overrides)
  ) {
    return overrides !== undefined
      ? overrides
      : defaults;
  }

  const result: Record<string, any> = {
    ...defaults,
  };

  for (const key of Object.keys(overrides)) {
    result[key] = deepMerge(
      defaults[key],
      overrides[key]
    );
  }

  return result;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const row = await getPrisma().siteContent.findUnique({
      where: {
        id: "main",
      },
    });

    if (!row) {
      return translations;
    }

    return deepMerge(
      translations,
      row.content
    ) as SiteContent;
  } catch (error) {
    console.error(
      "Failed to read site content from database:",
      error
    );

    return translations;
  }
}

export async function saveSiteContent(
  content: SiteContent
): Promise<void> {
  try {
    await getPrisma().siteContent.upsert({
      where: {
        id: "main",
      },
      update: {
        content,
      },
      create: {
        id: "main",
        content,
      },
    });
  } catch (error) {
    console.error(
      "Failed to save site content to database:",
      error
    );

    throw error;
  }
}