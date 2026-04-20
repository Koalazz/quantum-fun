import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve under /quantum so Traefik can route by path prefix on fun-days.robbingdahood.fyi
  basePath: "/quantum",
  // Expose basePath to client code for raw URLs (EventSource, fetch)
  env: {
    NEXT_PUBLIC_BASE_PATH: "/quantum",
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "*": ["quantum/**"],
  },
};

export default nextConfig;
