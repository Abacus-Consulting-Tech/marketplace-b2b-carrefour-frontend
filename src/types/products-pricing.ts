/**
 * Types for Product Proposal & Pricing Approval Workflow
 * 
 * This module handles:
 * - Suppliers proposing products with base pricing
 * - Admins reviewing and approving with markup percentages
 * - Dynamic pricing calculation (product-specific or seller-global markup)
 */

// ============================================================================
// Core Product Types
// ============================================================================

export type PricingStatus = 'pending_approval' | 'approved' | 'rejected';

export interface ProductVariant {
  id?: string;
  title: string;
  sku: string;
  base_price: number;
  inventory_quantity?: number;
  manage_inventory?: boolean;
  options?: Record<string, string>; // e.g., { "Talla": "M", "Color": "Azul" }
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  base_price: number;
  units_per_pack: number;
  category_id?: string;
  subcategory?: string;
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  
  // Seller info
  seller_id: string;
  seller_name?: string;
  
  // Variants (optional)
  variants?: ProductVariant[];
  
  // Pricing & approval
  status: PricingStatus;
  markup_percentage?: number | null; // Product-specific markup (null = use seller global)
  rejection_reason?: string;
  
  // Metadata
  ean?: string;
  tax_rate?: number; // IVA: 21, 10, 4, 0
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string; // Admin user who approved
  rejected_at?: string;
  rejected_by?: string; // Admin user who rejected
}

// ============================================================================
// Seller / Supplier Types
// ============================================================================

export interface Seller {
  id: string;
  name: string;
  email: string;
  global_markup_percentage: number; // Default markup for all products (0-500)
  total_products?: number;
  pending_products?: number;
  approved_products?: number;
}

export interface SellerMarkup {
  seller_id: string;
  global_markup_percentage: number;
  updated_at: string;
  updated_by?: string;
}

export interface SellerMarkupHistory {
  id: string;
  seller_id: string;
  previous_markup: number;
  new_markup: number;
  changed_by: string; // Admin user ID/email
  changed_at: string;
  reason?: string;
  affected_products_count: number;
}

// ============================================================================
// Request/Response Types
// ============================================================================

// Supplier: Propose Product
export interface ProposeProductRequest {
  sellerId: string;
  title: string;
  description?: string;
  base_price: number;
  units_per_pack: number;
  category_id?: string;
  subcategory?: string;
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  variants?: Omit<ProductVariant, 'id'>[];
  ean?: string;
  tax_rate?: number;
}

export interface ProposeProductResponse {
  product: Product;
  message: string;
}

// Admin: Get Pending Products
export interface PendingProductsFilters {
  seller_id?: string;
  category_id?: string;
  limit?: number;
  offset?: number;
}

export interface PendingProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

// Admin: Approve/Reject Product
export interface ApproveProductRequest {
  status: 'approved';
  markup_percentage: number; // 0-500
}

export interface RejectProductRequest {
  status: 'rejected';
  rejection_reason: string;
}

export type PricingApprovalRequest = ApproveProductRequest | RejectProductRequest;

export interface PricingApprovalResponse {
  product: Product;
  message: string;
}

// Admin: Update Seller Markup
export interface UpdateSellerMarkupRequest {
  global_markup_percentage: number; // 0-500
  reason?: string; // Optional reason for the change
}

export interface UpdateSellerMarkupResponse {
  seller_markup: SellerMarkup;
  affected_products: number; // Number of products using global markup
  message: string;
}

// Admin: Get Seller Markup History
export interface GetSellerMarkupHistoryRequest {
  seller_id: string;
  limit?: number;
  offset?: number;
}

export interface GetSellerMarkupHistoryResponse {
  history: SellerMarkupHistory[];
  total: number;
  seller: Seller;
}

// ============================================================================
// Bulk Upload Types (Phase 9 - CSV/Excel)
// ============================================================================

export interface ProductProposal {
  // Core fields
  title: string;
  description?: string;
  category_id?: string;
  subcategory?: string;
  
  // Pricing
  sku: string;
  ean?: string;
  base_price: number;
  tax_rate?: number;
  units_per_pack: number;
  
  // Inventory
  stock?: number;
  manage_inventory?: boolean;
  
  // Media
  thumbnail?: string;
  images?: string[];
  
  // Variants (optional)
  variant_option_1_name?: string;
  variant_option_1_value?: string;
  variant_option_2_name?: string;
  variant_option_2_value?: string;
  variant_option_3_name?: string;
  variant_option_3_value?: string;
  
  // Metadata
  tags?: string[];
}

export interface ParsedProduct {
  row: number;
  data: ProductProposal;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExcelParseResult {
  valid: ParsedProduct[];
  invalid: ParsedProduct[];
  totalRows: number;
  fileName: string;
  parsedAt: string;
}

export interface BulkUploadResult {
  success: number; // Number of products created
  warnings: number; // Products created but with warnings
  errors: number; // Products skipped due to errors
  details: {
    successful: Array<{ row: number; product_id: string; title: string }>;
    warnings: Array<{ row: number; message: string; product_id: string }>;
    errors: Array<{ row: number; message: string; data: any }>;
  };
}

// ============================================================================
// Pricing Calculation Types
// ============================================================================

export interface PriceCalculation {
  basePrice: number;
  markupPercentage: number;
  markupAmount: number;
  finalPrice: number;
  currency: string;
}

export interface PriceBreakdown {
  base: string; // Formatted: "€18.50"
  markup: string; // Formatted: "15%"
  final: string; // Formatted: "€21.28"
  formula: string; // "€18.50 + 15% = €21.28"
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface ProductsListState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: PricingStatus;
    search?: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface PricingQueueState {
  pendingProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: PendingProductsFilters;
  selectedProduct: Product | null;
}
