import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy endpoint to bypass CORS restrictions when calling Medusa backend from localhost
 * This proxies POST /api/auth/login to Medusa's /auth/user/emailpass
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
    
    const response = await fetch(`${backendUrl}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Authentication failed' }))
      return NextResponse.json(
        { message: error.message || 'Authentication failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Map Medusa user response to frontend format
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email,
      role: data.user.metadata?.role || 'customer',
      company: data.user.metadata?.company_name,
    }

    return NextResponse.json({
      user,
      token: 'medusa-session', // Session managed by httpOnly cookies
    })
  } catch (error: any) {
    console.error('Auth proxy error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
