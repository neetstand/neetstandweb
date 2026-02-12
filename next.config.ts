import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    adminControlledYear: {
      stale: 31536000,
      revalidate: 31536000,
      expire: 34020000,
    }
  }
  /* config options here */
};

export default nextConfig;
