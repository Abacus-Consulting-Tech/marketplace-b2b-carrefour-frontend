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

    // Medusa only returns { token: "..." }, no user object
    // Deduce role from email until backend provides proper user data
    let role: 'admin' | 'supplier' | 'franchisee' = 'franchisee'
    
    const emailLower = email.toLowerCase()
    if (emailLower.includes('admin') || emailLower.includes('acano')) {
      role = 'admin'
    } else if (emailLower.includes('seller') || emailLower.includes('mercur') || 
               emailLower.includes('kickz') || emailLower.includes('trailhead')) {
      role = 'supplier'
    }

    const user = {
      id: email,
      email: email,
      name: email.split('@')[0],
      role: role,
    }

    return NextResponse.json({
      user,
      token: data.token,
    })
  } catch (error: any) {
    console.error('Auth proxy error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
