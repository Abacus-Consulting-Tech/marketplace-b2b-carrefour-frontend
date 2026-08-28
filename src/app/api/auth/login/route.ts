import { NextRequest, NextResponse } from 'next/server'

function decodeJWT(token: string): { actor_id?: string; actor_type?: 'user' | 'member' } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch (error) {
    console.error('[Auth Login API] Failed to decode JWT:', error)
    return null
  }
}

async function fetchSellerId(backendBaseUrl: string, token: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${backendBaseUrl}/vendor/sellers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn('[Auth Login API] Failed to fetch seller info:', response.status)
      return process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID
    }

    const data = await response.json()
    return data.seller?.id || data.id || process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID
  } catch (error) {
    console.error('[Auth Login API] Error fetching seller info:', error)
    return process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID
  }
}

/**
 * Proxy endpoint to bypass CORS restrictions when calling Medusa backend from localhost
 * This proxies POST /api/auth/login to Medusa's /auth/user/emailpass
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
    const emailLower = email.toLowerCase()
    const isSupplier = emailLower.includes('seller') || emailLower.includes('mercur') ||
      emailLower.includes('kickz') || emailLower.includes('trailhead') || emailLower.includes('supplier')
    const authEndpoint = isSupplier ? '/auth/member/emailpass' : '/auth/user/emailpass'

    // API routes run server-side, so we always call the backend directly
    // This API route itself IS the CORS workaround proxy
    const backendUrl = `${backendBaseUrl}${authEndpoint}`
    
    console.log('[Auth Login API] Calling backend:', backendUrl)
    
    // Add timeout to prevent hanging on slow backend (Render free tier may be sleeping)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      console.log('[Auth Login API] Response status:', response.status)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Authentication failed' }))
        console.error('[Auth Login API] Error response:', error)
        return NextResponse.json(
          { message: error.message || 'Authentication failed' },
          { status: response.status }
        )
      }

      const data = await response.json()
      console.log('[Auth Login API] Success, received token:', data.token ? 'yes' : 'no')

      // Medusa only returns { token: "..." }, no user object
      // Deduce role from endpoint/email until backend provides proper user data
      let role: 'admin' | 'supplier' | 'franchisee' = 'franchisee'
      const jwtPayload = decodeJWT(data.token)
      if (isSupplier || jwtPayload?.actor_type === 'member') {
        role = 'supplier'
      } else if (emailLower.includes('admin') || emailLower.includes('acano')) {
        role = 'admin'
      }

      const sellerId = role === 'supplier' ? await fetchSellerId(backendBaseUrl, data.token) : undefined

      const user = {
        id: jwtPayload?.actor_id || email,
        email: email,
        name: email.split('@')[0],
        role: role,
        actor_type: jwtPayload?.actor_type,
        actor_id: jwtPayload?.actor_id,
        seller_id: sellerId,
      }

      console.log('[Auth Login API] Created user object:', { email, role, seller_id: sellerId })

      return NextResponse.json({
        user,
        token: data.token,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if ((fetchError as Error).name === 'AbortError') {
        console.error('[Auth Login API] Request timeout - backend may be sleeping')
        return NextResponse.json(
          { message: 'Backend timeout - el servidor está arrancando (30s). Intenta de nuevo o activa MOCK MODE.' },
          { status: 504 }
        )
      }
      throw fetchError
    }
  } catch (error) {
    const err = error as { message?: string };
    console.error('Auth proxy error:', err)
    return NextResponse.json(
      { message: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
