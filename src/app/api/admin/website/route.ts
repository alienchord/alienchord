import { NextResponse } from "next/server";
import {
  getSiteContent,
  saveSiteContent,
} from "@/lib/site-content";
import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();

    return NextResponse.json(
      {
        success: true,
        content,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/admin/website error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get website content.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
      { status: access.status }
    );
  }

  try {
    const body = await request.json();

    if (!body?.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Content is required.",
        },
        { status: 400 }
      );
    }

    await saveSiteContent(body.content);

    return NextResponse.json(
      {
        success: true,
        content: body.content,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("PUT /api/admin/website error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save website content.",
      },
      { status: 500 }
    );
  }
}