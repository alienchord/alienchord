import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const currentUser = await getPrisma().user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    if (currentUser.role !== Role.OWNER) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden.",
        },
        { status: 403 }
      );
    }

    const users = await getPrisma().user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        googleVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/users error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load users.",
      },
      { status: 500 }
    );
  }
}