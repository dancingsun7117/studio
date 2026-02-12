import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // 👈 ADD THIS LINE

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
    loader: "default",
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
