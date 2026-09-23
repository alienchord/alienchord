import { promises as fs } from "fs";
import path from "path";
import { translations } from "@/data/translations";

export type SiteContent = typeof translations;

const dataDirectory = path.join(process.cwd(), "data");
const contentFile = path.join(dataDirectory, "site-content.json");

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
    const file = await fs.readFile(
      contentFile,
      "utf8"
    );

    const data = JSON.parse(file);

    return deepMerge(
      translations,
      data
    ) as SiteContent;
  } catch (error) {
    console.error(
      "Failed to read site content:",
      error
    );

    return translations;
  }
}

export async function saveSiteContent(
  content: SiteContent
): Promise<void> {
  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  await fs.writeFile(
    contentFile,
    JSON.stringify(content, null, 2),
    "utf8"
  );
}