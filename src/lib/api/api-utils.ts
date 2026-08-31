/**
 * API Request Utilities
 * 
 * Common helpers for making API requests to Render DEV backend
 * Handles authentication headers, vendor seller-id, and error handling
 */

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY || ''

function getApiBaseUrl(): string {
  return typeof window !== 'undefined' ? '/api' : BACKEND_API_URL
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth-token') || null
}

/**
 * Get seller ID from auth store
 * Required for /vendor/* endpoints
 */
export function getSellerIdFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    
    const { state } = JSON.parse(authStorage)
    return state?.user?.seller_id || process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID || null
  } catch (error) {
    console.error('Failed to get seller ID from storage:', error)
    return process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID || null
  }
}

/**
 * Create headers for API requests
 * Automatically adds:
 * - Authorization: Bearer token (if available)
 * - x-seller-id (for vendor endpoints, if sellerId provided or in storage)
 * - x-publishable-api-key (for store endpoints if isStore=true)
 */
export interface CreateHeadersOptions {
  sellerId?: string | null  // Override seller ID
  isStore?: boolean  // Is this a /store/* endpoint?
  additionalHeaders?: Record<string, string>
}

export function createApiHeaders(options: CreateHeadersOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add auth token
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Add seller ID for vendor requests
  if (options.sellerId !== undefined) {
    if (options.sellerId) {
      headers['x-seller-id'] = options.sellerId
    }
  } else {
    // Auto-detect from storage
    const sellerId = getSellerIdFromStorage()
    if (sellerId) {
      headers['x-seller-id'] = sellerId
    }
  }
  
  // Add publishable key for store requests
  if (options.isStore && PUBLISHABLE_API_KEY) {
    headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
  }
  
  // Merge additional headers
  if (options.additionalHeaders) {
    Object.assign(headers, options.additionalHeaders)
  }
  
  return headers
}

/**
 * Generic API request handler with error handling
 */
export interface ApiRequestOptions extends RequestInit {
  sellerId?: string | null
  isStore?: boolean
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { sellerId, isStore, ...fetchOptions } = options
  
  const url = `${getApiBaseUrl()}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...createApiHeaders({ sellerId, isStore }),
        ...fetchOptions.headers,
      },
    })
    
    // Let the current page handle data authorization errors without destroying the session.
    if (response.status === 401) {
      throw new Error('No autorizado para consultar este recurso.')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }
    
    // Handle empty responses (204 No Content, etc.)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }
    
    return await response.json()
  } catch (error) {
    console.error(`[API] Request to ${endpoint} failed:`, error)
    throw error
  }
}

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Log API mode for debugging
 */
export function logApiMode(moduleName: string, isMock: boolean, backendReady = false) {
  if (typeof window !== 'undefined') {
    console.log(
      `${isMock ? '🎭' : '🌐'} ${moduleName} API Mode: ${isMock ? 'MOCK' : 'REAL'}`,
      `(Backend Ready: ${backendReady ? 'Yes ✅' : 'No ⏳'})`
    )
  }
}
