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
  specifications: Record<string, any>
  category?: string
  supplier?: {
    id: string
    name: string
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

export interface Order {
  id: string
  orderNumber: string
  franchiseeId: string
  supplierId: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  currency: string
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

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
}

// Supplier types
export type SupplierStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export interface Supplier {
  id: string
  companyName: string
  legalName: string
  cif: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  status: SupplierStatus
  contactPerson: {
    name: string
    email: string
    phone: string
  }
  bankAccount?: string
  taxId: string
  productCategories: string[]
  website?: string
  description?: string
  logo?: string
  rating?: number
  totalProducts?: number
  totalOrders?: number
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
  rejectedReason?: string
}
