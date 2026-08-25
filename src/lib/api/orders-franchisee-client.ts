/**
 * Franchisee Orders API Client
 * 
 * Cliente API para gestión de pedidos del franquiciado
 * Soporta modo mock y real API según feature flags
 */

import { featureFlags } from '@/config/feature-flags'
import {
  FranchiseeOrder,
  OrderSearchParams,
  GetOrdersResponse,
  GetOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  OrderStats
} from '@/types/orders-franchisee'
import {
  mockFranchiseeOrders,
  getMockOrderById,
  getMockOrdersByStatus,
  getMockOrderStats
} from './orders-franchisee-mock'

// ============================================================================
// Mock API Functions
// ============================================================================

async function mockGetOrders(params: OrderSearchParams = {}): Promise<GetOrdersResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = [...mockFranchiseeOrders]
  
  // Apply filters
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    filtered = filtered.filter(order => statuses.includes(order.status))
  }
  
  if (params.supplier_id) {
    filtered = filtered.filter(order => order.supplier_id === params.supplier_id)
  }
  
  if (params.date_from) {
    filtered = filtered.filter(order => order.created_at >= params.date_from!)
  }
  
  if (params.date_to) {
    filtered = filtered.filter(order => order.created_at <= params.date_to!)
  }
  
  if (params.min_amount) {
    filtered = filtered.filter(order => order.total >= params.min_amount!)
  }
  
  if (params.max_amount) {
    filtered = filtered.filter(order => order.total <= params.max_amount!)
  }
  
  // Apply search
  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.display_id.toLowerCase().includes(search) ||
      order.supplier_name.toLowerCase().includes(search) ||
      order.items.some(item => item.title.toLowerCase().includes(search))
    )
  }
  
  // Apply sorting
  const sortBy = params.sort_by || 'created_at'
  const sortOrder = params.sort_order || 'desc'
  
  filtered.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'total':
        comparison = a.total - b.total
        break
      case 'display_id':
        comparison = a.display_id.localeCompare(b.display_id)
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  // Pagination
  const page = params.page || 1
  const limit = params.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginated = filtered.slice(startIndex, endIndex)
  
  return {
    orders: paginated,
    count: paginated.length,
    total: filtered.length,
    page,
    limit
  }
}

async function mockGetOrderById(id: string): Promise<GetOrderResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const order = getMockOrderById(id)
  
  if (!order) {
    throw new Error(`Pedido no encontrado: ${id}`)
  }
  
  return { order }
}

async function mockCancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const order = getMockOrderById(request.order_id)
  
  if (!order) {
    throw new Error(`Pedido no encontrado: ${request.order_id}`)
  }
  
  if (!order.can_cancel) {
    throw new Error('Este pedido ya no se puede cancelar')
  }
  
  // Update order status (in mock mode, this is in-memory only)
  order.status = 'cancelled'
  order.cancelled_at = new Date().toISOString()
  order.updated_at = new Date().toISOString()
  order.can_cancel = false
  order.can_return = false
  
  if (order.status_history) {
    order.status_history.push({
      from_status: order.status_history[order.status_history.length - 1]?.to_status || 'pending',
      to_status: 'cancelled',
      changed_at: new Date().toISOString(),
      reason: request.reason || 'Cancelado por el cliente'
    })
  }
  
  return {
    order,
    message: 'Pedido cancelado correctamente'
  }
}

async function mockGetOrderStats(): Promise<OrderStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return getMockOrderStats()
}

// ============================================================================
// Real API Functions (to be implemented when backend is ready)
// ============================================================================

async function realGetOrders(params: OrderSearchParams = {}): Promise<GetOrdersResponse> {
  const queryParams = new URLSearchParams()
  
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    statuses.forEach(status => queryParams.append('status', status))
  }
  
  if (params.supplier_id) queryParams.append('supplier_id', params.supplier_id)
  if (params.date_from) queryParams.append('date_from', params.date_from)
  if (params.date_to) queryParams.append('date_to', params.date_to)
  if (params.min_amount) queryParams.append('min_amount', params.min_amount.toString())
  if (params.max_amount) queryParams.append('max_amount', params.max_amount.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.sort_by) queryParams.append('sort_by', params.sort_by)
  if (params.sort_order) queryParams.append('sort_order', params.sort_order)
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  
  const response = await fetch(`/store/orders?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Error al obtener los pedidos')
  }
  
  const data = await response.json()
  return data
}

async function realGetOrderById(id: string): Promise<GetOrderResponse> {
  const response = await fetch(`/store/orders/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Error al obtener el pedido')
  }
  
  const data = await response.json()
  return data
}

async function realCancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
  const response = await fetch(`/store/orders/${request.order_id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: request.reason
    }),
  })
  
  if (!response.ok) {
    throw new Error('Error al cancelar el pedido')
  }
  
  const data = await response.json()
  return data
}

async function realGetOrderStats(): Promise<OrderStats> {
  const response = await fetch('/store/orders/stats', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Error al obtener estadísticas de pedidos')
  }
  
  const data = await response.json()
  return data
}

// ============================================================================
// Exported API Functions (with feature flag switching)
// ============================================================================

/**
 * Obtener lista de pedidos del franquiciado
 */
export async function getOrders(params: OrderSearchParams = {}): Promise<GetOrdersResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo pedidos del franquiciado:', params)
    return mockGetOrders(params)
  }
  
  console.log('🌐 [REAL API] Obteniendo pedidos del franquiciado:', params)
  return realGetOrders(params)
}

/**
 * Obtener detalle de un pedido específico
 */
export async function getOrderById(id: string): Promise<GetOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo detalle del pedido:', id)
    return mockGetOrderById(id)
  }
  
  console.log('🌐 [REAL API] Obteniendo detalle del pedido:', id)
  return realGetOrderById(id)
}

/**
 * Cancelar un pedido
 */
export async function cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Cancelando pedido:', request)
    return mockCancelOrder(request)
  }
  
  console.log('🌐 [REAL API] Cancelando pedido:', request)
  return realCancelOrder(request)
}

/**
 * Obtener estadísticas de pedidos del franquiciado
 */
export async function getOrderStats(): Promise<OrderStats> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo estadísticas de pedidos')
    return mockGetOrderStats()
  }
  
  console.log('🌐 [REAL API] Obteniendo estadísticas de pedidos')
  return realGetOrderStats()
}

/**
 * Formatear precio en centavos a euros
 */
export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace('.', ',')}`
}

/**
 * Formatear fecha en formato local
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatear fecha corta
 */
export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
