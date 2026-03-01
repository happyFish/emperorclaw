import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["argon2", "drizzle-orm"],
};

export default nextConfig;
