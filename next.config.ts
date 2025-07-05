import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + "/:path*", // Ajouter le slash
      },
    ];
  },
};

module.exports = nextConfig;
