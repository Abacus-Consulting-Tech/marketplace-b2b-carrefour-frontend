/**
 * Supplier Order Management API Client
 * 
 * Handles order operations for suppliers following Medusa/MercurJS conventions
 * 
 * Mode controlled by feature flags:
 * - Mock mode: Returns realistic test data with simulated delays
 * - Real mode: Calls Medusa backend endpoints
 * 
 * @example
 * import { supplierOrdersApi } from '@/lib/api/orders-supplier-client'
 * 
 * const orders = await supplierOrdersApi.getOrders({ status: 'pending' })
 * await supplierOrdersApi.acceptOrder({ orderId: 'order_123', estimatedDelivery: '2026-09-01' })
 */

import { featureFlags } from '@/config/feature-flags'
import { apiClient } from './client'
import type {
  SupplierOrder,
  SupplierOrderFilters,
  SupplierOrderStats,
  SupplierOrdersResponse,
  SupplierOrderResponse,
  SupplierOrderStatsResponse,
  AcceptOrderRequest,
  RejectOrderRequest,
  UpdateOrderStatusRequest,
  AddTrackingRequest,
  OrderIncident,
  IncidentsResponse,
  CreateIncidentRequest,
  ResolveIncidentRequest,
} from '@/types/orders-supplier'

import {
  getMockOrders,
  getMockOrderById,
  updateMockOrder,
  getMockOrderStats,
  getMockIncidents,
  saveMockIncidents,
} from './orders-supplier-mock'

