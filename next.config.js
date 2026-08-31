/** @type {import('next').NextConfig} */

// Load proxy configuration based on environment
const getProxyConfig = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development'
  
  let proxyConfig
  switch (env) {
    case 'production':
      proxyConfig = require('./proxy.prod.conf.js')
      break
    case 'staging':
      proxyConfig = require('./proxy.staging.conf.js')
      break
    case 'development':
    default:
      proxyConfig = require('./proxy.dev.conf.js')
      break
  }
  
  if (proxyConfig.verbose) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔄 Next.js Proxy Configuration')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📡 Environment:', env)
    console.log('🌐 Backend URL:', proxyConfig.backendUrl)
    console.log('🔀 Rewrites:', proxyConfig.rewrites.length, 'routes')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (proxyConfig.rewrites.length > 0) {
      proxyConfig.rewrites.forEach(({ source, description }) => {
        console.log(`  ✓ ${source.padEnd(30)} → ${description}`)
      })
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
  }
  
  return proxyConfig
}

const proxyConfig = getProxyConfig()

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    // Return rewrites from environment-specific config
    return proxyConfig.rewrites.map(({ source, destination }) => ({
      source,
      destination,
    }))
  },
}

module.exports = nextConfig
