/**
 * Development Proxy Configuration for Next.js
 * Equivalent to Angular's proxy.dev.conf.js
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
                   'https://marketplace-b2b-backend-dev.onrender.com'

const PROXY_CONFIG = {
  // Backend base URL
  backendUrl: BACKEND_URL,
  
  // Enable detailed logging in development
  verbose: true,
  
  // Rewrites configuration (equivalent to Angular's context + target)
  rewrites: [
    // Auth endpoints
    {
      source: '/backend/auth/:path*',
      destination: `${BACKEND_URL}/auth/:path*`,
      description: 'Authentication endpoints',
    },
    // Store endpoints (products, cart, regions, etc.)
    {
      source: '/backend/store/:path*',
      destination: `${BACKEND_URL}/store/:path*`,
      description: 'Store/catalog endpoints',
    },
    // Admin endpoints
    {
      source: '/backend/admin/:path*',
      destination: `${BACKEND_URL}/admin/:path*`,
      description: 'Admin panel endpoints',
    },
    // Vendor/Supplier endpoints
    {
      source: '/backend/vendor/:path*',
      destination: `${BACKEND_URL}/vendor/:path*`,
      description: 'Vendor/supplier endpoints',
    },
    // Health check
    {
      source: '/backend/health',
      destination: `${BACKEND_URL}/health`,
      description: 'Health check endpoint',
    },
  ],
}

module.exports = PROXY_CONFIG
