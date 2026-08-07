import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/car-accident/:market',
        destination: '/lp/counsel/ga/:market',
      },
    ];
  },
};

export default nextConfig;
