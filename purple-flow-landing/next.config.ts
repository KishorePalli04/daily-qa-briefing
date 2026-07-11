import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project lives inside a larger repo; pin the workspace root to this
  // folder so Turbopack doesn't pick up a parent lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
