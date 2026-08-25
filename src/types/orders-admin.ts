/**
 * Admin Orders Types - Marketplace B2B Carrefour
 * 
 * Tipos para la gestión global de pedidos desde la perspectiva del administrador
 * Vista completa de todos los pedidos de la plataforma
 */

import { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  FulfillmentStatus,
  OrderAddress 
} from './checkout'
import { TrackingInfo, OrderStatusChange } from './orders-franchisee'

// ============================================================================
// Extended Order Types for Admin View
// ============================================================================

export interface AdminOrder extends Order {
  // Customer/Franchisee info
  customer_id: string
  customer_name: string
  customer_email: string
  franchisee_company?: string
  franchisee_store?: string
  
  // Supplier/Vendor info
  supplier_id: string
  supplier_name: string
  supplier_email?: string
  
  // Tracking de envío
  tracking?: TrackingInfo
  
  // Admin features
  priority: 'low' | 'normal' | 'high' | 'urgent'
  has_incidents: boolean
  incident_count: number
  admin_notes?: string
  
  // Permissions
  can_edit_status: boolean
  can_cancel: boolean
  can_refund: boolean
  
  // Historial de cambios
  status_history?: OrderStatusChange[]
  
  // Financials
  commission_rate?: number // Porcentaje de comisión
  commission_amount?: number // Comisión en centavos
  net_amount?: number // Total - comisión
}

// ============================================================================
// Admin Filter & Search Types
// ============================================================================

export interface AdminOrderFilters {
  status?: OrderStatus | OrderStatus[]
  payment_status?: PaymentStatus
  fulfillment_status?: FulfillmentStatus
  customer_id?: string
  supplier_id?: string
  franchisee_company?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  has_incidents?: boolean
  date_from?: string // ISO date
  date_to?: string // ISO date
  min_amount?: number
  max_amount?: number
}

export interface AdminOrderSearchParams extends AdminOrderFilters {
  search?: string // Search by order number, customer, supplier, product
  sort_by?: 'created_at' | 'total' | 'display_id' | 'customer_name' | 'supplier_name'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ============================================================================
// Admin Actions Types
// ============================================================================

export interface UpdateOrderStatusRequest {
  order_id: string
  new_status: OrderStatus
  reason?: string
  admin_notes?: string
}

export interface UpdateOrderPriorityRequest {
  order_id: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  reason?: string
}

export interface RefundOrderRequest {
  order_id: string
  amount?: number // Si no se especifica, reembolso completo
  reason: string
  notify_customer?: boolean
}

export interface AddAdminNoteRequest {
  order_id: string
  note: string
}

// ============================================================================
// Incident Types
// ============================================================================

export interface OrderIncident {
  id: string
  order_id: string
  type: 'delivery_delay' | 'damaged_product' | 'wrong_product' | 'missing_items' | 'payment_issue' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  description: string
  reported_by: 'customer' | 'supplier' | 'admin'
  reported_at: string
  resolved_at?: string
  resolution?: string
  assigned_to?: string
  comments?: IncidentComment[]
}

export interface IncidentComment {
  id: string
  user_id: string
  user_name: string
  user_role: 'admin' | 'customer' | 'supplier'
  comment: string
  created_at: string
}

export interface CreateIncidentRequest {
  order_id: string
  type: OrderIncident['type']
  severity: OrderIncident['severity']
  description: string
}

export interface UpdateIncidentRequest {
  incident_id: string
  status?: OrderIncident['status']
  resolution?: string
  assigned_to?: string
}

// ============================================================================
// API Response Types
// ============================================================================

export interface GetAdminOrdersResponse {
  orders: AdminOrder[]
  count: number
  total: number
  page: number
  limit: number
}

export interface GetAdminOrderResponse {
  order: AdminOrder
}

export interface UpdateOrderStatusResponse {
  order: AdminOrder
  message: string
}

export interface RefundOrderResponse {
  order: AdminOrder
  refund_amount: number
  message: string
}

export interface GetOrderIncidentsResponse {
  incidents: OrderIncident[]
  count: number
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface AdminOrderStats {
  // General stats
  total_orders: number
  total_revenue: number // in cents
  total_commission: number // in cents
  average_order_value: number // in cents
  
  // By status
  pending_orders: number
  confirmed_orders: number
  processing_orders: number
  shipped_orders: number
  delivered_orders: number
  cancelled_orders: number
  refunded_orders: number
  
  // By payment
  awaiting_payment: number
  paid_orders: number
  
  // Issues
  orders_with_incidents: number
  open_incidents: number
  high_priority_orders: number
  
  // Time periods
  orders_today: number
  orders_this_week: number
  orders_this_month: number
  
  // Top performers
  top_suppliers: Array<{
    supplier_id: string
    supplier_name: string
    total_orders: number
    total_revenue: number
  }>
  top_customers: Array<{
    customer_id: string
    customer_name: string
    total_orders: number
    total_spent: number
  }>
}

// ============================================================================
// Export & Report Types
// ============================================================================

export interface ExportOrdersRequest {
  filters?: AdminOrderFilters
  format: 'csv' | 'xlsx' | 'pdf'
  columns?: string[]
  date_range?: {
    from: string
    to: string
  }
}

export interface OrdersReport {
  period: string
  total_orders: number
  total_revenue: number
  total_commission: number
  orders_by_status: Record<OrderStatus, number>
  orders_by_supplier: Array<{
    supplier_name: string
    count: number
    revenue: number
  }>
  orders_by_day: Array<{
    date: string
    count: number
    revenue: number
  }>
}

// ============================================================================
// Helper Types
// ============================================================================

export interface PriorityBadgeConfig {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export const PRIORITY_CONFIG: Record<string, PriorityBadgeConfig> = {
  low: {
    label: 'Baja',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700'
  },
  normal: {
    label: 'Normal',
    variant: 'default',
    className: 'bg-blue-100 text-blue-700'
  },
  high: {
    label: 'Alta',
    variant: 'default',
    className: 'bg-orange-500 text-white'
  },
  urgent: {
    label: 'Urgente',
    variant: 'destructive',
    className: 'bg-red-500 text-white'
  }
}

export const INCIDENT_TYPE_LABELS: Record<OrderIncident['type'], string> = {
  delivery_delay: 'Retraso en entrega',
  damaged_product: 'Producto dañado',
  wrong_product: 'Producto incorrecto',
  missing_items: 'Artículos faltantes',
  payment_issue: 'Problema de pago',
  other: 'Otro'
}

export const INCIDENT_SEVERITY_CONFIG: Record<OrderIncident['severity'], PriorityBadgeConfig> = {
  low: {
    label: 'Baja',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700'
  },
  medium: {
    label: 'Media',
    variant: 'default',
    className: 'bg-yellow-100 text-yellow-700'
  },
  high: {
    label: 'Alta',
    variant: 'default',
    className: 'bg-orange-500 text-white'
  },
  critical: {
    label: 'Crítica',
    variant: 'destructive',
    className: 'bg-red-500 text-white'
  }
}

// Re-export types for convenience
export type { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  FulfillmentStatus,
  OrderAddress,
  TrackingInfo,
  OrderStatusChange
}
