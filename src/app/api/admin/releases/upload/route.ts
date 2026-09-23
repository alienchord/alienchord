import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_AUDIO_SIZE = 200 * 1024 * 1024;

const allowedImages = ["image/jpeg", "image/png", "image/webp"];
const allowedAudio = ["audio/wav", "audio/x-wav", "audio/wave"];

export async function POST(request: Request) {
  const access = await requireRole([
    Role.OWNER,
    Role.ADMIN,
    Role.EDITOR,
  ]);

  if (!access.authorized) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status }
    );
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const type = formData.get("type");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File was not provided." },
        { status: 400 }
      );
    }

    if (type !== "cover" && type !== "audio") {
      return NextResponse.json(
        { error: "Invalid upload type." },
        { status: 400 }
      );
    }

    if (type === "cover") {
      if (!allowedImages.includes(file.type)) {
        return NextResponse.json(
          { error: "Cover must be JPG, PNG or WEBP." },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Cover is too large. Maximum size is 10 MB." },
          { status: 400 }
        );
      }
    }

    if (type === "audio") {
      if (!allowedAudio.includes(file.type)) {
        return NextResponse.json(
          { error: "Audio must be a WAV file." },
          { status: 400 }
        );
      }

      if (file.size > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          { error: "Audio is too large. Maximum size is 200 MB." },
          { status: 400 }
        );
      }
    }

    const originalName = file.name;
    const extension = path.extname(originalName).toLowerCase();

    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const safeName = `${baseName || "file"}-${Date.now()}${extension}`;

    const folder =
      type === "cover"
        ? path.join(
            process.cwd(),
            "public",
            "uploads",
            "covers"
          )
        : path.join(
            process.cwd(),
            "public",
            "uploads",
            "audio"
          );

    await mkdir(folder, { recursive: true });

    const filePath = path.join(folder, safeName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const publicPath =
      type === "cover"
        ? `/uploads/covers/${safeName}`
        : `/uploads/audio/${safeName}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: safeName,
      originalName,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}