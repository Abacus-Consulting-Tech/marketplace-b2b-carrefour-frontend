/**
 * Staging Proxy Configuration for Next.js
 * Equivalent to Angular's proxy.staging.conf.js
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
                   'https://marketplace-b2b-backend-staging.onrender.com'

const PROXY_CONFIG = {
  backendUrl: BACKEND_URL,
  verbose: true, // Keep logging in staging for debugging
  
  rewrites: [
    {
      source: '/backend/auth/:path*',
      destination: `${BACKEND_URL}/auth/:path*`,
      description: 'Authentication endpoints (staging)',
    },
    {
      source: '/backend/store/:path*',
      destination: `${BACKEND_URL}/store/:path*`,
      description: 'Store/catalog endpoints (staging)',
    },
    {
      source: '/backend/admin/:path*',
      destination: `${BACKEND_URL}/admin/:path*`,
      description: 'Admin panel endpoints (staging)',
    },
    {
      source: '/backend/vendor/:path*',
      destination: `${BACKEND_URL}/vendor/:path*`,
      description: 'Vendor/supplier endpoints (staging)',
    },
    {
      source: '/backend/health',
      destination: `${BACKEND_URL}/health`,
      description: 'Health check endpoint (staging)',
    },
  ],
}

module.exports = PROXY_CONFIG
