/**
 * Mock Data - Admin Orders
 * 
 * Datos de prueba para la vista de administrador de todos los pedidos
 * Combina y enriquece pedidos de franquiciados con información admin
 */

import { AdminOrder, AdminOrderStats, OrderIncident } from '@/types/orders-admin'
import { mockFranchiseeOrders } from './orders-franchisee-mock'

// ============================================================================
// Mock Incidents Data
// ============================================================================

const mockIncidents: OrderIncident[] = [
  {
    id: 'inc_001',
    order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z01',
    type: 'delivery_delay',
    severity: 'medium',
    status: 'in_progress',
    description: 'El transportista SEUR reporta retraso de 1 día por condiciones meteorológicas',
    reported_by: 'customer',
    reported_at: '2026-08-24T16:00:00Z',
    assigned_to: 'admin_carlos',
    comments: [
      {
        id: 'com_001',
        user_id: 'cus_01',
        user_name: 'Juan García',
        user_role: 'customer',
        comment: 'Mi pedido debería haber llegado ayer. ¿Cuándo lo recibiré?',
        created_at: '2026-08-24T16:00:00Z'
      },
      {
        id: 'com_002',
        user_id: 'admin_carlos',
        user_name: 'Carlos Admin',
        user_role: 'admin',
        comment: 'He contactado con SEUR. Confirman entrega mañana antes de las 14:00h',
        created_at: '2026-08-24T18:30:00Z'
      }
    ]
  }
]

// ============================================================================
// Mock Admin Orders (enriqueciendo franchisee orders)
// ============================================================================

export const mockAdminOrders: AdminOrder[] = mockFranchiseeOrders.map((order, index) => ({
  ...order,
  // Customer info
  customer_name: 'Juan García',
  customer_email: 'franquicia.barcelona@carrefour.es',
  franchisee_company: 'Carrefour Barcelona Norte',
  franchisee_store: 'BCN-Norte-001',
  
  // Supplier email
  supplier_email: order.supplier_id === 'seller_01HY5FVQM2KN8PQRST6WXY7Z10'
    ? 'ventas@suministroscorporativos.es'
    : 'comercial@papeleriapublicidad.es',
  
  // Priority
  priority: index === 0 ? 'high' : index === 4 ? 'urgent' : 'normal',
  
  // Incidents
  has_incidents: order.id === 'order_01HY5FVQM2KN8PQRST6WXY7Z01',
  incident_count: order.id === 'order_01HY5FVQM2KN8PQRST6WXY7Z01' ? 1 : 0,
  
  // Admin notes
  admin_notes: index === 0 
    ? 'Cliente VIP - Alta prioridad. Asegurar entrega puntual.'
    : index === 4
    ? 'Pedido urgente - Cliente requiere confirmación inmediata'
    : undefined,
  
  // Permissions
  can_edit_status: true,
  can_cancel: order.can_cancel,
  can_refund: order.status === 'delivered' || order.status === 'cancelled',
  
  // Financials (5% comisión)
  commission_rate: 5,
  commission_amount: Math.round(order.total * 0.05),
  net_amount: Math.round(order.total * 0.95)
}))

