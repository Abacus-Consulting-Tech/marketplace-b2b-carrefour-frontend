// Common types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    pagination?: PaginationMeta
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// User types
export interface User {
  id: string
  email: string
  role: 'franchisee' | 'supplier' | 'admin'
  name: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
  
  // JWT claims from Render DEV backend
  actor_type?: 'user' | 'member'  // 'user' for admin, 'member' for vendor/supplier
  actor_id?: string  // User or member ID from backend
  seller_id?: string  // Seller ID for vendor/supplier (required for /vendor/* endpoints)
}

// Supplier types
export type SupplierStatus = 'pending' | 'active' | 'rejected' | 'suspended'

export type SupplierOnboardingStatus =
  | 'pending_approval'
  | 'approved_pending_credentials'
  | 'credentials_sent'
  | 'active'
  | 'rejected'

export interface SupplierMetadata {
  onboarding_status?: SupplierOnboardingStatus
  approval_notes?: string
  credentials_sent_at?: string
  odoo_sync_status?: 'pending' | 'synced' | 'failed'
  invited_name?: string
  invited_email?: string
  reviewed_by?: string
  reviewed_at?: string
}

export interface Supplier {
  id: string
  userId: string
  status: SupplierStatus
  
  // Datos legales (página 1 del formulario)
  businessName: string // Nombre comercial
  legalName: string // Razón social
  nifCif: string // NIF/CIF
  fiscalAddress: string // Dirección fiscal completa
  municipality: string
  postalCode: string
  country: string
  iban: string
  email: string
  phone: string
  website?: string
  
  // Contacto directo (página 2)
  contactName: string
  contactSurname: string
  contactPosition: string
  contactEmail: string
  contactPhone: string
  
  // Archivos subidos (página 3)
  productsCsvUrl?: string
  imagesZipUrl?: string
  
  // Gestión admin
  approvedBy?: string
  approvedAt?: Date | string
  rejectionReason?: string
  metadata?: SupplierMetadata
  
  createdAt: string
  updatedAt: string
}

export interface SupplierRegistrationForm {
  // Página 1
  businessName: string
  legalName: string
  nifCif: string
  fiscalAddress: string
  municipality: string
  postalCode: string
  country: string
  iban: string
  email: string
  phone: string
  website?: string
  
  // Página 2
  contactName: string
  contactSurname: string
  contactPosition: string
  contactEmail: string
  contactPhone: string
}

export interface SupplierInvitation {
  id: string
  name: string
  email: string
  registrationUrl: string
  status: 'pending' | 'accepted' | 'expired'
  createdAt: string
}

export interface SupplierInvitationPrefill {
  name?: string
  email?: string
}

export interface RegisterSupplierRequest extends SupplierRegistrationForm {}

export interface RegisterSupplierResponse {
  supplier: Supplier
}

export interface InviteSupplierRequest {
  name: string
  email: string
}

export interface InviteSupplierResponse {
  invitation: SupplierInvitation
}

export interface ListSuppliersResponse {
  suppliers: Supplier[]
  count: number
}

export interface UpdateSupplierStatusRequest {
  status: SupplierStatus
  approvalNotes?: string
}

export interface UpdateSupplierRequest extends Partial<RegisterSupplierRequest> {
  metadata?: Partial<SupplierMetadata>
}

export interface ProductFromCSV {
  proveedor: string
  imagen: string
  nombre: string
  descripcion: string
  caracteristicas: string
  costeUnitario: number
  pcb: number
  importe: number
  iva: number
  plazoEntrega: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  sku: string
  categoryId: string
  supplierId: string
  price: number
  currency: string
  stock: number
  images: string[]
  rating: number
  reviewCount: number
  specifications: Record<string, string | number | boolean>
  category?: string
  supplier?: {
    id: string
    name: string
  }
  offerId?: string
  variantId?: string
  metadata?: {
    pack_label?: string
    units_per_pack?: number
    sell_unit?: string
    [key: string]: string | number | boolean | undefined
  }
  createdAt: string
  updatedAt: string
}

// Order types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_preparation'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  franchiseeId: string
  franchiseeName: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  currency: string
  shippingAddress: DeliveryAddress
  paymentMethod: 'tarjeta' | 'transferencia'
  paymentStatus: PaymentStatus
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  supplierId: string
  supplierName: string
  quantity: number
  unitPrice: number
  subtotal: number
  tax: number
}

export interface DeliveryAddress {
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  additionalInfo?: string
}

// Legacy Address type for compatibility
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Cart types
export interface CartItem {
  productId: string
  name: string
  quantity: number
  price: number
  image?: string
  backendLineItemId?: string
  offerId?: string
  variantId?: string
}

export interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
}
