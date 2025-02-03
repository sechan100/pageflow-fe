import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async rewrites() { // proxy 설정
    return [
      {
        source: `${process.env.NEXT_PUBLIC_PROXY_PREFIX}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/:path*`,
      },
    ];
  },

  images: {
    domains: ['localhost', 'test.com'], // 이미지 도메인
  },

  reactStrictMode: false, // 리액트 엄격 모드

};

export default nextConfig;
