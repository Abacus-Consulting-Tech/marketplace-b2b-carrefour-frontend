/**
 * Supplier Order Management Types
 * 
 * Following Medusa/MercurJS conventions for order handling
 * Extends base types from @/types/index with supplier-specific fields
 */

import type { Order, OrderItem, OrderStatus, PaymentStatus, DeliveryAddress } from '@/types/index'

/**
 * Supplier-specific order status
 * Maps to Medusa fulfillment_status
 */
export type SupplierOrderStatus =
  | 'pending'        // New order, awaiting supplier confirmation
  | 'confirmed'      // Supplier accepted the order
  | 'rejected'       // Supplier rejected the order
  | 'in_preparation' // Supplier is preparing items
  | 'shipped'        // Order shipped, tracking added
  | 'delivered'      // Order delivered to customer
  | 'cancelled'      // Order cancelled

/**
 * Order filters for supplier views
 */
export interface SupplierOrderFilters {
  status?: SupplierOrderStatus | SupplierOrderStatus[]
  dateFrom?: string
  dateTo?: string
  search?: string // Search by order number or customer name
  page?: number
  limit?: number
}

/**
 * Supplier-specific order view
 * Contains only items belonging to the supplier
 */
export interface SupplierOrder extends Omit<Order, 'items'> {
  // Medusa-specific fields
  fulfillment_status?: string
  display_id?: number // Human-readable order number
  cart_id?: string
  region_id?: string
  customer_id?: string
  
  // Supplier-specific
  supplierItems: SupplierOrderItem[] // Only items from this supplier
  supplierSubtotal: number // Subtotal for supplier's items only
  supplierTax: number
  supplierTotal: number
  
  // Tracking & logistics
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  estimatedDelivery?: string
  actualDelivery?: string
  
  // Notes & communication
  supplierNotes?: string
  franchiseeNotes?: string
  
  // Timestamps (Medusa convention)
  created_at: string
  updated_at: string
  canceled_at?: string
  shipped_at?: string
  delivered_at?: string
}

/**
 * Order item with supplier context
 */
export interface SupplierOrderItem extends OrderItem {
  sku?: string
  variant_id?: string
  variant_title?: string
  fulfillment_status?: 'not_fulfilled' | 'fulfilled' | 'returned' | 'shipped'
  
  // Medusa line item fields
  metadata?: {
    offer_id?: string
    [key: string]: unknown
  }
}

/**
 * Action requests for suppliers
 */
export interface AcceptOrderRequest {
  orderId: string
  estimatedDelivery?: string
  notes?: string
}

export interface RejectOrderRequest {
  orderId: string
  reason: string
  notes?: string
}

export interface UpdateOrderStatusRequest {
  orderId: string
  status: SupplierOrderStatus
  notes?: string
}

export interface AddTrackingRequest {
  orderId: string
  trackingNumber: string
  carrier: string
  trackingUrl?: string
  estimatedDelivery?: string
}

/**
 * Order statistics for supplier dashboard
 */
export interface SupplierOrderStats {
  pendingCount: number
  confirmedCount: number
  inPreparationCount: number
  shippedCount: number
  totalOrders: number
  averageProcessingTime: number // in hours
  totalRevenue: number
  revenueThisMonth: number
}

/**
 * Incident/Issue types
 */
export type IncidentType =
  | 'damaged_product'
  | 'wrong_product'
  | 'incorrect_quantity'
  | 'delivery_delay'
  | 'missing_items'
  | 'quality_issue'
  | 'other'

export type IncidentStatus =
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'

export interface OrderIncident {
  id: string
  orderId: string
  orderItemId?: string
  type: IncidentType
  status: IncidentStatus
  description: string
  resolution?: string
  reportedBy: 'franchisee' | 'supplier'
  reportedAt: string
  resolvedAt?: string
  images?: string[]
  metadata?: Record<string, unknown>
}

export interface CreateIncidentRequest {
  orderId: string
  orderItemId?: string
  type: IncidentType
  description: string
  images?: File[]
}

export interface ResolveIncidentRequest {
  incidentId: string
  resolution: string
  refundAmount?: number
  replacementOffered?: boolean
}

/**
 * API Response types following Medusa conventions
 */
export interface SupplierOrdersResponse {
  orders: SupplierOrder[]
  count: number
  offset: number
  limit: number
}

export interface SupplierOrderResponse {
  order: SupplierOrder
}

export interface SupplierOrderStatsResponse {
  stats: SupplierOrderStats
}

export interface IncidentsResponse {
  incidents: OrderIncident[]
  count: number
}
