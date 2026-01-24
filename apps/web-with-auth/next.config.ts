import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages directly from source
  // This eliminates the need to pre-build packages before running the app
  transpilePackages: ["@repo/better-auth-hook", "@repo/better-auth-ui"],
};

export default nextConfig;
