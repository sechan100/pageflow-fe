import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // proxy 설정
  async rewrites() {
    return [
      {
        source: `${process.env.NEXT_PUBLIC_PROXY_PREFIX}/:path*`,
        destination: `${process.env.API_HOST}/:path*`,
      },
    ];
  },

  images: {
    domains: ['localhost'],
  },

  reactStrictMode: true,

};

export default nextConfig;