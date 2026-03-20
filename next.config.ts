import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'killerplayer.com' },
      { protocol: 'https', hostname: 'youtu.be' },
      { protocol: 'https', hostname: 'youtube.com' },
      { protocol: 'https', hostname: 'www.youtube.com' }
    ]
  },
  cacheComponents: true,
  cacheLife: {
    adminControlledYear: {
      stale: 31536000,
      revalidate: 31536000,
      expire: 34020000,
    }
  }
};

export default nextConfig;
