import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/km',
        destination: '/',
      },
      {
        source: '/en',
        destination: '/',
      },
      {
        source: '/km/:path*',
        destination: '/:path*',
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
