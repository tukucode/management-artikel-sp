import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: '/api/proxy/:slug*',
      },
    ]
  }, 
  images: {
    domains: ['s3.sellerpintar.com'],
  },
}

export default nextConfig
