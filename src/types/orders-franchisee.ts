/**
 * Franchisee Orders Types - Marketplace B2B Carrefour
 * 
 * Tipos para la gestión de pedidos desde la perspectiva del franquiciado
 * Reutiliza tipos de checkout.ts y añade información de tracking y gestión
 */

import { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  FulfillmentStatus,
  OrderAddress 
} from './checkout'

// ============================================================================
// Extended Order Types for Franchisee View
// ============================================================================

export interface TrackingInfo {
  carrier: string // e.g., "SEUR", "MRW", "Correos"
  tracking_number: string
  tracking_url?: string
  shipped_at?: string
  estimated_delivery?: string
  delivered_at?: string
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  updates: TrackingUpdate[]
}

export interface TrackingUpdate {
  date: string
  location?: string
  status: string
  description: string
}

export interface FranchiseeOrder extends Order {
  // Información del proveedor
  supplier_id: string
  supplier_name: string
  
  // Tracking de envío
  tracking?: TrackingInfo
  
  // Información adicional
  can_cancel: boolean
  can_return: boolean
  return_deadline?: string // ISO date string
  
  // Historial de cambios
  status_history?: OrderStatusChange[]
}

export interface OrderStatusChange {
  from_status: OrderStatus
  to_status: OrderStatus
  changed_at: string
  changed_by?: string
  reason?: string
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface OrderFilters {
  status?: OrderStatus | OrderStatus[]
  payment_status?: PaymentStatus
  fulfillment_status?: FulfillmentStatus
  supplier_id?: string
  date_from?: string // ISO date
  date_to?: string // ISO date
  min_amount?: number
  max_amount?: number
}

export interface OrderSearchParams extends OrderFilters {
  search?: string // Search by order number, product name
  sort_by?: 'created_at' | 'total' | 'display_id'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ============================================================================
// API Response Types
// ============================================================================

export interface GetOrdersResponse {
  orders: FranchiseeOrder[]
  count: number
  total: number
  page: number
  limit: number
}

export interface GetOrderResponse {
  order: FranchiseeOrder
}

export interface CancelOrderRequest {
  order_id: string
  reason?: string
}

export interface CancelOrderResponse {
  order: FranchiseeOrder
  message: string
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface OrderStats {
  total_orders: number
  pending_orders: number
  in_transit_orders: number
  delivered_orders: number
  cancelled_orders: number
  total_spent: number // in cents
  average_order_value: number // in cents
  last_order_date?: string
}

// ============================================================================
// Helper Types
// ============================================================================

export interface OrderStatusBadgeConfig {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusBadgeConfig> = {
  pending: {
    label: 'Pendiente',
    variant: 'outline',
    className: 'border-yellow-500 text-yellow-700 bg-yellow-50'
  },
  confirmed: {
    label: 'Confirmado',
    variant: 'default',
    className: 'bg-blue-500 text-white'
  },
  processing: {
    label: 'En Preparación',
    variant: 'default',
    className: 'bg-purple-500 text-white'
  },
  shipped: {
    label: 'Enviado',
    variant: 'default',
    className: 'bg-indigo-500 text-white'
  },
  delivered: {
    label: 'Entregado',
    variant: 'default',
    className: 'bg-green-500 text-white'
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
    className: 'bg-red-500 text-white'
  },
  refunded: {
    label: 'Reembolsado',
    variant: 'secondary',
    className: 'bg-gray-500 text-white'
  }
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, OrderStatusBadgeConfig> = {
  awaiting: {
    label: 'Pendiente de pago',
    variant: 'outline',
    className: 'border-yellow-500 text-yellow-700'
  },
  captured: {
    label: 'Pagado',
    variant: 'default',
    className: 'bg-green-500 text-white'
  },
  partially_refunded: {
    label: 'Parcialmente reembolsado',
    variant: 'secondary',
    className: 'bg-orange-500 text-white'
  },
  refunded: {
    label: 'Reembolsado',
    variant: 'secondary',
    className: 'bg-gray-500 text-white'
  },
  cancelled: {
    label: 'Pago cancelado',
    variant: 'destructive',
    className: 'bg-red-500 text-white'
  }
}

// Re-export checkout types for convenience
export type { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  FulfillmentStatus,
  OrderAddress 
}
