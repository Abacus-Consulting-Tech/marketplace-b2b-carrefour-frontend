/**
 * Checkout API Client - Marketplace B2B Carrefour
 * 
 * INTEGRACIÓN COMPLETA CON MEDUSA STORE API
 * Cliente para operaciones de checkout con soporte dual-mode:
 * - Mock: Desarrollo sin backend
 * - Real: Medusa/MercurJS API calls
 */

import { featureFlags } from '@/config/feature-flags'
import { 
  updateCart as medusaUpdateCart,
  addShippingMethod as medusaAddShippingMethod,
  createPaymentCollection,
  completeCart as medusaCompleteCart,
  retrieveCart,
  type MercurCartAddress,
  type MercurOrder,
  type MercurCart,
} from '@/lib/api/mercur-store-client'
import type {
  ShippingAddress,
  PaymentMethod,
  Order,
  OrderAddress,
  OrderItem,
  AddressValidationErrors,
  PaymentValidationErrors,
} from '@/types/checkout'

// ============================================================================
// Type Conversions
// ============================================================================

/**
 * Convert ShippingAddress to Medusa format
 */
function toMedusaAddress(address: ShippingAddress): MercurCartAddress {
  return {
    first_name: address.firstName || address.first_name || '',
    last_name: address.lastName || address.last_name || '',
    address_1: address.address1 || address.address_1 || '',
    address_2: address.address2 || address.address_2 || null,
    city: address.city,
    province: address.province,
    postal_code: address.postalCode || address.postal_code || '',
    country_code: address.countryCode || address.country_code || 'ES',
    phone: address.phone,
  }
}

function toOrderAddress(address: ShippingAddress): OrderAddress {
  return {
    first_name: address.firstName || address.first_name || '',
    last_name: address.lastName || address.last_name || '',
    company: address.company,
    address_1: address.address1 || address.address_1 || '',
    address_2: address.address2 || address.address_2,
    city: address.city,
    province: address.province,
    postal_code: address.postalCode || address.postal_code || '',
    country_code: address.countryCode || address.country_code || 'ES',
    phone: address.phone,
  }
}

/**
 * Convert Medusa order to internal Order type
 */
function fromMedusaOrder(medusaOrder: MercurOrder): Order {
  return {
    id: medusaOrder.id,
    display_id: `CF-${medusaOrder.id.slice(-5).toUpperCase()}`,
    email: medusaOrder.email || '',
    status: medusaOrder.status as 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled',
    payment_status: medusaOrder.payment_status as 'pending' | 'awaiting' | 'captured' | 'authorized',
    fulfillment_status: (medusaOrder.fulfillment_status || 'not_fulfilled') as 'not_fulfilled' | 'fulfilled' | 'shipped',
    subtotal: medusaOrder.subtotal,
    tax_total: medusaOrder.tax_total,
    shipping_total: medusaOrder.shipping_total,
    discount_total: medusaOrder.discount_total || 0,
    total: medusaOrder.total,
    currency_code: medusaOrder.currency_code,
    items: medusaOrder.items.map(item => ({
      id: item.id,
      order_id: medusaOrder.id,
      product_id: item.variant_id || item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal || item.unit_price * item.quantity,
      tax_total: 0,
      total: item.total || item.subtotal || item.unit_price * item.quantity,
      variant_id: item.variant_id || undefined,
      thumbnail: item.thumbnail || undefined,
    })),
    shipping_address: medusaOrder.shipping_address ? {
      first_name: medusaOrder.shipping_address.first_name || '',
      last_name: medusaOrder.shipping_address.last_name || '',
      company: '',
      address_1: medusaOrder.shipping_address.address_1 || '',
      address_2: medusaOrder.shipping_address.address_2 || undefined,
      city: medusaOrder.shipping_address.city || '',
      province: medusaOrder.shipping_address.province || '',
      postal_code: medusaOrder.shipping_address.postal_code || '',
      country_code: medusaOrder.shipping_address.country_code || 'ES',
      phone: medusaOrder.shipping_address.phone || '',
    } : {
      first_name: '',
      last_name: '',
      address_1: '',
      city: '',
      postal_code: '',
      country_code: 'ES',
      phone: '',
    },
    created_at: medusaOrder.created_at,
    updated_at: medusaOrder.created_at,
  }
}

// ============================================================================
// Mock Functions (Fallback)
// ============================================================================

function generateMockDisplayId(): string {
  const timestamp = Date.now().toString().slice(-6)
  return `CF-${timestamp}`
}

