/**
 * Product Management Types
 * 
 * Based on Medusa Product entity with B2B extensions
 */

export type ProductStatus = 'draft' | 'proposed' | 'published' | 'rejected';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  
  // Pricing
  variants: ProductVariant[];
  
  // Organization
  collection_id?: string;
  collection?: ProductCollection;
  categories?: ProductCategory[];
  type_id?: string;
  type?: ProductType;
  tags?: ProductTag[];
  
  // Media
  thumbnail?: string;
  images?: ProductImage[];
  
  // Status
  status: ProductStatus;
  
  // Metadata
  metadata?: ProductMetadata;
  
  // Relations
  supplier_id?: string;
  supplier?: Supplier;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku?: string;
  barcode?: string;
  ean?: string;
  upc?: string;
  
  // Pricing
  prices: Price[];
  
  // Inventory
  inventory_quantity: number;
  manage_inventory: boolean;
  allow_backorder: boolean;
  
  // Physical
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  
  // Options
  options?: VariantOption[];
  
  // Metadata
  metadata?: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: string;
  currency_code: string;
  amount: number;
  min_quantity?: number;
  max_quantity?: number;
  price_list_id?: string;
}

export interface VariantOption {
  id: string;
  option_id: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, any>;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  handle: string;
  parent_category_id?: string;
  rank?: number;
  metadata?: Record<string, any>;
}

export interface ProductType {
  id: string;
  value: string;
  metadata?: Record<string, any>;
}

export interface ProductTag {
  id: string;
  value: string;
  metadata?: Record<string, any>;
}

export interface ProductMetadata {
  // B2B specific fields
  units_per_pack?: number;
  pack_description?: string;
  min_order_quantity?: number;
  max_order_quantity?: number;
  lead_time_days?: number;
  
  // Approval
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  
  // Categorization
  subcategory?: string;
  business_unit?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Additional
  [key: string]: any;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  logo?: string;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface ListProductsFilters {
  q?: string; // Search query
  status?: Product['status'];
  supplier_id?: string;
  category_id?: string;
  collection_id?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ListProductsResponse {
  products: Product[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetProductRequest {
  id: string;
  expand?: string; // e.g., "variants,images,categories,supplier"
}

export interface GetProductResponse {
  product: Product;
}

export interface CreateProductRequest {
  title: string;
  subtitle?: string;
  description?: string;
  status?: Product['status'];
  thumbnail?: string;
  images?: string[];
  
  // Variants
  variants?: CreateVariantData[];
  
  // Organization
  collection_id?: string;
  categories?: string[];
  type?: string;
  tags?: string[];
  
  // B2B
  supplier_id?: string;
  
  // Metadata
  metadata?: ProductMetadata;
}

export interface CreateVariantData {
  title: string;
  sku?: string;
  prices: { currency_code: string; amount: number }[];
  inventory_quantity?: number;
  manage_inventory?: boolean;
  options?: { [key: string]: string };
  metadata?: Record<string, any>;
}

export interface CreateProductResponse {
  product: Product;
}

export interface UpdateProductRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  status?: Product['status'];
  thumbnail?: string;
  images?: string[];
  collection_id?: string;
  categories?: string[];
  type?: string;
  tags?: string[];
  metadata?: ProductMetadata;
}

export interface UpdateProductResponse {
  product: Product;
}

export interface DeleteProductResponse {
  id: string;
  object: 'product';
  deleted: boolean;
}

export interface UpdateInventoryRequest {
  variant_id: string;
  quantity: number;
  reason?: string;
}

export interface UpdateInventoryResponse {
  variant: ProductVariant;
}

export interface BulkUpdateStatusRequest {
  product_ids: string[];
  status: Product['status'];
}

export interface BulkUpdateStatusResponse {
  updated_count: number;
}

export interface ProductStats {
  total_products: number;
  by_status: {
    draft: number;
    proposed: number;
    published: number;
    rejected: number;
  };
  by_supplier: {
    supplier_id: string;
    supplier_name: string;
    product_count: number;
  }[];
  low_stock_count: number;
  out_of_stock_count: number;
}

export interface GetProductStatsResponse {
  stats: ProductStats;
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
