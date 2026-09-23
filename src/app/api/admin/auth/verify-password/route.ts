import { NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function hashPassword(password: string, salt: string) {
  return crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
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

    const body = await request.json();

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is required.",
        },
        { status: 400 }
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

    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is not configured.",
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
      password,
      storedHash,
      salt
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password.",
        },
        { status: 401 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: {
        expires: "desc",
      },
    });

    const currentSession = sessions[0];

    if (!currentSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Active session not found.",
        },
        { status: 401 }
      );
    }

    await prisma.session.update({
      where: {
        id: currentSession.id,
      },
      data: {
        passwordVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Password verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify password.",
      },
      { status: 500 }
    );
  }
}