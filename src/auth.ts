import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return false;
      }

      if (!user.email) {
        return false;
      }

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

      if (!existingUser) {
        return false;
      }

      return true;
    },

    async session({ session, user }) {
      if (!session.user?.email) {
        return session;
      }

      const dbUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

      if (!dbUser) {
        return session;
      }

      const verifiedSession =
        await prisma.session.findFirst({
          where: {
            userId: dbUser.id,
            expires: {
              gt: new Date(),
            },
          },
          orderBy: {
            expires: "desc",
          },
        });

      return {
        ...session,

        user: {
          ...session.user,
          role: dbUser.role,
        },

        passwordVerified:
          verifiedSession?.passwordVerified ?? false,
      };
    },
  },
});