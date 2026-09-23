import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized.",
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: "User not found.",
      user: null,
    };
  }

  if (user.role === Role.VIEWER) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden.",
      user: null,
    };
  }

  const activeSession =
    await prisma.session.findFirst({
      where: {
        userId: user.id,
        expires: {
          gt: new Date(),
        },
        passwordVerified: true,
      },
      orderBy: {
        expires: "desc",
      },
    });

  if (!activeSession) {
    return {
      authorized: false,
      status: 401,
      error: "Password verification required.",
      user: null,
    };
  }

  return {
    authorized: true,
    status: 200,
    error: null,
    user,
  };
}

export async function requireRole(
  allowedRoles: Role[]
) {
  const result = await requireAdmin();

  if (!result.authorized || !result.user) {
    return result;
  }

  if (!allowedRoles.includes(result.user.role)) {
    return {
      authorized: false,
      status: 403,
      error: "You do not have permission to perform this action.",
      user: null,
    };
  }

  return result;
}