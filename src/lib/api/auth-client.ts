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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
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

/**
 * Get seller ID from backend for vendor users
 * Required for /vendor/* endpoints
 */
async function fetchSellerIdForVendor(token: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/sellers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.warn('[Auth] Failed to fetch seller info:', response.status)
      return process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID
    }
    
    const data = await response.json()
    return data.seller?.id || data.id
  } catch (error) {
    console.error('[Auth] Error fetching seller ID:', error)
    return process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID
  }
}

/**
 * Login - handles both admin and vendor authentication
 * Automatically selects correct endpoint based on email
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { email, password } = request
  
  // Determine if this is admin or vendor login
  const emailLower = email.toLowerCase()
  const isAdmin = emailLower.includes('admin') || emailLower.includes('acano') || emailLower.includes('carrefour')
  
  // Select endpoint
  const endpoint = isAdmin ? '/auth/user/emailpass' : '/auth/member/emailpass'
  
  console.log(`[Auth] Login attempt for ${email} via ${endpoint}`)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Authentication failed' }))
      throw new Error(error.message || `Login failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.token) {
      throw new Error('No token received from backend')
    }
    
    // Decode JWT to extract claims
    const jwtPayload = decodeJWT(data.token)
    console.log('[Auth] JWT payload:', jwtPayload)
    
    // Determine role
    const role = determineRole(email, jwtPayload?.actor_type)
    
    // For vendor users, fetch seller_id
    let seller_id: string | undefined
    if (role === 'supplier' && jwtPayload?.actor_type === 'member') {
      seller_id = await fetchSellerIdForVendor(data.token)
      console.log('[Auth] Vendor seller_id:', seller_id)
    }
    
    // Construct user object
    const user: User = {
      id: jwtPayload?.actor_id || email,
      email: email,
      name: email.split('@')[0],
      role: role,
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
      token: data.token,
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
 * Vendor: GET /vendor/sellers/me
 */
export async function getUserInfo(token: string, role: 'admin' | 'supplier' | 'franchisee'): Promise<any> {
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