// Añadir más pedidos de otros franquiciados para variedad
const additionalOrders: AdminOrder[] = [
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z20',
    display_id: 'CF-10049',
    status: 'confirmed',
    email: 'franquicia.madrid@carrefour.es',
    customer_id: 'cus_02',
    customer_name: 'María López',
    customer_email: 'franquicia.madrid@carrefour.es',
    franchisee_company: 'Carrefour Madrid Sur',
    franchisee_store: 'MAD-Sur-002',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z10',
    supplier_name: 'Suministros Corporativos SA',
    supplier_email: 'ventas@suministroscorporativos.es',
    
    items: [
      {
        id: 'item_020',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z20',
        product_id: 'prod_001',
        variant_id: 'var_001_s',
        title: 'Polo Corporativo Carrefour - Talla S',
        description: 'Polo con logo bordado',
        thumbnail: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        quantity: 100,
        unit_price: 1850,
        subtotal: 185000,
        tax_total: 38850,
        total: 223850,
        metadata: { sku: 'POLO-CAR-S', pack_size: 10 }
      }
    ],
    
    shipping_address: {
      first_name: 'María',
      last_name: 'López',
      company: 'Carrefour Madrid Sur',
      address_1: 'Calle Alcalá 123',
      city: 'Madrid',
      province: 'Madrid',
      postal_code: '28009',
      country_code: 'ES',
      phone: '+34 915 123 456'
    },
    
    subtotal: 185000,
    tax_total: 38850,
    shipping_total: 0,
    discount_total: 0,
    total: 223850,
    
    payment_status: 'captured',
    fulfillment_status: 'not_fulfilled',
    
    priority: 'normal',
    has_incidents: false,
    incident_count: 0,
    can_edit_status: true,
    can_cancel: true,
    can_refund: false,
    
    commission_rate: 5,
    commission_amount: 11193,
    net_amount: 212658,
    
    created_at: '2026-08-25T09:00:00Z',
    updated_at: '2026-08-25T09:15:00Z',
    
    status_history: [
      {
        from_status: 'pending',
        to_status: 'confirmed',
        changed_at: '2026-08-25T09:15:00Z',
        reason: 'Pedido confirmado por proveedor'
      }
    ]
  },
  
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z21',
    display_id: 'CF-10050',
    status: 'cancelled',
    email: 'franquicia.valencia@carrefour.es',
    customer_id: 'cus_03',
    customer_name: 'Pedro Sánchez',
    customer_email: 'franquicia.valencia@carrefour.es',
    franchisee_company: 'Carrefour Valencia Centro',
    franchisee_store: 'VAL-Centro-003',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z11',
    supplier_name: 'Papelería y Publicidad SL',
    supplier_email: 'comercial@papeleriapublicidad.es',
    
    items: [
      {
        id: 'item_021',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z21',
        product_id: 'prod_003',
        title: 'Tótem Publicitario 2m',
        description: 'Display publicitario',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
        quantity: 5,
        unit_price: 12500,
        subtotal: 62500,
        tax_total: 13125,
        total: 75625,
        metadata: { sku: 'TOTEM-2M' }
      }
    ],
    
    shipping_address: {
      first_name: 'Pedro',
      last_name: 'Sánchez',
      company: 'Carrefour Valencia Centro',
      address_1: 'Avenida del Puerto 234',
      city: 'Valencia',
      province: 'Valencia',
      postal_code: '46021',
      country_code: 'ES',
      phone: '+34 963 234 567'
    },
    
    subtotal: 62500,
    tax_total: 13125,
    shipping_total: 0,
    discount_total: 0,
    total: 75625,
    
    payment_status: 'refunded',
    fulfillment_status: 'cancelled',
    
    priority: 'low',
    has_incidents: false,
    incident_count: 0,
    admin_notes: 'Cliente canceló por cambio de estrategia de marketing',
    can_edit_status: true,
    can_cancel: false,
    can_refund: false,
    
    commission_rate: 5,
    commission_amount: 0, // No comisión en pedidos cancelados
    net_amount: 0,
    
    created_at: '2026-08-23T11:00:00Z',
    updated_at: '2026-08-23T15:30:00Z',
    cancelled_at: '2026-08-23T15:30:00Z',
    
    status_history: [
      {
        from_status: 'confirmed',
        to_status: 'cancelled',
        changed_at: '2026-08-23T15:30:00Z',
        reason: 'Cancelado por cliente - cambio de estrategia',
        changed_by: 'admin_carlos'
      },
      {
        from_status: 'pending',
        to_status: 'confirmed',
        changed_at: '2026-08-23T11:15:00Z',
        reason: 'Pedido confirmado'
      }
    ]
  }
]

