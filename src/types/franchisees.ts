/**
 * Franchisee Management Types
 *
 * Canonical admin contract is the custom B2B `/admin/franchisees*` family.
 * A small set of compatibility fields remains because some UI surfaces still
 * read the older customer-shaped model while the migration is in progress.
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
  company_name?: string;
  tax_id?: string;
  store_name?: string;
  store_code?: string;
  address?: string;
  city?: string;
  municipality?: string;
  postal_code?: string;
  region?: string;
  country?: string;
  is_active?: boolean;
  approved_at?: string;
  approved_by?: string;
  status?: 'pending_approval' | 'active' | 'suspended' | 'inactive';
  subscription_status?: 'not_configured' | 'pending' | 'active' | 'past_due' | 'canceled';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  onboarding_status?: 'pending_payment' | 'pending_approval' | 'approved_pending_credentials' | 'credentials_sent' | 'active';
  total_orders?: number;
  total_spent?: number;
  last_order_at?: string;
  notes?: string;
  tags?: string[];
  discount_tier?: string;
  credit_limit?: number;
  payment_terms?: number;
}

export interface Franchisee {
  id: string;
  name?: string;
  email: string;
  tax_id?: string;
  contact_person?: string;
  phone?: string;
  company_name?: string;
  store_code?: string;
  region?: string;
  address?: string;
  municipality?: string;
  postal_code?: string;
  country?: string;
  status?: 'pending_approval' | 'active' | 'suspended' | 'inactive';
  subscription_status?: 'not_configured' | 'pending' | 'active' | 'past_due' | 'canceled';

  // Compatibility fields for existing UI during migration.
  first_name?: string;
  last_name?: string;
  has_account?: boolean;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  groups?: CustomerGroup[];
  metadata: FranchiseeMetadata;

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
  search?: string;             // Backend compatibility alias
  limit?: number;              // Pagination
  offset?: number;
  take?: number;               // Backend compatibility alias
  skip?: number;               // Backend compatibility alias
  expand?: string;
  groups?: string[];
  has_account?: boolean;
  status?: FranchiseeStatus;
  created_at?: {
    lt?: string;
    gt?: string;
    gte?: string;
    lte?: string;
  };
}

export interface ListFranchiseesResponse {
  franchisees: Franchisee[];
  total: number;
  skip: number;
  take: number;
  customers?: Franchisee[];
  count?: number;
  offset?: number;
  limit?: number;
}

// Create Franchisee
export interface CreateFranchiseeRequest {
  name: string;
  email: string;
  tax_id: string;
  contact_person?: string;
  company_name?: string;
  phone?: string;
  store_code?: string;
  region?: string;
  address?: string;
  municipality?: string;
  postal_code?: string;
  country?: string;
}

export interface CreateFranchiseeResponse {
  franchisee: Franchisee;
  customer?: Franchisee;
}

// Update Franchisee
export interface UpdateFranchiseeRequest {
  name?: string;
  email?: string;
  tax_id?: string;
  contact_person?: string;
  company_name?: string;
  phone?: string;
  store_code?: string;
  region?: string;
  address?: string;
  municipality?: string;
  postal_code?: string;
  country?: string;
}

export interface UpdateFranchiseeResponse {
  franchisee: Franchisee;
  customer?: Franchisee;
}

// Get Franchisee
export interface GetFranchiseeRequest {
  id: string;
  expand?: string;
}

export interface GetFranchiseeResponse {
  franchisee: Franchisee;
  customer?: Franchisee;
}

// Delete Franchisee
export interface DeleteFranchiseeResponse {
  id: string;
  object?: 'franchisee' | 'customer';
  deleted: boolean;
  deleted_at?: string;
}

// ============================================================================
// Invite Franchisee (lightweight admin action: name + email only, sends the
// franchisee a link to /franchisee/register to complete their own data)
// ============================================================================

export interface InviteFranchiseeRequest {
  name: string;
  email: string;
}

export interface FranchiseeInvitation {
  id: string;
  name: string;
  email: string;
  registrationUrl: string;
  invitationToken?: string;
  status: 'pending' | 'used' | 'expired';
  createdAt: string;
}

export interface InviteFranchiseeResponse {
  invitation: FranchiseeInvitation;
}

// ============================================================================
// Public Self-Registration (proposed flow, backend endpoint not built yet —
// see docs/modules/12-franchisee-management/FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md)
// ============================================================================

export interface FranchiseeRegistrationForm {
  invitationToken: string;

  // Paso 1: Datos personales
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;

  // Paso 2: Datos de la empresa
  companyName: string;
  taxId: string;
  fiscalAddress: string;
  municipality: string;
  postalCode: string;
  country: string;

  // Paso 3: Datos financieros
  iban?: string;
  bankHolderName?: string;
  swiftBic?: string; // Recomendado para cuentas fuera de España (ver bankAccount.swift en API_SPEC.md)

  // Paso 4: Pago (cuota de alta)
  cardHolderName?: string;
}

export interface RegisterFranchiseeRequest {
  invitationToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  taxId: string;
  fiscalAddress: string;
  municipality: string;
  postalCode: string;
  country: string;
  stripePaymentMethodId?: string;
}

export interface RegisterFranchiseeBilling {
  client_secret?: string;
}

export interface RegisterFranchiseeResponse {
  franchisee: Franchisee;
  billing?: RegisterFranchiseeBilling;
}

export interface FranchiseeInvitationPrefill {
  firstName?: string;
  lastName?: string;
  email?: string;
  invitationToken?: string;
}

// ============================================================================
// Franchisee Stores (a franchisee can own several physical stores)
// ============================================================================

export interface FranchiseeStore {
  id: string;
  franchiseeId: string;
  name: string;
  taxId?: string;
  address: string;
  city: string;
  postalCode?: string;
  countryCode?: string;
  createdAt: string;
  archivedAt?: string;
}

export interface CreateFranchiseeStoreRequest {
  name: string;
  taxId?: string;
  address: string;
  city: string;
  postalCode?: string;
  countryCode?: string;
}

export interface ListFranchiseeStoresResponse {
  stores: FranchiseeStore[];
  total?: number;
}

export interface CreateFranchiseeStoreResponse {
  store: FranchiseeStore;
}

export interface DeleteFranchiseeStoreResponse {
  id: string;
  deleted: boolean;
}

// ============================================================================
// Franchisee Invoices (read-only from Odoo/backend when available)
// ============================================================================

export interface FranchiseeInvoice {
  id: string;
  franchiseeId: string;
  number: string;
  issueDate: string;
  amount: number;
  currencyCode: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
}

export interface ListFranchiseeInvoicesResponse {
  invoices: FranchiseeInvoice[];
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
  franchisee?: Franchisee;
  customer?: Franchisee;
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
  franchisee?: Franchisee;
  customer?: Franchisee;
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
  franchisees?: Franchisee[];
  customers?: Franchisee[];
}

// ============================================================================
// UI Helper Types
// ============================================================================

export type FranchiseeStatus = 'active' | 'inactive' | 'pending_approval' | 'suspended';
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
