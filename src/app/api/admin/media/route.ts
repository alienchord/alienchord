import { NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

async function getFiles(
  folder: string,
  type: "cover" | "audio"
) {
  const { data, error } = await supabaseAdmin.storage
    .from("media")
    .list(folder, {
      limit: 1000,
      sortBy: {
        column: "created_at",
        order: "desc",
      },
    });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .filter((file) => file.name)
    .map((file) => {
      const path = `${folder}/${file.name}`;

      const { data: publicUrl } = supabaseAdmin.storage
        .from("media")
        .getPublicUrl(path);

      return {
        filename: file.name,
        type,
        size: file.metadata?.size
          ? Number(file.metadata.size)
          : 0,
        updatedAt:
          file.updated_at ??
          file.created_at ??
          new Date().toISOString(),
        path: publicUrl.publicUrl,
      };
    });
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

    const storagePath = `${folder}/${filename}`;

    const { error } = await supabaseAdmin.storage
      .from("media")
      .remove([storagePath]);

    if (error) {
      console.error(
        "Supabase media delete error:",
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
