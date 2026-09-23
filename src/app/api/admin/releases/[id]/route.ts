import { NextResponse } from "next/server";
import {
getAdminReleases,
getReleaseById,
saveAdminReleases,
type AdminRelease,
} from "@/lib/releases";
import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

type RouteContext = {
params: Promise<{
id: string;
}>;
};

export async function GET(
_request: Request,
context: RouteContext
) {
try {
const { id } = await context.params;

const release = await getReleaseById(id);

if (!release) {
  return NextResponse.json(
    { error: "Release not found." },
    { status: 404 }
  );
}

return NextResponse.json({
  success: true,
  release,
});

} catch (error) {
console.error("Get release error:", error);

return NextResponse.json(
  { error: "Failed to get release." },
  { status: 500 }
);

}
}

export async function PUT(
request: Request,
context: RouteContext
) {
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
const { id } = await context.params;
const body = await request.json();

if (!body.title || !body.releaseDate) {
  return NextResponse.json(
    {
      error: "Title and release date are required.",
    },
    { status: 400 }
  );
}

const currentRelease = await getReleaseById(id);

if (!currentRelease) {
  return NextResponse.json(
    { error: "Release not found." },
    { status: 404 }
  );
}

const adminReleases = await getAdminReleases();

const updatedRelease: AdminRelease = {
  id,
  title: body.title,
  type: body.type || currentRelease.type || "single",
  releaseDate: body.releaseDate,
  cover: body.cover ?? currentRelease.cover ?? "",
  audio: body.audio ?? currentRelease.audio ?? "",

  description: {
    en:
      body.description?.en ??
      currentRelease.description?.en ??
      "",
    ru:
      body.description?.ru ??
      currentRelease.description?.ru ??
      "",
  },

  tracks: Array.isArray(body.tracks)
    ? body.tracks
    : currentRelease.tracks || [],

  links: {
    spotify:
      body.links?.spotify ??
      currentRelease.links?.spotify ??
      "",

    appleMusic:
      body.links?.appleMusic ??
      currentRelease.links?.appleMusic ??
      "",

    yandexMusic:
      body.links?.yandexMusic ??
      currentRelease.links?.yandexMusic ??
      "",

    youtube:
      body.links?.youtube ??
      currentRelease.links?.youtube ??
      "",

    soundcloud:
      body.links?.soundcloud ??
      currentRelease.links?.soundcloud ??
      "",
  },
};

const existingIndex = adminReleases.findIndex(
  (release) => release.id === id
);

if (existingIndex >= 0) {
  adminReleases[existingIndex] = updatedRelease;
} else {
  adminReleases.push(updatedRelease);
}

await saveAdminReleases(adminReleases);

return NextResponse.json({
  success: true,
  release: updatedRelease,
});

} catch (error) {
console.error("Update release error:", error);

return NextResponse.json(
  { error: "Failed to update release." },
  { status: 500 }
);

}
}

export async function DELETE(
_request: Request,
context: RouteContext
) {
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
const { id } = await context.params;

const adminReleases = await getAdminReleases();

const nextReleases = adminReleases.filter(
  (release) => release.id !== id
);

if (nextReleases.length === adminReleases.length) {
  return NextResponse.json(
    { error: "Release not found in admin data." },
    { status: 404 }
  );
}

await saveAdminReleases(nextReleases);

return NextResponse.json({
  success: true,
});

} catch (error) {
console.error("Delete release error:", error);

return NextResponse.json(
  { error: "Failed to delete release." },
  { status: 500 }
);

}
}