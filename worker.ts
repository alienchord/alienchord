import { prismaRequest, type PrismaRequest } from "./src/lib/prisma-request";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore OpenNext generates this module during the Worker build.
import nextWorker from "./.open-next/worker.js";

type WorkerContext = { waitUntil(promise: Promise<unknown>): void };

const worker = {
  async fetch(request: Request, env: CloudflareEnv, ctx: WorkerContext) {
    const scope: PrismaRequest = {};

    return prismaRequest.run(scope, async () => {
      async function disconnect() {
        const client = scope.prisma;
        delete scope.prisma;

        try {
          await client?.$disconnect();
        } catch (error) {
          console.error("Failed to disconnect Prisma after request:", error);
        }
      }

      let response: Response;
      try {
        response = await nextWorker.fetch(request, env, ctx);
      } catch (error) {
        ctx.waitUntil(disconnect());
        throw error;
      }

      if (!response.body) {
        ctx.waitUntil(disconnect());
        return response;
      }

      // Server Components can still query the database while streaming HTML.
      const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
      ctx.waitUntil(response.body.pipeTo(writable).then(disconnect, disconnect));
      return new Response(readable, response);
    });
  },
};

export default worker;
