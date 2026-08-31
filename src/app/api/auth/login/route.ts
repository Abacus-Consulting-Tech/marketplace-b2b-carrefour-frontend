import { NextRequest, NextResponse } from 'next/server'

type LoginRole = 'admin' | 'supplier' | 'franchisee'

interface ProxyLoginUser {
  id?: string
  email?: string
  name?: string
  role?: LoginRole
  seller_id?: string
}

interface ProxyLoginPayload {
  token?: string
  user?: ProxyLoginUser
  message?: string
}

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
  const defaultSellerId = process.env.NEXT_PUBLIC_DEFAULT_SELLER_ID

  try {
    const response = await fetch(`${backendBaseUrl}/vendor/sellers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(defaultSellerId ? { 'x-seller-id': defaultSellerId } : {}),
      },
    })

    if (!response.ok) {
      console.warn('[Auth Login API] Failed to fetch seller info:', response.status)
      return defaultSellerId
    }

    const data = await response.json()
    return data.seller?.id || data.id || defaultSellerId
  } catch (error) {
    console.error('[Auth Login API] Error fetching seller info:', error)
    return defaultSellerId
  }
}

function inferRoleFromEmail(email: string, actorType?: 'user' | 'member', fallbackRole?: string): LoginRole {
  if (fallbackRole === 'admin' || fallbackRole === 'supplier' || fallbackRole === 'franchisee') {
    return fallbackRole
  }

  const emailLower = email.toLowerCase()

  if (actorType === 'member' || emailLower.includes('seller') || emailLower.includes('mercur') || emailLower.includes('kickz') || emailLower.includes('trailhead') || emailLower.includes('supplier')) {
    return 'supplier'
  }

  if (emailLower.includes('admin') || emailLower.includes('acano')) {
    return 'admin'
  }

  return 'franchisee'
}

async function attemptLogin(
  backendBaseUrl: string,
  endpoint: string,
  email: string,
  password: string,
  controller: AbortController
): Promise<{ response: Response; data: ProxyLoginPayload }> {
  const response = await fetch(`${backendBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    signal: controller.signal,
  })

  const raw = await response.json().catch(() => ({})) as Record<string, any>
  const data = (raw.data && typeof raw.data === 'object' ? raw.data : raw) as ProxyLoginPayload

  return { response, data }
}

/**
 * Proxy endpoint to bypass CORS restrictions when calling the backend from localhost.
 * It prefers the documented /auth/login contract and falls back to legacy role-specific endpoints.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
    const emailLower = email.toLowerCase()
    const isSupplier = emailLower.includes('seller') || emailLower.includes('mercur') ||
      emailLower.includes('kickz') || emailLower.includes('trailhead') || emailLower.includes('supplier')

    // Add timeout to prevent hanging on slow backend (Render free tier may be sleeping)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    try {
      const attempts = [
        '/auth/login',
        isSupplier ? '/auth/member/emailpass' : '/auth/user/emailpass',
      ]

      let loginResponse: Response | null = null
      let loginData: ProxyLoginPayload | null = null

      for (const endpoint of attempts) {
        console.log('[Auth Login API] Calling backend:', `${backendBaseUrl}${endpoint}`)
        const result = await attemptLogin(backendBaseUrl, endpoint, email, password, controller)

        if (result.response.ok) {
          const candidateToken = result.data.token
          const jwtPayload = candidateToken ? decodeJWT(candidateToken) : null

          if (isSupplier && endpoint === '/auth/login' && jwtPayload?.actor_type !== 'member') {
            console.warn('[Auth Login API] Unified supplier login returned non-member token, falling back')
            continue
          }

          loginResponse = result.response
          loginData = result.data
          break
        }

        if (endpoint !== '/auth/login') {
          clearTimeout(timeoutId)
          console.error('[Auth Login API] Error response:', result.data)
          return NextResponse.json(
            { message: result.data.message || 'Authentication failed' },
            { status: result.response.status }
          )
        }

        if (result.response.status !== 404 && result.response.status !== 405) {
          clearTimeout(timeoutId)
          console.error('[Auth Login API] Error response:', result.data)
          return NextResponse.json(
            { message: result.data.message || 'Authentication failed' },
            { status: result.response.status }
          )
        }
      }

      clearTimeout(timeoutId)

      if (!loginResponse?.ok || !loginData?.token) {
        return NextResponse.json(
          { message: loginData?.message || 'Authentication failed' },
          { status: loginResponse?.status || 401 }
        )
      }

      console.log('[Auth Login API] Success, received token:', loginData.token ? 'yes' : 'no')

      const jwtPayload = decodeJWT(loginData.token)
      const role = inferRoleFromEmail(email, jwtPayload?.actor_type, loginData.user?.role)

      const sellerId = role === 'supplier'
        ? loginData.user?.seller_id || await fetchSellerId(backendBaseUrl, loginData.token)
        : undefined

      const user = {
        id: loginData.user?.id || jwtPayload?.actor_id || email,
        email: loginData.user?.email || email,
        name: loginData.user?.name || email.split('@')[0],
        role,
        actor_type: jwtPayload?.actor_type,
        actor_id: jwtPayload?.actor_id,
        seller_id: sellerId,
      }

      console.log('[Auth Login API] Created user object:', { email, role, seller_id: sellerId })

      return NextResponse.json({
        user,
        token: loginData.token,
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