export const allMockAdminOrders = [...mockAdminOrders, ...additionalOrders]

// ============================================================================
// Helper Functions
// ============================================================================

export function getMockAdminOrderById(id: string): AdminOrder | undefined {
  return allMockAdminOrders.find(order => order.id === id || order.display_id === id)
}

export function getMockAdminOrdersByStatus(status: string): AdminOrder[] {
  return allMockAdminOrders.filter(order => order.status === status)
}

export function getMockAdminOrdersByCustomer(customerId: string): AdminOrder[] {
  return allMockAdminOrders.filter(order => order.customer_id === customerId)
}

export function getMockAdminOrdersBySupplier(supplierId: string): AdminOrder[] {
  return allMockAdminOrders.filter(order => order.supplier_id === supplierId)
}

export function getMockOrderIncidents(orderId?: string): OrderIncident[] {
  if (orderId) {
    return mockIncidents.filter(inc => inc.order_id === orderId)
  }
  return mockIncidents
}

export function getMockAdminOrderStats(): AdminOrderStats {
  const orders = allMockAdminOrders
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  // Supplier stats
  const supplierStats = new Map<string, { name: string, orders: number, revenue: number }>()
  const customerStats = new Map<string, { name: string, orders: number, spent: number }>()
  
  orders.forEach(order => {
    // Supplier stats
    const supplier = supplierStats.get(order.supplier_id) || { 
      name: order.supplier_name, 
      orders: 0, 
      revenue: 0 
    }
    supplier.orders++
    supplier.revenue += order.total
    supplierStats.set(order.supplier_id, supplier)
    
    // Customer stats
    const customer = customerStats.get(order.customer_id) || { 
      name: order.customer_name, 
      orders: 0, 
      spent: 0 
    }
    customer.orders++
    customer.spent += order.total
    customerStats.set(order.customer_id, customer)
  })
  
  return {
    total_orders: orders.length,
    total_revenue: orders.reduce((sum, o) => sum + o.total, 0),
    total_commission: orders.reduce((sum, o) => sum + (o.commission_amount || 0), 0),
    average_order_value: Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length),
    
    pending_orders: orders.filter(o => o.status === 'pending').length,
    confirmed_orders: orders.filter(o => o.status === 'confirmed').length,
    processing_orders: orders.filter(o => o.status === 'processing').length,
    shipped_orders: orders.filter(o => o.status === 'shipped').length,
    delivered_orders: orders.filter(o => o.status === 'delivered').length,
    cancelled_orders: orders.filter(o => o.status === 'cancelled').length,
    refunded_orders: orders.filter(o => o.status === 'refunded').length,
    
    awaiting_payment: orders.filter(o => o.payment_status === 'awaiting').length,
    paid_orders: orders.filter(o => o.payment_status === 'captured').length,
    
    orders_with_incidents: orders.filter(o => o.has_incidents).length,
    open_incidents: mockIncidents.filter(i => i.status === 'open' || i.status === 'in_progress').length,
    high_priority_orders: orders.filter(o => o.priority === 'high' || o.priority === 'urgent').length,
    
    orders_today: orders.filter(o => new Date(o.created_at) >= startOfToday).length,
    orders_this_week: orders.filter(o => new Date(o.created_at) >= startOfWeek).length,
    orders_this_month: orders.filter(o => new Date(o.created_at) >= startOfMonth).length,
    
    top_suppliers: Array.from(supplierStats.entries())
      .map(([id, data]) => ({
        supplier_id: id,
        supplier_name: data.name,
        total_orders: data.orders,
        total_revenue: data.revenue
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5),
    
    top_customers: Array.from(customerStats.entries())
      .map(([id, data]) => ({
        customer_id: id,
        customer_name: data.name,
        total_orders: data.orders,
        total_spent: data.spent
      }))
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5)
  }
}