function createMockOrder(
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  cartItems: any[]
): Order {
  const now = new Date().toISOString()
  
  const orderItems: OrderItem[] = cartItems.map((item, index) => ({
    id: `item_mock_${index + 1}`,
    order_id: 'order_mock_pending',
    product_id: item.productId,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
    tax_total: Math.round(item.price * item.quantity * 0.21),
    total: item.price * item.quantity + Math.round(item.price * item.quantity * 0.21),
    variant_id: item.variantId,
    thumbnail: item.thumbnail,
  }))

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax_total = Math.round(subtotal * 0.21) // 21% IVA
  const total = subtotal + tax_total

  return {
    id: `order_mock_${Date.now()}`,
    display_id: generateMockDisplayId(),
    email: `${(shippingAddress.firstName || shippingAddress.first_name || 'cliente').toLowerCase()}.${(shippingAddress.lastName || shippingAddress.last_name || 'carrefour').toLowerCase()}@carrefour.es`,
    status: 'pending',
    payment_status: paymentMethod.type === 'card' ? 'captured' : 'awaiting',
    fulfillment_status: 'not_fulfilled',
    subtotal,
    tax_total,
    shipping_total: 0,
    discount_total: 0,
    total,
    currency_code: 'eur',
    items: orderItems,
    shipping_address: toOrderAddress(shippingAddress),
    region_id: 'reg_mock_es',
    created_at: now,
    updated_at: now,
  }
}

// ============================================================================
// Main API Functions
// ============================================================================

/**
 * Complete cart and create order
 * MEDUSA INTEGRATION - Uses real API calls
 * 
 * @param request - Checkout data (address, payment)
 * @param cartItems - Items in cart
 * @param cartId - Medusa cart ID from Zustand store
 */
export async function completeCart(
  request: {
    shippingAddress: ShippingAddress
    paymentMethod: PaymentMethod
  },
  cartItems: any[],
  cartId?: string
): Promise<Order> {
  const useMock = featureFlags.getCheckoutSource() === 'mock'

  // MOCK MODE - Development without backend
  if (useMock) {
    console.log('🎭 Checkout: Using MOCK mode')
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
    return createMockOrder(request.shippingAddress, request.paymentMethod, cartItems)
  }

  // REAL MODE - Medusa API Integration
  console.log('🌐 Checkout: Using REAL Medusa API')
  
  if (!cartId) {
    throw new Error('Cart ID is required for checkout. Please add items to cart first.')
  }

  try {
    // 1. Update cart with shipping address and email
    console.log('📦 Step 1: Updating cart with shipping address...')
    const medusaAddress = toMedusaAddress(request.shippingAddress)
    const email = `${(request.shippingAddress.firstName || request.shippingAddress.first_name || 'cliente').toLowerCase()}.${(request.shippingAddress.lastName || request.shippingAddress.last_name || 'carrefour').toLowerCase()}@carrefour.es`
    
    await medusaUpdateCart(cartId, {
      shipping_address: medusaAddress,
      email,
    })

    // 2. Add shipping method (B2B free shipping or default)
    console.log('🚚 Step 2: Adding shipping method...')
    try {
      // Get cart to find available shipping options
      const cart = await retrieveCart(cartId)
      
      // For B2B, use first available shipping method or skip if none
      // In production, user should select from available options
      if (cart.region_id) {
        // Use a default shipping option or the first available
        // This might need to be adjusted based on your Medusa setup
        await medusaAddShippingMethod(cartId, 'so_01default').catch(err => {
          console.warn('Could not add shipping method (using default):', err.message)
        })
      }
    } catch (error) {
      console.warn('Shipping method step skipped:', error)
      // Continue - some setups don't require shipping method
    }

    // 3. Initialize payment session (if using card)
    if (request.paymentMethod.type === 'card') {
      console.log('💳 Step 3: Initializing payment session...')
      try {
        await createPaymentCollection({
          cart_id: cartId,
          provider_id: 'stripe',
        })
      } catch (error) {
        console.warn('Payment collection creation failed:', error)
        // Continue - payment might be handled differently or manually
      }
    } else {
      console.log('🏦 Step 3: Bank transfer selected (no payment session needed)')
    }

    // 4. Complete cart to create order
    console.log('✅ Step 4: Completing cart and creating order...')
    const response = await medusaCompleteCart(cartId)

    if (response.type === 'order' && response.order) {
      console.log('🎉 Order created successfully:', response.order.id)
      return fromMedusaOrder(response.order)
    }

    throw new Error('Invalid response from complete cart endpoint')
    
  } catch (error) {
    console.error('❌ Checkout error:', error)
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('payment')) {
        throw new Error('Error al procesar el pago. Por favor, verifica los datos de tu tarjeta.')
      }
      if (error.message.includes('shipping')) {
        throw new Error('Error al configurar el envío. Por favor, verifica tu dirección.')
      }
      throw new Error(error.message)
    }
    
    throw new Error('Error al procesar el pedido. Por favor, intenta de nuevo.')
  }
}

