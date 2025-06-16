import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://test-fe.mysellerpintar.com/:path*',
      },
    ]
  }, 
  images: {
    loader: 'custom',
    domains: [],
  },
}

export default nextConfig
