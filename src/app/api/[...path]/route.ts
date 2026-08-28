import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
const PROXIED_HEADERS = [
  'authorization',
  'content-type',
  'x-seller-id',
  'x-publishable-api-key',
]

async function proxyRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const backendPath = params.path.join('/')
  const search = request.nextUrl.search
  const backendUrl = `${BACKEND_API_URL}/${backendPath}${search}`

  const headers = new Headers()
  PROXIED_HEADERS.forEach((headerName) => {
    const value = request.headers.get(headerName)
    if (value) {
      headers.set(headerName, value)
    }
  })

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.text() : undefined

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    })

    const responseBody = await response.text()
    const contentType = response.headers.get('content-type')

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: contentType ? { 'content-type': contentType } : undefined,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend proxy error'
    console.error(`[API Proxy] ${request.method} /${backendPath} failed:`, error)

    return NextResponse.json({ message }, { status: 502 })
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PATCH = proxyRequest
export const PUT = proxyRequest
export const DELETE = proxyRequest