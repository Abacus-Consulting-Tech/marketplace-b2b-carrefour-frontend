/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cdn.carrefour-b2b.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.carrefour-b2b.com',
      },
    ],
  },
  async rewrites() {
    // Backend URL from environment - defaults to Render DEV
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
                       'https://marketplace-b2b-backend-dev.onrender.com'
    
    // Only enable proxy in development to avoid CORS issues
    // In production, backend must have proper CORS configured
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment) {
      return []
    }

    console.log('🔄 Next.js Proxy enabled for development')
    console.log('📡 Backend URL:', backendUrl)

    return [
      // Auth endpoints
      {
        source: '/backend/auth/:path*',
        destination: `${backendUrl}/auth/:path*`,
      },
      // Store endpoints (products, cart, regions, etc.)
      {
        source: '/backend/store/:path*',
        destination: `${backendUrl}/store/:path*`,
      },
      // Admin endpoints
      {
        source: '/backend/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
      },
      // Vendor/Supplier endpoints
      {
        source: '/backend/vendor/:path*',
        destination: `${backendUrl}/vendor/:path*`,
      },
      // Health check
      {
        source: '/backend/health',
        destination: `${backendUrl}/health`,
      },
    ]
  },
}

module.exports = nextConfig
