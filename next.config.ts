import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allowed `quality` values for next/image (Next 16 restricts these). 90 is used for the hero visual.
    qualities: [75, 90],
  },
};

export default nextConfig;
