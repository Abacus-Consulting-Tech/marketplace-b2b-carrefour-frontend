/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cdn.carrefour-b2b.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.carrefour-b2b.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: apiUrl + '/:path*',
      },
    ]
  },
}

module.exports = nextConfig
