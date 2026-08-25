/**
 * Mock Data - Franchisee Orders
 * 
 * Datos de prueba para la vista de pedidos del franquiciado
 * 5 pedidos con diferentes estados y información de tracking
 */

import { FranchiseeOrder, TrackingInfo, OrderStatusChange } from '@/types/orders-franchisee'

// ============================================================================
// Mock Tracking Data
// ============================================================================

const mockTracking1: TrackingInfo = {
  carrier: 'SEUR',
  tracking_number: 'SUR123456789ES',
  tracking_url: 'https://www.seur.com/livetracking/?segOnlineIdentifier=SUR123456789ES',
  shipped_at: '2026-08-23T10:30:00Z',
  estimated_delivery: '2026-08-26T18:00:00Z',
  status: 'in_transit',
  updates: [
    {
      date: '2026-08-25T08:15:00Z',
      location: 'Centro Logístico Madrid',
      status: 'En tránsito',
      description: 'El paquete está en tránsito hacia su destino'
    },
    {
      date: '2026-08-24T14:20:00Z',
      location: 'Centro Logístico Barcelona',
      status: 'En tránsito',
      description: 'El paquete ha salido del centro de distribución'
    },
    {
      date: '2026-08-23T10:30:00Z',
      location: 'Almacén Proveedor',
      status: 'Enviado',
      description: 'El paquete ha sido recogido por el transportista'
    }
  ]
}

const mockTracking2: TrackingInfo = {
  carrier: 'MRW',
  tracking_number: 'MRW987654321ES',
  tracking_url: 'https://www.mrw.es/seguimiento_envios/MRW987654321ES',
  shipped_at: '2026-08-20T09:00:00Z',
  estimated_delivery: '2026-08-22T18:00:00Z',
  delivered_at: '2026-08-22T16:45:00Z',
  status: 'delivered',
  updates: [
    {
      date: '2026-08-22T16:45:00Z',
      location: 'Barcelona, España',
      status: 'Entregado',
      description: 'Entregado - Firmado por: J. García'
    },
    {
      date: '2026-08-22T09:30:00Z',
      location: 'Centro Reparto Barcelona',
      status: 'En reparto',
      description: 'El paquete está en reparto'
    },
    {
      date: '2026-08-21T08:00:00Z',
      location: 'Centro Logístico Barcelona',
      status: 'En tránsito',
      description: 'El paquete ha llegado al centro de distribución'
    },
    {
      date: '2026-08-20T09:00:00Z',
      location: 'Almacén Proveedor',
      status: 'Enviado',
      description: 'El paquete ha sido recogido'
    }
  ]
}

const mockTracking3: TrackingInfo = {
  carrier: 'Correos Express',
  tracking_number: 'CEX456789123ES',
  tracking_url: 'https://www.correosexpress.com/web/correosexpress/consultar-envios?numero=CEX456789123ES',
  shipped_at: '2026-08-24T11:00:00Z',
  estimated_delivery: '2026-08-27T18:00:00Z',
  status: 'in_transit',
  updates: [
    {
      date: '2026-08-24T11:00:00Z',
      location: 'Madrid, España',
      status: 'Enviado',
      description: 'El envío ha sido aceptado por Correos Express'
    }
  ]
}

// ============================================================================
// Mock Orders
// ============================================================================

