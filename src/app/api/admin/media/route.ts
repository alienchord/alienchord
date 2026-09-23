import { NextResponse } from "next/server";
import {
  readdir,
  stat,
  unlink,
} from "fs/promises";
import path from "path";

import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

async function getFiles(
  folder: string,
  type: "cover" | "audio"
) {
  const directory = path.join(
    process.cwd(),
    "public",
    "uploads",
    folder
  );

  try {
    const entries = await readdir(directory);

    const files = [];

    for (const filename of entries) {
      const filePath = path.join(
        directory,
        filename
      );

      const fileStat = await stat(filePath);

      if (!fileStat.isFile()) {
        continue;
      }

      files.push({
        filename,
        type,
        size: fileStat.size,
        updatedAt: fileStat.mtime.toISOString(),
        path:
          type === "cover"
            ? `/uploads/covers/${filename}`
            : `/uploads/audio/${filename}`,
      });
    }

    return files;
  } catch {
    return [];
  }
}

export async function GET() {
  const access = await requireRole([
    Role.OWNER,
    Role.ADMIN,
    Role.EDITOR,
  ]);

  if (!access.authorized) {
    return NextResponse.json(
      {
        success: false,
        error: access.error,
      },
      {
        status: access.status,
      }
    );
  }

  try {
    const covers = await getFiles(
      "covers",
      "cover"
    );

    const audio = await getFiles(
      "audio",
      "audio"
    );

    return NextResponse.json({
      success: true,
      files: [...covers, ...audio].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      ),
    });
  } catch (error) {
    console.error(
      "GET /api/admin/media error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load media.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  const access = await requireRole([
    Role.OWNER,
    Role.ADMIN,
    Role.EDITOR,
  ]);

  if (!access.authorized) {
    return NextResponse.json(
      {
        success: false,
        error: access.error,
      },
      {
        status: access.status,
      }
    );
  }

  try {
    const body = await request.json();

    const filename =
      typeof body?.filename === "string"
        ? body.filename
        : "";

    const type = body?.type;

    if (
      !filename ||
      (type !== "cover" && type !== "audio")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid media file.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      filename.includes("/") ||
      filename.includes("\\") ||
      filename.includes("..")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filename.",
        },
        {
          status: 400,
        }
      );
    }

    const folder =
      type === "cover"
        ? "covers"
        : "audio";

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder,
      filename
    );

    await unlink(filePath);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/media error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete media.",
      },
      {
        status: 500,
      }
    );
  }
}