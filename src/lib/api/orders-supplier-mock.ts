/**
 * Mock Data for Supplier Order Management
 * 
 * Realistic test data following Medusa/MercurJS conventions
 * Ready to replace with real API when backend is ready
 */

import type {
  SupplierOrder,
  SupplierOrderItem,
  SupplierOrderStats,
  SupplierOrderStatus,
  OrderIncident,
} from '@/types/orders-supplier'

// ============================================================================
// Mock Data Storage
// ============================================================================

const STORAGE_KEY_ORDERS = 'mock_supplier_orders'
const STORAGE_KEY_INCIDENTS = 'mock_order_incidents'

// Get current supplier ID from session (would come from auth in real app)
const getCurrentSupplierId = (): string => {
  if (typeof window === 'undefined') return 'seller_01M0A8SUPPLI3R1'
  return sessionStorage.getItem('mock_supplier_id') || 'seller_01M0A8SUPPLI3R1'
}

// ============================================================================
// Base Mock Data
// ============================================================================

const baseMockOrders: SupplierOrder[] = [
  {
    id: 'order_01M0A8ORDER001',
    orderNumber: 'ORD-2026-001',
    display_id: 1001,
    franchiseeId: 'user_franchisee_juan',
    franchiseeName: 'Carrefour Express Madrid Centro',
    status: 'pending',
    fulfillment_status: 'not_fulfilled',
    
    supplierItems: [
      {
        id: 'item_01M0A8ITEM001',
        productId: 'prod_01M0A8POLO001',
        productName: 'Polo Corporativo Carrefour',
        productImage: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 25,
        unitPrice: 15.99,
        subtotal: 399.75,
        tax: 83.95,
        sku: 'POLO-CORP-M',
        variant_id: 'variant_01M0A8VAR001',
        variant_title: 'Talla M',
        fulfillment_status: 'not_fulfilled',
        metadata: {
          offer_id: 'offer_01M0A8OFF001',
        },
      },
      {
        id: 'item_01M0A8ITEM002',
        productId: 'prod_01M0A8POLO002',
        productName: 'Pantalón Corporativo Negro',
        productImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 25,
        unitPrice: 24.99,
        subtotal: 624.75,
        tax: 131.20,
        sku: 'PANT-CORP-M',
        variant_id: 'variant_01M0A8VAR002',
        variant_title: 'Talla M',
        fulfillment_status: 'not_fulfilled',
      },
    ],
    
    supplierSubtotal: 1024.50,
    supplierTax: 215.15,
    supplierTotal: 1239.65,
    
    subtotal: 1500.00,
    tax: 315.00,
    shippingCost: 25.00,
    total: 1840.00,
    currency: 'EUR',
    
    shippingAddress: {
      fullName: 'Juan Pérez',
      phone: '+34 600 123 456',
      address: 'Calle Carmen 50',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28013',
      country: 'ES',
    },
    
    paymentMethod: 'tarjeta',
    paymentStatus: 'paid',
    
    franchiseeNotes: 'Urgente - necesario para apertura del 1 de septiembre',
    
    // Timestamps (both formats for compatibility)
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_01M0A8ORDER002',
    orderNumber: 'ORD-2026-002',
    display_id: 1002,
    franchiseeId: 'user_franchisee_maria',
    franchiseeName: 'Carrefour Market Barcelona Eixample',
    status: 'confirmed',
    fulfillment_status: 'not_fulfilled',
    
    supplierItems: [
      {
        id: 'item_01M0A8ITEM003',
        productId: 'prod_01M0A8DELANTAL',
        productName: 'Delantal con Logo Carrefour',
        productImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 15,
        unitPrice: 12.50,
        subtotal: 187.50,
        tax: 39.38,
        sku: 'DELANT-001',
        fulfillment_status: 'not_fulfilled',
      },
    ],
    
    supplierSubtotal: 187.50,
    supplierTax: 39.38,
    supplierTotal: 226.88,
    
    subtotal: 187.50,
    tax: 39.38,
    shippingCost: 15.00,
    total: 241.88,
    currency: 'EUR',
    
    shippingAddress: {
      fullName: 'María García',
      phone: '+34 611 222 333',
      address: 'Passeig de Gràcia 120',
      city: 'Barcelona',
      province: 'Barcelona',
      postalCode: '08008',
      country: 'ES',
    },
    
    paymentMethod: 'tarjeta',
    paymentStatus: 'paid',
    
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    supplierNotes: 'Confirmo recepción del pedido. Preparación iniciada.',
    
    // Timestamps (both formats for compatibility)
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_01M0A8ORDER003',
    orderNumber: 'ORD-2026-003',
    display_id: 1003,
    franchiseeId: 'user_franchisee_carlos',
    franchiseeName: 'Carrefour Express Valencia Centro',
    status: 'in_preparation',
    fulfillment_status: 'partially_fulfilled',
    
    supplierItems: [
      {
        id: 'item_01M0A8ITEM004',
        productId: 'prod_01M0A8POLO001',
        productName: 'Polo Corporativo Carrefour',
        productImage: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 40,
        unitPrice: 15.99,
        subtotal: 639.60,
        tax: 134.32,
        sku: 'POLO-CORP-L',
        variant_id: 'variant_01M0A8VAR003',
        variant_title: 'Talla L',
        fulfillment_status: 'not_fulfilled',
      },
    ],
    
    supplierSubtotal: 639.60,
    supplierTax: 134.32,
    supplierTotal: 773.92,
    
    subtotal: 639.60,
    tax: 134.32,
    shippingCost: 20.00,
    total: 793.92,
    currency: 'EUR',
    
    shippingAddress: {
      fullName: 'Carlos Rodríguez',
      phone: '+34 622 333 444',
      address: 'Calle Colón 25',
      city: 'Valencia',
      province: 'Valencia',
      postalCode: '46004',
      country: 'ES',
    },
    
    paymentMethod: 'transferencia',
    paymentStatus: 'paid',
    
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    supplierNotes: 'Pedido en preparación. Envío previsto para mañana.',
    
    // Timestamps (both formats for compatibility)
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_01M0A8ORDER004',
    orderNumber: 'ORD-2026-004',
    display_id: 1004,
    franchiseeId: 'user_franchisee_laura',
    franchiseeName: 'Carrefour Market Sevilla Norte',
    status: 'shipped',
    fulfillment_status: 'fulfilled',
    
    supplierItems: [
      {
        id: 'item_01M0A8ITEM005',
        productId: 'prod_01M0A8DELANTAL',
        productName: 'Delantal con Logo Carrefour',
        productImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 20,
        unitPrice: 12.50,
        subtotal: 250.00,
        tax: 52.50,
        sku: 'DELANT-001',
        fulfillment_status: 'fulfilled',
      },
      {
        id: 'item_01M0A8ITEM006',
        productId: 'prod_01M0A8POLO001',
        productName: 'Polo Corporativo Carrefour',
        productImage: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 30,
        unitPrice: 15.99,
        subtotal: 479.70,
        tax: 100.74,
        sku: 'POLO-CORP-M',
        variant_title: 'Talla M',
        fulfillment_status: 'fulfilled',
      },
    ],
    
    supplierSubtotal: 729.70,
    supplierTax: 153.24,
    supplierTotal: 882.94,
    
    subtotal: 729.70,
    tax: 153.24,
    shippingCost: 18.00,
    total: 900.94,
    currency: 'EUR',
    
    shippingAddress: {
      fullName: 'Laura Martínez',
      phone: '+34 633 444 555',
      address: 'Avenida de la Buhaira 2',
      city: 'Sevilla',
      province: 'Sevilla',
      postalCode: '41018',
      country: 'ES',
    },
    
    paymentMethod: 'tarjeta',
    paymentStatus: 'paid',
    
    trackingNumber: 'ESP123456789',
    trackingUrl: 'https://tracking.example.com/ESP123456789',
    carrier: 'SEUR',
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    supplierNotes: 'Pedido enviado. Número de seguimiento: ESP123456789',
    
    // Timestamps (both formats for compatibility)
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shipped_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  {
    id: 'order_01M0A8ORDER005',
    orderNumber: 'ORD-2026-005',
    display_id: 1005,
    franchiseeId: 'user_franchisee_antonio',
    franchiseeName: 'Carrefour Express Málaga Costa',
    status: 'delivered',
    fulfillment_status: 'fulfilled',
    
    supplierItems: [
      {
        id: 'item_01M0A8ITEM007',
        productId: 'prod_01M0A8POLO002',
        productName: 'Pantalón Corporativo Negro',
        productImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
        supplierId: 'seller_01M0A8SUPPLI3R1',
        supplierName: 'Uniformes Profesionales S.L.',
        quantity: 35,
        unitPrice: 24.99,
        subtotal: 874.65,
        tax: 183.68,
        sku: 'PANT-CORP-L',
        variant_title: 'Talla L',
        fulfillment_status: 'fulfilled',
      },
    ],
    
    supplierSubtotal: 874.65,
    supplierTax: 183.68,
    supplierTotal: 1058.33,
    
    subtotal: 874.65,
    tax: 183.68,
    shippingCost: 22.00,
    total: 1080.33,
    currency: 'EUR',
    
    shippingAddress: {
      fullName: 'Antonio López',
      phone: '+34 644 555 666',
      address: 'Calle Larios 8',
      city: 'Málaga',
      province: 'Málaga',
      postalCode: '29015',
      country: 'ES',
    },
    
    paymentMethod: 'tarjeta',
    paymentStatus: 'paid',
    
    trackingNumber: 'ESP987654321',
    trackingUrl: 'https://tracking.example.com/ESP987654321',
    carrier: 'Correos',
    actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    
    // Timestamps (both formats for compatibility)
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    shipped_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const baseMockIncidents: OrderIncident[] = [
  {
    id: 'incident_001',
    orderId: 'order_01M0A8ORDER004',
    orderItemId: 'item_01M0A8ITEM006',
    type: 'quality_issue',
    status: 'open',
    description: 'Algunos polos llegaron con pequeñas manchas en el bordado',
    reportedBy: 'franchisee',
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    images: ['https://example.com/incident_001_photo1.jpg'],
  },
]

// ============================================================================
// Storage Helpers
// ============================================================================

export function getMockOrders(): SupplierOrder[] {
  if (typeof window === 'undefined') return baseMockOrders
  
  const stored = sessionStorage.getItem(STORAGE_KEY_ORDERS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return baseMockOrders
    }
  }
  return baseMockOrders
}

export function saveMockOrders(orders: SupplierOrder[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders))
  }
}

