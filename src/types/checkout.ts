/**
 * Checkout Types - Marketplace B2B Carrefour
 * 
 * Tipos para el proceso de checkout y creación de órdenes
 * Alineados con Medusa 2.x checkout flow
 */

// ============================================================================
// Address Types
// ============================================================================

export interface ShippingAddress {
  id?: string
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city: string
  province?: string
  postal_code?: string
  country_code?: string // ISO 2-letter code (e.g., "es")
  phone: string
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  postalCode?: string
  countryCode?: string
  metadata?: Record<string, any>
}

export interface BillingAddress extends ShippingAddress {
  same_as_shipping?: boolean
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethodType = 'card' | 'bank_transfer' | 'transfer' | 'invoice' | 'cash'

export interface PaymentMethod {
  type: PaymentMethodType
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  card_number?: string
  card_holder?: string
  expiry_date?: string
  bank_reference?: string
  invoice_address?: BillingAddress
  tax_id?: string
  metadata?: Record<string, any>
}

export interface PaymentDetails {
  method: PaymentMethodType
  // Card payment
  card_number?: string
  card_holder?: string
  expiry_date?: string
  cvv?: string
  // Transfer
  bank_reference?: string
  // Invoice
  invoice_address?: BillingAddress
  tax_id?: string
  // Metadata
  metadata?: Record<string, any>
}

// ============================================================================
// Checkout Step Types
// ============================================================================

export type CheckoutStep = 'address' | 'payment' | 'review'

export interface CheckoutState {
  currentStep: CheckoutStep
  completedSteps: CheckoutStep[]
  shippingAddress?: ShippingAddress
  billingAddress?: BillingAddress
  paymentDetails?: PaymentDetails
  notes?: string
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderItem {
  id: string
  order_id?: string
  product_id?: string
  variant_id?: string
  title: string
  description?: string
  thumbnail?: string
  quantity: number
  unit_price: number
  subtotal: number
  tax_total?: number
  total?: number
  metadata?: Record<string, any>
}

export interface OrderAddress {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'awaiting'
  | 'captured'
  | 'authorized'
  | 'partially_refunded'
  | 'refunded'
  | 'cancelled'

export type FulfillmentStatus =
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'shipped'
  | 'returned'
  | 'cancelled'

export interface Order {
  id: string
  display_id: string // Human-readable ID (e.g., "CF-10001")
  status: OrderStatus
  email: string
  customer_id?: string
  region_id?: string
  currency_code: string
  
  // Items
  items: OrderItem[]
  
  // Addresses
  shipping_address: OrderAddress
  billing_address?: OrderAddress
  
  // Totals (in cents)
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  total: number
  
  // Payment & Fulfillment
  payment_status: PaymentStatus
  fulfillment_status: FulfillmentStatus
  
  // Metadata
  notes?: string
  metadata?: Record<string, any>
  
  // Timestamps
  created_at: string
  updated_at?: string
  cancelled_at?: string
  completed_at?: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CompleteCartRequest {
  cart_id: string
  shipping_address: ShippingAddress
  billing_address?: BillingAddress
  payment_method: PaymentMethodType
  payment_details?: Record<string, any>
  notes?: string
}

export interface CompleteCartResponse {
  order: Order
}

export interface CreateOrderRequest {
  region_id: string
  email: string
  shipping_address: ShippingAddress
  billing_address?: BillingAddress
  items: {
    variant_id: string
    quantity: number
  }[]
  payment_method: PaymentMethodType
  notes?: string
}

// ============================================================================
// Validation Types
// ============================================================================

export interface AddressValidationErrors {
  first_name?: string
  last_name?: string
  address_1?: string
  firstName?: string
  lastName?: string
  company?: string
  address1?: string
  city?: string
  province?: string
  postal_code?: string
  postalCode?: string
  country_code?: string
  phone?: string
}

export interface PaymentValidationErrors {
  method?: string
  card_number?: string
  card_holder?: string
  expiry_date?: string
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  bank_reference?: string
  tax_id?: string
}

// ============================================================================
// Helper Types
// ============================================================================

export interface CheckoutStepConfig {
  id: CheckoutStep
  title: string
  description: string
  isComplete: boolean
  isActive: boolean
}
