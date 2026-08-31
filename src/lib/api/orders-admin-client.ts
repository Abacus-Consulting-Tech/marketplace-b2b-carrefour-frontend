/**
 * Admin Orders API Client
 * 
 * Cliente API para gestión global de pedidos desde administración
 * Vista completa de todos los pedidos de la plataforma
 * 
 * Backend Integration (Render DEV):
 * - GET /admin/orders?limit=N - List orders
 * - GET /admin/orders/:id - Order detail
 */

import { featureFlags } from '@/config/feature-flags'
import { apiRequest, buildQueryString, logApiMode } from './api-utils'
import {
  AdminOrder,
  AdminOrderSearchParams,
  GetAdminOrdersResponse,
  GetAdminOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  UpdateOrderPriorityRequest,
  RefundOrderRequest,
  RefundOrderResponse,
  AdminOrderStats,
  OrderIncident,
  GetOrderIncidentsResponse,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  AddAdminNoteRequest
} from '@/types/orders-admin'
import {
  allMockAdminOrders,
  getMockAdminOrderById,
  getMockAdminOrdersByStatus,
  getMockAdminOrdersByCustomer,
  getMockAdminOrdersBySupplier,
  getMockOrderIncidents,
  getMockAdminOrderStats
} from './orders-admin-mock'

// Log mode on initialization
logApiMode('Orders (Admin)', featureFlags.shouldUseMock('orders'), featureFlags.isBackendReady('orders'))

// ============================================================================
// Mock API Functions
// ============================================================================

async function mockGetAdminOrders(params: AdminOrderSearchParams = {}): Promise<GetAdminOrdersResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = [...allMockAdminOrders]
  
  // Filters
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    filtered = filtered.filter(order => statuses.includes(order.status))
  }
  
  if (params.customer_id) {
    filtered = filtered.filter(order => order.customer_id === params.customer_id)
  }
  
  if (params.supplier_id) {
    filtered = filtered.filter(order => order.supplier_id === params.supplier_id)
  }
  
  if (params.priority) {
    filtered = filtered.filter(order => order.priority === params.priority)
  }
  
  if (params.has_incidents !== undefined) {
    filtered = filtered.filter(order => order.has_incidents === params.has_incidents)
  }
  
  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.display_id.toLowerCase().includes(search) ||
      order.customer_name.toLowerCase().includes(search) ||
      order.supplier_name.toLowerCase().includes(search) ||
      order.items.some(item => item.title.toLowerCase().includes(search))
    )
  }
  
  // Sorting
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
      case 'customer_name':
        comparison = a.customer_name.localeCompare(b.customer_name)
        break
      case 'supplier_name':
        comparison = a.supplier_name.localeCompare(b.supplier_name)
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

async function mockGetAdminOrderById(id: string): Promise<GetAdminOrderResponse> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const order = getMockAdminOrderById(id)
  if (!order) {
    throw new Error(`Pedido no encontrado: ${id}`)
  }
  
  return { order }
}

async function mockUpdateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const order = getMockAdminOrderById(request.order_id)
  if (!order) {
    throw new Error(`Pedido no encontrado: ${request.order_id}`)
  }
  
  const oldStatus = order.status
  order.status = request.new_status
  order.updated_at = new Date().toISOString()
  
  if (request.admin_notes) {
    order.admin_notes = request.admin_notes
  }
  
  if (order.status_history) {
    order.status_history.push({
      from_status: oldStatus,
      to_status: request.new_status,
      changed_at: new Date().toISOString(),
      reason: request.reason || `Estado actualizado por administrador`,
      changed_by: 'admin'
    })
  }
  
  return {
    order,
    message: `Estado actualizado a ${request.new_status}`
  }
}

async function mockUpdateOrderPriority(request: UpdateOrderPriorityRequest): Promise<GetAdminOrderResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const order = getMockAdminOrderById(request.order_id)
  if (!order) {
    throw new Error(`Pedido no encontrado: ${request.order_id}`)
  }
  
  order.priority = request.priority
  order.updated_at = new Date().toISOString()
  
  return { order }
}

async function mockRefundOrder(request: RefundOrderRequest): Promise<RefundOrderResponse> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const order = getMockAdminOrderById(request.order_id)
  if (!order) {
    throw new Error(`Pedido no encontrado: ${request.order_id}`)
  }
  
  const refundAmount = request.amount || order.total
  order.payment_status = refundAmount === order.total ? 'refunded' : 'partially_refunded'
  order.status = 'refunded'
  order.updated_at = new Date().toISOString()
  
  return {
    order,
    refund_amount: refundAmount,
    message: `Reembolso procesado: ${(refundAmount / 100).toFixed(2)}€`
  }
}

async function mockGetAdminOrderStats(): Promise<AdminOrderStats> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return getMockAdminOrderStats()
}

async function mockGetOrderIncidents(orderId?: string): Promise<GetOrderIncidentsResponse> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const incidents = getMockOrderIncidents(orderId)
  return {
    incidents,
    count: incidents.length
  }
}

