/**
 * Auth API Client
 * 
 * Handles authentication for admin and vendor/supplier users
 * Integrates with Render DEV backend validated endpoints
 * 
 * Backend endpoints:
 * - Admin: POST /auth/user/emailpass
 * - Vendor: POST /auth/member/emailpass
 * 
 * JWT structure includes:
 * - actor_type: 'user' (admin) | 'member' (vendor)
 * - actor_id: User or member ID
 */

import type { User } from '@/types'
import { getBackendBaseUrl } from './api-utils'

const API_BASE_URL = getBackendBaseUrl('/backend')

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

interface BackendLoginUser {
  id?: string
  email?: string
  name?: string
  role?: 'admin' | 'supplier' | 'franchisee'
  seller_id?: string
}

interface BackendLoginPayload {
  token?: string
  user?: BackendLoginUser
  message?: string
}

export interface JWTPayload {
  actor_type: 'user' | 'member'
  actor_id: string
  email?: string
  iat?: number
  exp?: number
}

/**
 * Decode JWT without verification (for client-side inspection only)
 * NOT for security validation - backend must validate tokens
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Determine user role from email and JWT claims
 */
function determineRole(email: string, actorType?: 'user' | 'member'): 'admin' | 'supplier' | 'franchisee' {
  // If JWT provides actor_type, use it
  if (actorType === 'user') return 'admin'
  if (actorType === 'member') return 'supplier'
  
  // Fallback to email-based detection
  const emailLower = email.toLowerCase()
  if (emailLower.includes('admin') || emailLower.includes('acano')) {
    return 'admin'
  } else if (emailLower.includes('seller') || emailLower.includes('mercur') || 
             emailLower.includes('kickz') || emailLower.includes('trailhead')) {
    return 'supplier'
  }
  
  return 'franchisee'
}

async function attemptLogin(
  endpoint: string,
  email: string,
  password: string,
  controller: AbortController
): Promise<{ response: Response; data: BackendLoginPayload }> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    signal: controller.signal,
  })

  const raw = await response.json().catch(() => ({})) as Record<string, unknown>
  const nested = raw.data
  const data = (nested && typeof nested === 'object' ? nested : raw) as BackendLoginPayload

  return { response, data }
}

/**
 * Get seller ID from backend for vendor users
 * Required for /vendor/* endpoints
 */
async function fetchSellerIdForVendor(token: string): Promise<string | undefined> {
  const defaultSellerId = process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID

  try {
    const response = await fetch(`${API_BASE_URL}/vendor/sellers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(defaultSellerId ? { 'x-seller-id': defaultSellerId } : {}),
      },
    })
    
    if (!response.ok) {
      console.warn('[Auth] Failed to fetch seller info:', response.status)
      return defaultSellerId
    }
    
    const data = await response.json()
    return data.seller?.id || data.id || defaultSellerId
  } catch (error) {
    console.error('[Auth] Error fetching seller ID:', error)
    return defaultSellerId
  }
}

/**
 * Login with unified contract and legacy fallback.
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { email, password } = request
  
  const emailLower = email.toLowerCase()
  const isSupplier = emailLower.includes('seller') || emailLower.includes('mercur') ||
    emailLower.includes('kickz') || emailLower.includes('trailhead') || emailLower.includes('supplier')
  
  console.log(`[Auth] Login attempt for ${email}`)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
  
  try {
    const attempts = ['/auth/login', isSupplier ? '/auth/member/emailpass' : '/auth/user/emailpass']

    let loginData: BackendLoginPayload | null = null
    let loginStatus = 0

    for (const endpoint of attempts) {
      console.log(`[Auth] Trying ${endpoint}`)
      const { response, data } = await attemptLogin(endpoint, email, password, controller)

      if (response.ok) {
        const jwtPayload = data.token ? decodeJWT(data.token) : null

        if (isSupplier && endpoint === '/auth/login' && jwtPayload?.actor_type !== 'member') {
          console.warn('[Auth] Unified supplier login returned non-member token, falling back')
          continue
        }

        loginData = data
        loginStatus = response.status
        break
      }

      if (endpoint !== '/auth/login' || (response.status !== 404 && response.status !== 405)) {
        clearTimeout(timeoutId)
        throw new Error(data.message || `Login failed: ${response.status}`)
      }
    }

    clearTimeout(timeoutId)

    if (!loginData?.token) {
      throw new Error(loginData?.message || `Login failed: ${loginStatus || 401}`)
    }
    
    const jwtPayload = decodeJWT(loginData.token)
    console.log('[Auth] JWT payload:', jwtPayload)
    
    const role = loginData.user?.role || determineRole(email, jwtPayload?.actor_type)
    
    let seller_id: string | undefined
    if (role === 'supplier') {
      seller_id = loginData.user?.seller_id || await fetchSellerIdForVendor(loginData.token)
      console.log('[Auth] Vendor seller_id:', seller_id)
    }
    
    const user: User = {
      id: loginData.user?.id || jwtPayload?.actor_id || email,
      email: loginData.user?.email || email,
      name: loginData.user?.name || email.split('@')[0],
      role,
      phone: '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actor_type: jwtPayload?.actor_type,
      actor_id: jwtPayload?.actor_id,
      seller_id: seller_id,
    }
    
    console.log('[Auth] Login successful:', { email, role, actor_type: user.actor_type, seller_id: user.seller_id })
    
    return {
      user,
      token: loginData.token,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Backend timeout - servidor arrancando (30s). Intenta de nuevo.')
    }
    
    throw error
  }
}

/**
 * Logout - clear session on backend
 */
export async function logout(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/session`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error('[Auth] Logout error:', error)
    // Continue anyway - clear client state regardless
  }
}

/**
 * Get current session - verify token is still valid
 */
export async function getSession(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    return response.ok
  } catch (error) {
    console.error('[Auth] Session check error:', error)
    return false
  }
}

/**
 * Get user info from backend
 * Admin: GET /admin/users/me
 * Supplier: GET /vendor/sellers/me
 */
interface BackendUserInfoResponse {
  seller?: {
    id?: string
    email?: string
    name?: string
  }
  id?: string
  email?: string
  first_name?: string
  last_name?: string
  name?: string
  role?: string
}

export async function getUserInfo(
  token: string,
  role: 'admin' | 'supplier' | 'franchisee'
): Promise<BackendUserInfoResponse> {
  try {
    const endpoint = role === 'admin' ? '/admin/users/me' : '/vendor/sellers/me'
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('[Auth] Get user info error:', error)
    throw error
  }
}