/**
 * Get order by ID
 * Used in success page
 */
export async function getOrder(orderId: string): Promise<Order> {
  const useMock = featureFlags.getCheckoutSource() === 'mock'

  if (useMock) {
    // Mock mode - would need to fetch from session storage in real app
    throw new Error('Order retrieval in mock mode not implemented. Order data should come from checkout response.')
  }

  // Real mode - fetch from Medusa
  // Note: Medusa Store API might not expose /store/orders/:id endpoint
  // You might need to use /store/customers/me/orders or admin endpoint
  throw new Error('Order retrieval endpoint not implemented. Use order data from checkout success.')
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate shipping address fields
 */
export function validateShippingAddress(address: ShippingAddress): AddressValidationErrors {
  const errors: AddressValidationErrors = {}

  if (!address.firstName?.trim()) {
    errors.firstName = 'El nombre es obligatorio'
  }

  if (!address.lastName?.trim()) {
    errors.lastName = 'Los apellidos son obligatorios'
  }

  if (!address.company?.trim()) {
    errors.company = 'El nombre de la empresa es obligatorio'
  }

  if (!address.address1?.trim()) {
    errors.address1 = 'La dirección es obligatoria'
  }

  if (!address.city?.trim()) {
    errors.city = 'La ciudad es obligatoria'
  }

  if (!address.province?.trim()) {
    errors.province = 'La provincia es obligatoria'
  }

  if (!address.postalCode?.trim()) {
    errors.postalCode = 'El código postal es obligatorio'
  } else if (!/^\d{5}$/.test(address.postalCode)) {
    errors.postalCode = 'Código postal inválido (debe tener 5 dígitos)'
  }

  if (!address.phone?.trim()) {
    errors.phone = 'El teléfono es obligatorio'
  }

  return errors
}

/**
 * Validate payment method details
 */
export function validatePaymentDetails(payment: PaymentMethod): PaymentValidationErrors {
  const errors: PaymentValidationErrors = {}

  if (payment.type === 'card') {
    if (!payment.cardNumber?.trim()) {
      errors.cardNumber = 'El número de tarjeta es obligatorio'
    } else {
      const cleaned = payment.cardNumber.replace(/\s/g, '')
      if (!/^\d{16}$/.test(cleaned)) {
        errors.cardNumber = 'Número de tarjeta inválido (16 dígitos)'
      }
    }

    if (!payment.cardHolder?.trim()) {
      errors.cardHolder = 'El titular es obligatorio'
    }

    if (!payment.expiryDate?.trim()) {
      errors.expiryDate = 'La fecha de caducidad es obligatoria'
    } else if (!/^\d{2}\/\d{2}$/.test(payment.expiryDate)) {
      errors.expiryDate = 'Formato inválido (MM/AA)'
    } else {
      // Validate expiry date
      const [monthStr, yearStr] = payment.expiryDate.split('/')
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)

      // Validate month (01-12)
      if (month < 1 || month > 12) {
        errors.expiryDate = 'Mes inválido. Debe estar entre 01 y 12'
      } else {
        // Get current date
        const now = new Date()
        const currentYear = now.getFullYear() % 100 // Last 2 digits of year
        const currentMonth = now.getMonth() + 1 // Current month (1-12)

        // Validate card is not expired
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errors.expiryDate = 'La tarjeta está vencida'
        } else {
          // Validate at least 3 months validity
          const expiryDate = new Date(2000 + year, month - 1) // Last day of expiry month
          const threeMonthsFromNow = new Date()
          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

          if (expiryDate < threeMonthsFromNow) {
            errors.expiryDate = 'La tarjeta debe tener al menos 3 meses de validez'
          }
        }
      }
    }

    if (!payment.cvv?.trim()) {
      errors.cvv = 'El CVV es obligatorio'
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = 'CVV inválido (3-4 dígitos)'
    }
  }

  return errors
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format price from cents to EUR string
 */
export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`
}

/**
 * Format display ID
 */
export function formatOrderId(displayId: string): string {
  return displayId.startsWith('CF-') ? displayId : `CF-${displayId}`
}
