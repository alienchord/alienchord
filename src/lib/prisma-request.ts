import { AsyncLocalStorage } from "node:async_hooks";
import type { PrismaClient } from "@prisma/client";

export type PrismaRequest = { prisma?: PrismaClient };

const requestKey = Symbol.for("alienchord.prismaRequest");
const workerGlobal = globalThis as typeof globalThis & {
  [requestKey]?: AsyncLocalStorage<PrismaRequest>;
};

// Wrangler bundles the Worker entry and the Next server separately.
export const prismaRequest = workerGlobal[requestKey] ??=
  new AsyncLocalStorage<PrismaRequest>();
