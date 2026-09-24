import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allowed `quality` values for next/image (Next 16 restricts these): hero 90, founder 88.
    qualities: [75, 88, 90],
  },
  /**
   * `next dev` blocks its own JS/HMR resources for any origin other than localhost,
   * so a phone on the LAN (http://192.168.x.x:3000) received the HTML but never the
   * client bundle: no hydration, no strip centring, native form posts. Allow the
   * private ranges so LAN testing works in dev. Production builds are unaffected.
   */
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;