export const mockFranchiseeOrders: FranchiseeOrder[] = [
  // Order 1: En tránsito (Shipped)
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z01',
    display_id: 'CF-10045',
    status: 'shipped',
    email: 'franquicia.barcelona@carrefour.es',
    customer_id: 'cus_01HY5FVQM2KN8PQRST6WXY7Z00',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    // Supplier info
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z10',
    supplier_name: 'Suministros Corporativos SA',
    
    items: [
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z02',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z01',
        product_id: 'prod_001',
        variant_id: 'var_001_m',
        title: 'Polo Corporativo Carrefour - Talla M',
        description: 'Polo con logo bordado',
        thumbnail: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        quantity: 50,
        unit_price: 1850, // €18.50
        subtotal: 92500, // €925.00
        tax_total: 19425, // 21% IVA
        total: 111925,
        metadata: {
          sku: 'POLO-CAR-M',
          pack_size: 10
        }
      },
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z03',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z01',
        product_id: 'prod_004',
        title: 'Detergente Industrial 5L',
        description: 'Para limpieza de suelos',
        thumbnail: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        quantity: 20,
        unit_price: 2350, // €23.50
        subtotal: 47000, // €470.00
        tax_total: 9870, // 21% IVA
        total: 56870,
        metadata: {
          sku: 'DET-IND-5L'
        }
      }
    ],
    
    shipping_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    billing_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    subtotal: 139500, // €1,395.00
    tax_total: 29295, // €292.95
    shipping_total: 0,
    discount_total: 0,
    total: 168795, // €1,687.95
    
    payment_status: 'captured',
    fulfillment_status: 'shipped',
    
    tracking: mockTracking1,
    can_cancel: false,
    can_return: true,
    return_deadline: '2026-09-22T23:59:59Z', // 30 days from delivery
    
    notes: 'Entregar en almacén trasero',
    metadata: {
      purchase_order: 'PO-2026-0845'
    },
    
    created_at: '2026-08-22T15:30:00Z',
    updated_at: '2026-08-25T08:15:00Z',
    
    status_history: [
      {
        from_status: 'processing',
        to_status: 'shipped',
        changed_at: '2026-08-23T10:30:00Z',
        reason: 'Pedido enviado con SEUR'
      },
      {
        from_status: 'confirmed',
        to_status: 'processing',
        changed_at: '2026-08-22T16:00:00Z',
        reason: 'Pedido en preparación'
      },
      {
        from_status: 'pending',
        to_status: 'confirmed',
        changed_at: '2026-08-22T15:45:00Z',
        reason: 'Pedido confirmado por proveedor'
      }
    ]
  },

  // Order 2: Entregado (Delivered)
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z04',
    display_id: 'CF-10044',
    status: 'delivered',
    email: 'franquicia.barcelona@carrefour.es',
    customer_id: 'cus_01HY5FVQM2KN8PQRST6WXY7Z00',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z11',
    supplier_name: 'Papelería y Publicidad SL',
    
    items: [
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z05',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z04',
        product_id: 'prod_002',
        title: 'Folleto Promocional A5 - 2000 unidades',
        description: 'Folletos para promociones',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
        quantity: 2,
        unit_price: 8900, // €89.00
        subtotal: 17800, // €178.00
        tax_total: 3738, // 21% IVA
        total: 21538,
        metadata: {
          sku: 'FOLL-A5-2000'
        }
      }
    ],
    
    shipping_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    subtotal: 17800,
    tax_total: 3738,
    shipping_total: 0,
    discount_total: 0,
    total: 21538,
    
    payment_status: 'captured',
    fulfillment_status: 'fulfilled',
    
    tracking: mockTracking2,
    can_cancel: false,
    can_return: false,
    
    created_at: '2026-08-19T10:00:00Z',
    updated_at: '2026-08-22T16:45:00Z',
    completed_at: '2026-08-22T16:45:00Z',
    
    status_history: [
      {
        from_status: 'shipped',
        to_status: 'delivered',
        changed_at: '2026-08-22T16:45:00Z',
        reason: 'Pedido entregado'
      },
      {
        from_status: 'processing',
        to_status: 'shipped',
        changed_at: '2026-08-20T09:00:00Z',
        reason: 'Pedido enviado con MRW'
      },
      {
        from_status: 'confirmed',
        to_status: 'processing',
        changed_at: '2026-08-19T11:00:00Z',
        reason: 'Pedido en preparación'
      }
    ]
  },

  // Order 3: Confirmado (Confirmed)
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z06',
    display_id: 'CF-10046',
    status: 'confirmed',
    email: 'franquicia.barcelona@carrefour.es',
    customer_id: 'cus_01HY5FVQM2KN8PQRST6WXY7Z00',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z10',
    supplier_name: 'Suministros Corporativos SA',
    
    items: [
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z07',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z06',
        product_id: 'prod_005',
        title: 'Bolsas de Papel Kraft - Pack 100 unidades',
        description: 'Bolsas reciclables con logo',
        thumbnail: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        quantity: 50,
        unit_price: 1850, // €18.50
        subtotal: 92500, // €925.00
        tax_total: 19425, // 21% IVA
        total: 111925,
        metadata: {
          sku: 'BOLSA-KRAFT-100'
        }
      }
    ],
    
    shipping_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    subtotal: 92500,
    tax_total: 19425,
    shipping_total: 0,
    discount_total: 0,
    total: 111925,
    
    payment_status: 'captured',
    fulfillment_status: 'not_fulfilled',
    
    can_cancel: true,
    can_return: false,
    
    created_at: '2026-08-24T14:00:00Z',
    updated_at: '2026-08-24T14:30:00Z',
    
    status_history: [
      {
        from_status: 'pending',
        to_status: 'confirmed',
        changed_at: '2026-08-24T14:30:00Z',
        reason: 'Pedido confirmado por proveedor'
      }
    ]
  },

  // Order 4: En procesamiento (Processing)
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z08',
    display_id: 'CF-10047',
    status: 'processing',
    email: 'franquicia.barcelona@carrefour.es',
    customer_id: 'cus_01HY5FVQM2KN8PQRST6WXY7Z00',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z11',
    supplier_name: 'Papelería y Publicidad SL',
    
    items: [
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z09',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z08',
        product_id: 'prod_003',
        title: 'Tótem Publicitario 2m',
        description: 'Display publicitario',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
        quantity: 3,
        unit_price: 12500, // €125.00
        subtotal: 37500, // €375.00
        tax_total: 7875, // 21% IVA
        total: 45375,
        metadata: {
          sku: 'TOTEM-2M'
        }
      },
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z10',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z08',
        product_id: 'prod_001',
        variant_id: 'var_001_l',
        title: 'Polo Corporativo Carrefour - Talla L',
        description: 'Polo con logo bordado',
        thumbnail: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        quantity: 30,
        unit_price: 2200, // €22.00
        subtotal: 66000, // €660.00
        tax_total: 13860, // 21% IVA
        total: 79860,
        metadata: {
          sku: 'POLO-CAR-L',
          pack_size: 10
        }
      }
    ],
    
    shipping_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    subtotal: 103500,
    tax_total: 21735,
    shipping_total: 0,
    discount_total: 0,
    total: 125235,
    
    payment_status: 'captured',
    fulfillment_status: 'not_fulfilled',
    
    tracking: mockTracking3,
    can_cancel: false,
    can_return: false,
    
    created_at: '2026-08-24T09:00:00Z',
    updated_at: '2026-08-24T11:00:00Z',
    
    status_history: [
      {
        from_status: 'confirmed',
        to_status: 'processing',
        changed_at: '2026-08-24T10:00:00Z',
        reason: 'Pedido en preparación'
      },
      {
        from_status: 'pending',
        to_status: 'confirmed',
        changed_at: '2026-08-24T09:15:00Z',
        reason: 'Pedido confirmado por proveedor'
      }
    ]
  },

  // Order 5: Pendiente (Pending)
  {
    id: 'order_01HY5FVQM2KN8PQRST6WXY7Z11',
    display_id: 'CF-10048',
    status: 'pending',
    email: 'franquicia.barcelona@carrefour.es',
    customer_id: 'cus_01HY5FVQM2KN8PQRST6WXY7Z00',
    region_id: 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE',
    currency_code: 'EUR',
    
    supplier_id: 'seller_01HY5FVQM2KN8PQRST6WXY7Z10',
    supplier_name: 'Suministros Corporativos SA',
    
    items: [
      {
        id: 'item_01HY5FVQM2KN8PQRST6WXY7Z12',
        order_id: 'order_01HY5FVQM2KN8PQRST6WXY7Z11',
        product_id: 'prod_004',
        title: 'Detergente Industrial 5L',
        description: 'Para limpieza de suelos',
        thumbnail: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        quantity: 10,
        unit_price: 2350, // €23.50
        subtotal: 23500, // €235.00
        tax_total: 4935, // 21% IVA
        total: 28435,
        metadata: {
          sku: 'DET-IND-5L'
        }
      }
    ],
    
    shipping_address: {
      first_name: 'Juan',
      last_name: 'García',
      company: 'Carrefour Barcelona Norte',
      address_1: 'Avinguda Meridiana 358',
      city: 'Barcelona',
      province: 'Barcelona',
      postal_code: '08027',
      country_code: 'ES',
      phone: '+34 933 123 456'
    },
    
    subtotal: 23500,
    tax_total: 4935,
    shipping_total: 0,
    discount_total: 0,
    total: 28435,
    
    payment_status: 'awaiting',
    fulfillment_status: 'not_fulfilled',
    
    can_cancel: true,
    can_return: false,
    
    notes: 'Pedido urgente - contactar al proveedor',
    
    created_at: '2026-08-25T11:30:00Z',
    updated_at: '2026-08-25T11:30:00Z'
  }
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getMockOrderById(id: string): FranchiseeOrder | undefined {
  return mockFranchiseeOrders.find(order => order.id === id || order.display_id === id)
}

export function getMockOrdersByStatus(status: string): FranchiseeOrder[] {
  return mockFranchiseeOrders.filter(order => order.status === status)
}

export function getMockOrderStats() {
  const orders = mockFranchiseeOrders
  
  return {
    total_orders: orders.length,
    pending_orders: orders.filter(o => o.status === 'pending').length,
    in_transit_orders: orders.filter(o => o.status === 'shipped').length,
    delivered_orders: orders.filter(o => o.status === 'delivered').length,
    cancelled_orders: orders.filter(o => o.status === 'cancelled').length,
    total_spent: orders.reduce((sum, o) => sum + o.total, 0),
    average_order_value: Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length),
    last_order_date: orders[0]?.created_at
  }
}
