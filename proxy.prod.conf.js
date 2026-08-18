/**
 * Production Proxy Configuration for Next.js
 * Equivalent to Angular's proxy.prod.conf.js
 * 
 * NOTE: In production, proxy is typically DISABLED
 * Frontend should call backend directly with CORS properly configured
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
                   'https://marketplace-b2b-backend.carrefour.com'

const PROXY_CONFIG = {
  backendUrl: BACKEND_URL,
  verbose: false, // Less verbose in production
  
  // Empty rewrites - production should use direct calls with CORS
  rewrites: [],
  
  // Production uses direct backend calls
  // CORS must be configured on backend with frontend domain
}

module.exports = PROXY_CONFIG
