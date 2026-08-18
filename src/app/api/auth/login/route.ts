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
    // Create a minimal user object from the email
    // Set role as "franchisee" by default for marketplace access
    const user = {
      id: email, // Use email as ID until we have a proper user endpoint
      email: email,
      name: email.split('@')[0], // Use email prefix as name
      role: 'franchisee', // Default to franchisee for marketplace access
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
