import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for admin orders
 * Proxies GET /api/admin/orders to Medusa's /admin/orders
 */
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com';
    const endpoint = `${backendUrl}/admin/orders`;
    
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    
    console.log('[Admin Orders API] Calling backend:', endpoint);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { 'Authorization': authHeader } : {}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('[Admin Orders API] Response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch orders' }));
        console.error('[Admin Orders API] Error response:', error);
        return NextResponse.json(
          { message: error.message || 'Failed to fetch orders', orders: [] },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('[Admin Orders API] Success, orders count:', data.orders?.length || 0);

      return NextResponse.json(data);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('[Admin Orders API] Request timeout');
        return NextResponse.json(
          { message: 'Request timeout - backend may be waking up', orders: [] },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error('[Admin Orders API] Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', orders: [] },
      { status: 500 }
    );
  }
}