async function mockAddAdminNote(request: AddAdminNoteRequest): Promise<GetAdminOrderResponse> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const order = getMockAdminOrderById(request.order_id)
  if (!order) {
    throw new Error(`Pedido no encontrado: ${request.order_id}`)
  }
  
  order.admin_notes = request.note
  order.updated_at = new Date().toISOString()
  
  return { order }
}

// ============================================================================
// Real API Functions
// ============================================================================

async function realGetAdminOrders(params: AdminOrderSearchParams = {}): Promise<GetAdminOrdersResponse> {
  const queryParams: Record<string, any> = {}
  
  // Add filters
  if (params.status) {
    queryParams.status = Array.isArray(params.status) ? params.status.join(',') : params.status
  }
  if (params.customer_id) queryParams.customer_id = params.customer_id
  if (params.supplier_id) queryParams.supplier_id = params.supplier_id
  if (params.priority) queryParams.priority = params.priority
  if (params.has_incidents !== undefined) queryParams.has_incidents = params.has_incidents
  if (params.search) queryParams.q = params.search
  if (params.limit) queryParams.limit = params.limit
  if (params.page) queryParams.offset = (params.page - 1) * (params.limit || 10)
  
  const queryString = buildQueryString(queryParams)
  const data = await apiRequest<any>(`/admin/orders${queryString}`)
  
  // Transform Medusa response to our format
  return {
    orders: data.orders || [],
    count: data.count || 0,
    total: data.count || 0,
    page: params.page || 1,
    limit: params.limit || 10
  }
}

async function realGetAdminOrderById(id: string): Promise<GetAdminOrderResponse> {
  const data = await apiRequest<any>(`/admin/orders/${id}`)
  return { order: data.order || data }
}

async function realUpdateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
  // Note: Medusa may not have this exact endpoint - this is a placeholder
  const data = await apiRequest<any>(`/admin/orders/${request.order_id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: request.new_status,
      reason: request.reason,
      admin_notes: request.admin_notes
    })
  })
  
  return {
    order: data.order || data,
    message: data.message || 'Estado actualizado correctamente'
  }
}

async function realGetAdminOrderStats(): Promise<AdminOrderStats> {
  // Note: Using /admin/custom/orders/stats to avoid RBAC 403 on legacy endpoint
  // Backend report 2026-08-26: /admin/orders/stats may return 403, use custom route instead
  const data = await apiRequest<any>('/admin/custom/orders/stats')
  return data
}

// ============================================================================
// Exported API Functions (with feature flag switching)
// ============================================================================

export async function getAdminOrders(params: AdminOrderSearchParams = {}): Promise<GetAdminOrdersResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo pedidos (admin):', params)
    return mockGetAdminOrders(params)
  }
  
  console.log('🌐 [REAL API] Obteniendo pedidos (admin):', params)
  return realGetAdminOrders(params)
}

export async function getAdminOrderById(id: string): Promise<GetAdminOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo pedido (admin):', id)
    return mockGetAdminOrderById(id)
  }
  
  console.log('🌐 [REAL API] Obteniendo pedido (admin):', id)
  return realGetAdminOrderById(id)
}

export async function updateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Actualizando estado:', request)
    return mockUpdateOrderStatus(request)
  }
  
  console.log('🌐 [REAL API] Actualizando estado:', request)
  return realUpdateOrderStatus(request)
}

export async function updateOrderPriority(request: UpdateOrderPriorityRequest): Promise<GetAdminOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Actualizando prioridad:', request)
    return mockUpdateOrderPriority(request)
  }
  
  // Real API implementation
  throw new Error('Not implemented')
}

export async function refundOrder(request: RefundOrderRequest): Promise<RefundOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Procesando reembolso:', request)
    return mockRefundOrder(request)
  }
  
  // Real API implementation
  throw new Error('Not implemented')
}

export async function getAdminOrderStats(): Promise<AdminOrderStats> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo estadísticas (admin)')
    return mockGetAdminOrderStats()
  }
  
  console.log('🌐 [REAL API] Obteniendo estadísticas (admin)')
  return realGetAdminOrderStats()
}

export async function getOrderIncidents(orderId?: string): Promise<GetOrderIncidentsResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Obteniendo incidencias:', orderId)
    return mockGetOrderIncidents(orderId)
  }
  
  // Real API implementation
  throw new Error('Not implemented')
}

export async function addAdminNote(request: AddAdminNoteRequest): Promise<GetAdminOrderResponse> {
  if (featureFlags.shouldUseMock('orders')) {
    console.log('📦 [MOCK] Añadiendo nota admin:', request)
    return mockAddAdminNote(request)
  }
  
  // Real API implementation
  throw new Error('Not implemented')
}

// Export from franchisee client for consistency
export { formatPrice, formatDate, formatShortDate } from './orders-franchisee-client'