export function getMockIncidents(): OrderIncident[] {
  if (typeof window === 'undefined') return baseMockIncidents
  
  const stored = sessionStorage.getItem(STORAGE_KEY_INCIDENTS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return baseMockIncidents
    }
  }
  return baseMockIncidents
}

export function saveMockIncidents(incidents: OrderIncident[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents))
  }
}

// ============================================================================
// Mock Data Accessors
// ============================================================================

export function getMockOrderById(id: string): SupplierOrder | undefined {
  const orders = getMockOrders()
  return orders.find(order => order.id === id)
}

export function updateMockOrder(id: string, updates: Partial<SupplierOrder>): SupplierOrder | null {
  const orders = getMockOrders()
  const index = orders.findIndex(order => order.id === id)
  
  if (index === -1) return null
  
  const now = new Date().toISOString()
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: now,      // camelCase for base Order type
    updated_at: now,     // snake_case for Medusa compatibility
  }
  
  saveMockOrders(orders)
  return orders[index]
}

export function getMockOrderStats(): SupplierOrderStats {
  const orders = getMockOrders()
  const now = Date.now()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  
  const stats: SupplierOrderStats = {
    pendingCount: orders.filter(o => o.status === 'pending').length,
    confirmedCount: orders.filter(o => o.status === 'confirmed').length,
    inPreparationCount: orders.filter(o => o.status === 'in_preparation').length,
    shippedCount: orders.filter(o => o.status === 'shipped').length,
    totalOrders: orders.length,
    averageProcessingTime: 24, // Mock: 24 hours average
    totalRevenue: orders.reduce((sum, order) => sum + order.supplierTotal, 0),
    revenueThisMonth: orders
      .filter(o => new Date(o.created_at) >= monthStart)
      .reduce((sum, order) => sum + order.supplierTotal, 0),
  }
  
  return stats
}