// ============================================================================
// Configuration
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('orders')
const API_BASE_URL = featureFlags.getApiBaseUrl('orders') || '/api/supplier/orders'

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Supplier Orders API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('orders') ? 'Yes ✅' : 'No ⏳'})`
  )
}

// Simulate network delay in mock mode
const MOCK_DELAY_MS = 400

async function mockDelay<T>(data: T): Promise<T> {
  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS))
  }
  return data
}

// ============================================================================
// API Methods
// ============================================================================

export const supplierOrdersApi = {
  /**
   * Get list of orders for the current supplier
   * 
   * @param filters - Filter criteria
   * @returns Paginated list of orders
   */
  async getOrders(filters?: SupplierOrderFilters): Promise<SupplierOrdersResponse> {
    if (isMockMode) {
      let orders = getMockOrders()
      
      // Apply filters
      if (filters?.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
        orders = orders.filter(order => statuses.includes(order.status))
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        orders = orders.filter(
          order =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.franchiseeName.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters?.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        orders = orders.filter(order => new Date(order.created_at) >= fromDate)
      }
      
      if (filters?.dateTo) {
        const toDate = new Date(filters.dateTo)
        orders = orders.filter(order => new Date(order.created_at) <= toDate)
      }
      
      // Sort by created_at descending (newest first)
      orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      // Pagination
      const page = filters?.page || 1
      const limit = filters?.limit || 20
      const offset = (page - 1) * limit
      const paginatedOrders = orders.slice(offset, offset + limit)
      
      return mockDelay({
        orders: paginatedOrders,
        count: orders.length,
        offset,
        limit,
      })
    }
    
    // Real API call to Medusa
    const response = await apiClient.get<SupplierOrdersResponse>(API_BASE_URL, {
      params: filters,
    })
    return response.data
  },

  /**
   * Get detailed information for a specific order
   * 
   * @param orderId - Order ID
   * @returns Order details with all items
   */
  async getOrderById(orderId: string): Promise<SupplierOrder | null> {
    if (isMockMode) {
      const order = getMockOrderById(orderId)
      return mockDelay(order || null)
    }
    
    // Real API call to Medusa
    const response = await apiClient.get<SupplierOrderResponse>(`${API_BASE_URL}/${orderId}`)
    return response.data.order
  },

  /**
   * Get order statistics for supplier dashboard
   * 
   * @returns Statistics summary
   */
  async getOrderStats(): Promise<SupplierOrderStats> {
    if (isMockMode) {
      const stats = getMockOrderStats()
      return mockDelay(stats)
    }
    
    // Real API call to Medusa
    const response = await apiClient.get<SupplierOrderStatsResponse>(`${API_BASE_URL}/stats`)
    return response.data.stats
  },

  /**
   * Accept a pending order
   * 
   * @param request - Accept order request with optional delivery estimate
   * @returns Updated order
   */
  async acceptOrder(request: AcceptOrderRequest): Promise<SupplierOrder | null> {
    if (isMockMode) {
      const updated = updateMockOrder(request.orderId, {
        status: 'confirmed',
        estimatedDelivery: request.estimatedDelivery,
        supplierNotes: request.notes || 'Pedido confirmado y aceptado.',
      })
      return mockDelay(updated)
    }
    
    // Real API call to Medusa
    const response = await apiClient.post<SupplierOrderResponse>(
      `${API_BASE_URL}/${request.orderId}/accept`,
      {
        estimated_delivery: request.estimatedDelivery,
        notes: request.notes,
      }
    )
    return response.data.order
  },

  /**
   * Reject a pending order
   * 
   * @param request - Reject order request with reason
   * @returns Updated order
   */
  async rejectOrder(request: RejectOrderRequest): Promise<SupplierOrder | null> {
    if (isMockMode) {
      const updated = updateMockOrder(request.orderId, {
        status: 'rejected',
        supplierNotes: `Pedido rechazado. Motivo: ${request.reason}. ${request.notes || ''}`,
      })
      return mockDelay(updated)
    }
    
    // Real API call to Medusa
    const response = await apiClient.post<SupplierOrderResponse>(
      `${API_BASE_URL}/${request.orderId}/reject`,
      {
        reason: request.reason,
        notes: request.notes,
      }
    )
    return response.data.order
  },

  /**
   * Update order status (confirmed -> in_preparation -> shipped)
   * 
   * @param request - Status update request
   * @returns Updated order
   */
  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<SupplierOrder | null> {
    if (isMockMode) {
      const updates: Partial<SupplierOrder> = {
        status: request.status,
      }
      
      if (request.notes) {
        updates.supplierNotes = request.notes
      }
      
      if (request.status === 'in_preparation') {
        updates.supplierNotes = request.notes || 'Pedido en preparación.'
      } else if (request.status === 'shipped') {
        updates.shipped_at = new Date().toISOString()
      } else if (request.status === 'delivered') {
        updates.delivered_at = new Date().toISOString()
      }
      
      const updated = updateMockOrder(request.orderId, updates)
      return mockDelay(updated)
    }
    
    // Real API call to Medusa
    const response = await apiClient.patch<SupplierOrderResponse>(
      `${API_BASE_URL}/${request.orderId}/status`,
      {
        status: request.status,
        notes: request.notes,
      }
    )
    return response.data.order
  },

  /**
   * Add tracking information to a shipped order
   * 
   * @param request - Tracking details
   * @returns Updated order
   */
  async addTracking(request: AddTrackingRequest): Promise<SupplierOrder | null> {
    if (isMockMode) {
      const updated = updateMockOrder(request.orderId, {
        status: 'shipped',
        trackingNumber: request.trackingNumber,
        trackingUrl: request.trackingUrl,
        carrier: request.carrier,
        estimatedDelivery: request.estimatedDelivery,
        shipped_at: new Date().toISOString(),
        supplierNotes: `Pedido enviado. Transportista: ${request.carrier}. Número de seguimiento: ${request.trackingNumber}`,
      })
      return mockDelay(updated)
    }
    
    // Real API call to Medusa
    const response = await apiClient.post<SupplierOrderResponse>(
      `${API_BASE_URL}/${request.orderId}/tracking`,
      {
        tracking_number: request.trackingNumber,
        tracking_url: request.trackingUrl,
        carrier: request.carrier,
        estimated_delivery: request.estimatedDelivery,
      }
    )
    return response.data.order
  },

  /**
   * Get incidents for an order
   * 
   * @param orderId - Order ID
   * @returns List of incidents
   */
  async getOrderIncidents(orderId: string): Promise<OrderIncident[]> {
    if (isMockMode) {
      const incidents = getMockIncidents().filter(incident => incident.orderId === orderId)
      return mockDelay(incidents)
    }
    
    // Real API call to Medusa
    const response = await apiClient.get<IncidentsResponse>(`${API_BASE_URL}/${orderId}/incidents`)
    return response.data.incidents
  },

  /**
   * Create a new incident report
   * 
   * @param request - Incident details
   * @returns Created incident
   */
  async createIncident(request: CreateIncidentRequest): Promise<OrderIncident> {
    if (isMockMode) {
      const newIncident: OrderIncident = {
        id: `incident_${Date.now()}`,
        orderId: request.orderId,
        orderItemId: request.orderItemId,
        type: request.type,
        status: 'open',
        description: request.description,
        reportedBy: 'supplier',
        reportedAt: new Date().toISOString(),
      }
      
      const incidents = getMockIncidents()
      incidents.push(newIncident)
      saveMockIncidents(incidents)
      
      return mockDelay(newIncident)
    }
    
    // Real API call to Medusa (with multipart/form-data if images)
    const formData = new FormData()
    formData.append('type', request.type)
    formData.append('description', request.description)
    if (request.orderItemId) {
      formData.append('order_item_id', request.orderItemId)
    }
    if (request.images) {
      request.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })
    }
    
    const response = await apiClient.post<{ incident: OrderIncident }>(
      `${API_BASE_URL}/${request.orderId}/incidents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.incident
  },

  /**
   * Resolve an existing incident
   * 
   * @param request - Resolution details
   * @returns Updated incident
   */
  async resolveIncident(request: ResolveIncidentRequest): Promise<OrderIncident | null> {
    if (isMockMode) {
      const incidents = getMockIncidents()
      const incident = incidents.find(i => i.id === request.incidentId)
      
      if (!incident) return mockDelay(null)
      
      incident.status = 'resolved'
      incident.resolution = request.resolution
      incident.resolvedAt = new Date().toISOString()
      
      saveMockIncidents(incidents)
      return mockDelay(incident)
    }
    
    // Real API call to Medusa
    const response = await apiClient.patch<{ incident: OrderIncident }>(
      `${API_BASE_URL}/incidents/${request.incidentId}/resolve`,
      {
        resolution: request.resolution,
        refund_amount: request.refundAmount,
        replacement_offered: request.replacementOffered,
      }
    )
    return response.data.incident
  },
}
