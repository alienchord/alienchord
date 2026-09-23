import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { Role } from "@/generated/prisma/enums";

function getCountry(request: Request): string {
  const vercelCountry = request.headers.get(
    "x-vercel-ip-country"
  );

  if (vercelCountry) {
    return vercelCountry.toUpperCase();
  }

  const cloudflareCountry = request.headers.get(
    "cf-ipcountry"
  );

  if (
    cloudflareCountry &&
    cloudflareCountry !== "XX"
  ) {
    return cloudflareCountry.toUpperCase();
  }

  return "Unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pagePath =
      typeof body?.path === "string" &&
      body.path.trim()
        ? body.path.trim()
        : "/";

    const visitorId =
      typeof body?.visitorId === "string" &&
      body.visitorId.trim()
        ? body.visitorId.trim()
        : `anonymous-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}`;

    const country = getCountry(request);

    await prisma.analyticsEvent.create({
      data: {
        visitorId,
        type: "pageview",
        path: pagePath,
        country,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Analytics POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save analytics event.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  const access = await requireRole([
    Role.OWNER,
    Role.ADMIN,
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
    const events =
      await prisma.analyticsEvent.findMany({
        orderBy: {
          timestamp: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(
      "Analytics GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics.",
      },
      {
        status: 500,
      }
    );
  }
}