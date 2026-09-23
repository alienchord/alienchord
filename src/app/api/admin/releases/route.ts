import { NextResponse } from "next/server";
import {
  getAdminReleases,
  saveAdminReleases,
  type AdminRelease,
} from "@/lib/releases";
import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

export async function GET() {
  try {
    const releases = await getAdminReleases();

    return NextResponse.json({
      success: true,
      releases,
    });
  } catch (error) {
    console.error("Get releases error:", error);

    return NextResponse.json(
      { error: "Failed to get releases." },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();

    if (!body.id || !body.title || !body.releaseDate) {
      return NextResponse.json(
        {
          error: "ID, title and release date are required.",
        },
        { status: 400 }
      );
    }

    const releases = await getAdminReleases();

    const existingRelease = releases.find(
      (release) => release.id === body.id
    );

    if (existingRelease) {
      return NextResponse.json(
        {
          error: "A release with this ID already exists.",
        },
        { status: 409 }
      );
    }

    const newRelease: AdminRelease = {
      id: body.id,
      title: body.title,
      type: body.type || "single",
      releaseDate: body.releaseDate,
      cover: body.cover || "",
      audio: body.audio || "",

      description: {
        en: body.description?.en || "",
        ru: body.description?.ru || "",
      },

      tracks: Array.isArray(body.tracks)
        ? body.tracks
        : [],

      links: {
        spotify: body.links?.spotify || "",
        appleMusic: body.links?.appleMusic || "",
        yandexMusic: body.links?.yandexMusic || "",
        youtube: body.links?.youtube || "",
        soundcloud: body.links?.soundcloud || "",
      },
    };

    releases.push(newRelease);

    await saveAdminReleases(releases);

    return NextResponse.json({
      success: true,
      release: newRelease,
    });
  } catch (error) {
    console.error("Create release error:", error);

    return NextResponse.json(
      { error: "Failed to create release." },
      { status: 500 }
    );
  }
}