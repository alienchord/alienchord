import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let OpenNext resolve Prisma's workerd entry point when bundling the Worker.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  outputFileTracingIncludes: {
    "**/*": [
      "./node_modules/pg-cloudflare/dist/**",
      "./node_modules/pg-cloudflare/esm/**",
    ],
  },
};

export default nextConfig;
