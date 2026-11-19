import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { prismaRequest } from "./prisma-request";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

let nodePrisma: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      connectionTimeoutMillis: 5_000,
    }),
  });
}

export function getPrisma() {
  const request = prismaRequest.getStore();
  if (request) {
    return request.prisma ??= createPrismaClient();
  }

  if (process.env.NODE_ENV !== "production") {
    return globalForPrisma.prisma ??= createPrismaClient();
  }

  return nodePrisma ??= createPrismaClient();
}
