import { NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

function hashPassword(password: string, salt: string) {
  return crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
}

function createPasswordData(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  return {
    passwordHash: hashPassword(password, salt),
    salt,
  };
}

function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
) {
  const hash = hashPassword(password, salt);

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

export async function POST(request: Request) {
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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    if (user.role !== Role.OWNER) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body?.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : "";

    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "New password is required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error:
            "New password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "Current password is required.",
          },
          { status: 400 }
        );
      }

      const passwordParts = user.passwordHash.split(":");

      if (passwordParts.length !== 2) {
        return NextResponse.json(
          {
            success: false,
            error: "Stored password data is invalid.",
          },
          { status: 500 }
        );
      }

      const [salt, storedHash] = passwordParts;

      const isValid = verifyPassword(
        currentPassword,
        storedHash,
        salt
      );

      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            error: "Current password is incorrect.",
          },
          { status: 401 }
        );
      }
    }

    const passwordData = createPasswordData(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash:
          passwordData.salt +
          ":" +
          passwordData.passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Password change error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to change password.",
      },
      { status: 500 }
    );
  }
}