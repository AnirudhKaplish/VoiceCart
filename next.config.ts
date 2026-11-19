import type { NextConfig } from "next";

// Static export for GitHub Pages (served from /VoiceCart/)
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/VoiceCart",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
