/**
 * Franchisee Management Types
 * 
 * Aligned with Medusa Customer entity + B2B extensions
 * Uses Medusa Admin API endpoints for customer management
 */

// ============================================================================
// Core Medusa Types (Customer-based)
// ============================================================================

export interface Address {
  id: string;
  customer_id?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code: string;
  phone?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Franchisee Type (extends Medusa Customer)
// ============================================================================

export interface FranchiseeMetadata {
  // Company info
  company_name?: string;
  tax_id?: string;           // CIF/NIF
  store_name?: string;
  store_code?: string;
  
  // Location
  city?: string;
  region?: string;
  country?: string;
  
  // Business settings
  credit_limit?: number;
  discount_tier?: string;    // 'basic' | 'silver' | 'gold' | 'platinum'
  payment_terms?: number;    // Days (e.g., 30, 60, 90)
  
  // Status & permissions
  is_active?: boolean;
  approved_at?: string;
  approved_by?: string;
  
  // Statistics (cached)
  total_orders?: number;
  total_spent?: number;
  last_order_at?: string;
  
  // Additional
  notes?: string;
  tags?: string[];
}

export interface Franchisee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  has_account: boolean;
  
  // Medusa customer fields
  billing_address_id?: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  
  // Group membership
  groups?: CustomerGroup[];
  
  // Metadata (B2B specific fields)
  metadata: FranchiseeMetadata;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ============================================================================
// Order Summary (for franchisee stats)
// ============================================================================

export interface OrderSummary {
  id: string;
  display_id: number;
  status: string;
  total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
}

export interface FranchiseeStats {
  franchisee_id: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date?: string;
  first_order_date?: string;
  orders_by_status: {
    pending: number;
    completed: number;
    canceled: number;
  };
  orders_by_month: {
    month: string;
    count: number;
    total: number;
  }[];
  top_categories?: {
    category: string;
    count: number;
    total: number;
  }[];
}

// ============================================================================
// Request/Response Types
// ============================================================================

// List Franchisees
export interface ListFranchiseesFilters {
  q?: string;                  // Search query
  limit?: number;              // Pagination
  offset?: number;
  expand?: string;             // e.g., "billing_address,shipping_addresses,groups"
  groups?: string[];           // Filter by customer group
  has_account?: boolean;
  created_at?: {
    lt?: string;
    gt?: string;
    gte?: string;
    lte?: string;
  };
}

export interface ListFranchiseesResponse {
  customers: Franchisee[];
  count: number;
  offset: number;
  limit: number;
}

// Create Franchisee
export interface CreateFranchiseeRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password?: string;          // If creating account
  
  // Metadata
  metadata: {
    company_name: string;
    tax_id: string;
    store_name: string;
    store_code?: string;
    city: string;
    region?: string;
    country?: string;
    credit_limit?: number;
    discount_tier?: string;
    payment_terms?: number;
    is_active?: boolean;
    notes?: string;
  };
  
  // Groups
  groups?: { id: string }[];  // Add to "B2B Franchisees" group
}

export interface CreateFranchiseeResponse {
  customer: Franchisee;
}

// Update Franchisee
export interface UpdateFranchiseeRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  billing_address_id?: string;
  metadata?: Partial<FranchiseeMetadata>;
  groups?: { id: string }[];
}

export interface UpdateFranchiseeResponse {
  customer: Franchisee;
}

// Get Franchisee
export interface GetFranchiseeRequest {
  id: string;
  expand?: string;  // "billing_address,shipping_addresses,groups,orders"
}

export interface GetFranchiseeResponse {
  customer: Franchisee;
}

// Delete Franchisee
export interface DeleteFranchiseeResponse {
  id: string;
  object: 'customer';
  deleted: boolean;
}

// Addresses
export interface AddAddressRequest {
  address: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
    metadata?: Record<string, any>;
  };
}

export interface AddAddressResponse {
  customer: Franchisee;
}

export interface UpdateAddressRequest {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface UpdateAddressResponse {
  customer: Franchisee;
}

// Orders
export interface GetFranchiseeOrdersRequest {
  customer_id: string;
  limit?: number;
  offset?: number;
  status?: string[];
  created_at?: {
    lt?: string;
    gt?: string;
  };
}

export interface GetFranchiseeOrdersResponse {
  orders: OrderSummary[];
  count: number;
  offset: number;
  limit: number;
}

// Stats
export interface GetFranchiseeStatsResponse {
  stats: FranchiseeStats;
}

// Bulk Actions
export interface BulkUpdateFranchiseesRequest {
  customer_ids: string[];
  metadata?: Partial<FranchiseeMetadata>;
  groups?: { id: string }[];
}

export interface BulkUpdateFranchiseesResponse {
  updated: number;
  customers: Franchisee[];
}

// ============================================================================
// UI Helper Types
// ============================================================================

export type FranchiseeStatus = 'active' | 'inactive' | 'pending';
export type DiscountTier = 'basic' | 'silver' | 'gold' | 'platinum';

export interface FranchiseeFilterOptions {
  status?: FranchiseeStatus[];
  tier?: DiscountTier[];
  region?: string[];
  hasOrders?: boolean;
  search?: string;
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
