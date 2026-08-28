/**
 * Products Pricing API Client
 * 
 * Dual mode client (mock/real) for product proposal & pricing approval workflow
 * Mode controlled by feature flags in @/config/feature-flags
 * 
 * Backend Integration (Render DEV):
 * - GET /admin/custom/products/pending - Pending products queue
 * - PATCH /admin/custom/products/:id/pricing-approval - Approve/reject product pricing
 * - GET /admin/custom/sellers/:id/markup - Get seller markup
 * - PATCH /admin/custom/sellers/:id/markup - Update seller markup
 * - GET /admin/custom/sellers/:id/markup/history - Markup change history
 * - POST /vendor/custom/products - Propose new product
 * - GET /vendor/custom/products - My products list
 * - GET /vendor/custom/sellers/me/markup - My markup info
 */

import { featureFlags } from '@/config/feature-flags';
import { apiRequest, buildQueryString, logApiMode, createApiHeaders } from './api-utils';
import type {
  Product,
  PricingStatus,
  Seller,
  SellerMarkup,
  SellerMarkupHistory,
  ProposeProductRequest,
  ProposeProductResponse,
  PendingProductsFilters,
  PendingProductsResponse,
  PricedProductsFilters,
  PricedProductsResponse,
  PricingApprovalRequest,
  PricingApprovalResponse,
  UpdateProductMarkupRequest,
  UpdateProductMarkupResponse,
  UpdateSellerMarkupRequest,
  UpdateSellerMarkupResponse,
  GetSellerMarkupHistoryRequest,
  GetSellerMarkupHistoryResponse,
  ApiResponse,
  BulkUploadResult,
  ProductProposal,
} from '@/types/products-pricing';

import {
  mockProposeProduct,
  mockGetMyProducts,
  mockGetPendingProducts,
  mockGetPricedProducts,
  mockApproveProduct,
  mockRejectProduct,
  mockUpdateProductMarkup,
  mockResubmitRejectedProduct,
  mockGetSellerMarkup,
  mockUpdateSellerMarkup,
  mockGetSellerMarkupHistory,
  mockGetAllSellers,
  mockBulkProposeProducts,
} from './products-pricing-mock';

// ============================================================================
// Configuration
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('pricing');
const isBackendReady = featureFlags.isBackendReady('pricing');

interface VendorProductsResponse {
  products: VendorProductResponse[];
  count?: number;
  total?: number;
  limit?: number;
  offset?: number;
}

type VendorProductResponse = Omit<Partial<Product>, 'status'> & {
  id: string;
  title: string;
  status?: string;
  pricing_status?: PricingStatus;
  metadata?: {
    base_price?: number;
    units_per_pack?: number;
    pricing_status?: PricingStatus;
    rejection_reason?: string;
  };
};

function normalizeVendorProduct(product: VendorProductResponse): Product {
  return {
    ...product,
    description: product.description,
    base_price: product.base_price ?? product.metadata?.base_price ?? 0,
    units_per_pack: product.units_per_pack ?? product.metadata?.units_per_pack ?? 1,
    seller_id: product.seller_id ?? '',
    variants: product.variants ?? [],
    status: product.pricing_status ?? product.metadata?.pricing_status ?? 'pending_approval',
    rejection_reason: product.rejection_reason ?? product.metadata?.rejection_reason,
    created_at: product.created_at ?? new Date().toISOString(),
    updated_at: product.updated_at ?? new Date().toISOString(),
  };
}

// Log mode on initialization
logApiMode('Pricing', isMockMode, isBackendReady);

// ============================================================================
// API Client
// ============================================================================

export const pricingApi = {
  /**
   * Check if running in mock mode
   */
  isMockMode: () => isMockMode,

  // ==========================================================================
  // SUPPLIER ENDPOINTS
  // ==========================================================================

  /**
   * Propose a new product (Supplier)
   * POST /vendor/custom/products
   * 
   * @param request - Product proposal data
   * @returns Created product with pending_approval status
   */
  async proposeProduct(
    request: ProposeProductRequest
  ): Promise<ApiResponse<ProposeProductResponse>> {
    if (isMockMode) {
      return mockProposeProduct(request);
    }

    const data = await apiRequest<ProposeProductResponse>('/vendor/custom/products', {
      method: 'POST',
      sellerId: request.sellerId,
      body: JSON.stringify({
        title: request.title,
        description: request.description,
        base_price: request.base_price,
        units_per_pack: request.units_per_pack,
        category_id: request.category_id,
        subcategory: request.subcategory,
        tags: request.tags,
        thumbnail: request.thumbnail,
        images: request.images,
        variants: request.variants,
        ean: request.ean,
        tax_rate: request.tax_rate,
      }),
    });
    
    return { data };
  },

  /**
   * Get all products for a supplier
   * GET /vendor/custom/products
   * 
   * @param sellerId - Supplier ID
   * @returns Array of all products (any status)
   */
  async getMyProducts(sellerId: string): Promise<ApiResponse<Product[]>> {
    if (isMockMode) {
      return mockGetMyProducts(sellerId);
    }

    const data = await apiRequest<VendorProductResponse[] | VendorProductsResponse>('/vendor/custom/products?limit=100', {
      method: 'GET',
      sellerId,
    });

    const products = Array.isArray(data) ? data : data.products ?? [];
    
    return { data: products.map(normalizeVendorProduct) };
  },

  /**
   * Get single product by ID (Supplier)
   * GET /vendor/custom/products/:id
   * 
   * @param productId - Product ID
   * @param sellerId - Supplier ID (for auth)
   * @returns Product details
   */
  async getMyProduct(
    productId: string,
    sellerId: string
  ): Promise<ApiResponse<Product>> {
    if (isMockMode) {
      const { data: products } = await mockGetMyProducts(sellerId);
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return { data: product };
    }

    return apiRequest<Product>(`/vendor/custom/products/${productId}`, {
      method: 'GET',
      headers: createApiHeaders({ sellerId }),
    });
  },

  /**
   * Bulk propose products via CSV/Excel (Supplier)
   * POST /vendor/custom/products/bulk
   * 
   * @param sellerId - Supplier ID
   * @param products - Array of product proposals from Excel
   * @returns Bulk upload result with success/error details
   */
  async bulkProposeProducts(
    sellerId: string,
    products: ProductProposal[]
  ): Promise<ApiResponse<BulkUploadResult>> {
    if (isMockMode) {
      return mockBulkProposeProducts(sellerId, products);
    }

    return apiRequest<BulkUploadResult>('/vendor/custom/products/bulk', {
      method: 'POST',
      headers: createApiHeaders({ sellerId }),
      body: JSON.stringify({ products }),
    });
  },

  // ==========================================================================
  // ADMIN ENDPOINTS
  // ==========================================================================

  /**
   * Get pending products queue (Admin)
   * GET /admin/custom/products/pending
   * 
   * @param filters - Optional filters (seller_id, category_id, pagination)
   * @returns Paginated list of pending products
   */
  async getPendingProducts(
    filters?: PendingProductsFilters
  ): Promise<ApiResponse<PendingProductsResponse>> {
    if (isMockMode) {
      return mockGetPendingProducts(filters);
    }

    const params = new URLSearchParams();
    if (filters?.seller_id) params.append('seller_id', filters.seller_id);
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/admin/custom/products/pending${queryString ? `?${queryString}` : ''}`;

    return apiRequest<PendingProductsResponse>(endpoint, {
      method: 'GET',
      headers: createApiHeaders(),
    });
  },

  /**
   * Approve product with markup (Admin)
   * PATCH /admin/custom/products/:id/pricing-approval
   * 
   * @param productId - Product ID
   * @param markup - Markup percentage (0-500)
   * @returns Updated product with approved status
   */
  async approveProduct(
    productId: string,
    markup: number | null
  ): Promise<ApiResponse<PricingApprovalResponse>> {
    if (isMockMode) {
      return mockApproveProduct(productId, markup);
    }

    return apiRequest<PricingApprovalResponse>(
      `/admin/custom/products/${productId}/pricing-approval`,
      {
        method: 'PATCH',
        headers: createApiHeaders(),
        body: JSON.stringify({
          status: 'approved',
          markup_percentage: markup,
        }),
      }
    );
  },

  /**
   * Get approved/priced products for admin markup review
   * GET /admin/custom/products
   */
  async getPricedProducts(
    filters?: PricedProductsFilters
  ): Promise<ApiResponse<PricedProductsResponse>> {
    if (isMockMode) {
      return mockGetPricedProducts(filters);
    }

    const params = new URLSearchParams();
    params.append('status', filters?.status && filters.status !== 'all' ? filters.status : 'approved');
    if (filters?.seller_id) params.append('seller_id', filters.seller_id);
    if (filters?.q) params.append('q', filters.q);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const data = await apiRequest<VendorProductResponse[] | VendorProductsResponse>('/admin/custom/products?' + params.toString(), {
      method: 'GET',
      headers: createApiHeaders(),
    });

    const products = Array.isArray(data) ? data : data.products ?? [];

    return {
      data: {
        products: products.map(normalizeVendorProduct),
        total: Array.isArray(data) ? products.length : data.total ?? data.count ?? products.length,
        limit: Array.isArray(data) ? filters?.limit ?? 50 : data.limit ?? filters?.limit ?? 50,
        offset: Array.isArray(data) ? filters?.offset ?? 0 : data.offset ?? filters?.offset ?? 0,
      },
    };
  },

  /**
   * Update product-specific markup after approval
   * PATCH /admin/custom/products/:id/markup
   */
  async updateProductMarkup(
    productId: string,
    request: UpdateProductMarkupRequest
  ): Promise<ApiResponse<UpdateProductMarkupResponse>> {
    if (isMockMode) {
      return mockUpdateProductMarkup(productId, request.markup_percentage, request.reason);
    }

    return apiRequest<UpdateProductMarkupResponse>(
      `/admin/custom/products/${productId}/markup`,
      {
        method: 'PATCH',
        headers: createApiHeaders(),
        body: JSON.stringify(request),
      }
    );
  },

  /**
   * Reject product with reason (Admin)
   * PATCH /admin/custom/products/:id/pricing-approval
   * 
   * @param productId - Product ID
   * @param reason - Rejection reason text
   * @returns Updated product with rejected status
   */
  async rejectProduct(
    productId: string,
    reason: string
  ): Promise<ApiResponse<PricingApprovalResponse>> {
    if (isMockMode) {
      return mockRejectProduct(productId, reason);
    }

    return apiRequest<PricingApprovalResponse>(
      `/admin/custom/products/${productId}/pricing-approval`,
      {
        method: 'PATCH',
        headers: createApiHeaders(),
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: reason,
        }),
      }
    );
  },

  /**
   * Resubmit a rejected product for approval (Supplier)
   * PATCH /vendor/custom/products/:id/resubmit
   * 
   * @param productId - Product ID
   * @param sellerId - Seller ID
   * @returns Updated product with pending_approval status
   */
  async resubmitRejectedProduct(
    productId: string,
    sellerId: string
  ): Promise<ApiResponse<PricingApprovalResponse>> {
    if (isMockMode) {
      return mockResubmitRejectedProduct(productId, sellerId);
    }

    return apiRequest<PricingApprovalResponse>(
      `/vendor/custom/products/${productId}/resubmit`,
      {
        method: 'PATCH',
        headers: createApiHeaders({ sellerId }),
        body: JSON.stringify({ status: 'pending_approval' }),
      }
    );
  },

  /**
   * Get seller markup (Admin or Supplier)
   * GET /admin/custom/sellers/:id/markup
   * 
   * @param sellerId - Seller ID
   * @returns Seller's global markup percentage
   */
  async getSellerMarkup(sellerId: string): Promise<ApiResponse<SellerMarkup>> {
    if (isMockMode) {
      return mockGetSellerMarkup(sellerId);
    }

    return apiRequest<SellerMarkup>(`/admin/custom/sellers/${sellerId}/markup`, {
      method: 'GET',
      headers: createApiHeaders(),
    });
  },

  /**
   * Update seller global markup (Admin)
   * PATCH /admin/custom/sellers/:id/markup
   * 
   * @param sellerId - Seller ID
   * @param request - Markup update request with percentage and optional reason
   * @returns Updated seller markup with affected products count
   */
  async updateSellerMarkup(
    sellerId: string,
    request: UpdateSellerMarkupRequest
  ): Promise<ApiResponse<UpdateSellerMarkupResponse>> {
    if (isMockMode) {
      return mockUpdateSellerMarkup(sellerId, request.global_markup_percentage, request.reason);
    }

    return apiRequest<UpdateSellerMarkupResponse>(
      `/admin/custom/sellers/${sellerId}/markup`,
      {
        method: 'PATCH',
        headers: createApiHeaders(),
        body: JSON.stringify(request),
      }
    );
  },

  /**
   * Get seller markup change history (Admin)
   * GET /admin/custom/sellers/:id/markup/history
   * 
   * @param request - Request with sellerId and optional pagination
   * @returns Markup change history with seller info
   */
  async getSellerMarkupHistory(
    request: GetSellerMarkupHistoryRequest
  ): Promise<ApiResponse<GetSellerMarkupHistoryResponse>> {
    if (isMockMode) {
      return mockGetSellerMarkupHistory(request);
    }

    const params = new URLSearchParams();
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());

    const queryString = params.toString();
    const endpoint = `/admin/custom/sellers/${request.seller_id}/markup/history${queryString ? `?${queryString}` : ''}`;

    return apiRequest<GetSellerMarkupHistoryResponse>(endpoint, {
      method: 'GET',
      headers: createApiHeaders(),
    });
  },

  /**
   * Get all sellers (Admin)
   * GET /admin/custom/sellers
   * 
   * @returns Array of all sellers with markup info
   */
  async getAllSellers(): Promise<ApiResponse<Seller[]>> {
    if (isMockMode) {
      return mockGetAllSellers();
    }

    return apiRequest<Seller[]>('/admin/custom/sellers', {
      method: 'GET',
      headers: createApiHeaders(),
    });
  },
};

/**
 * Export for use in components
 * 
 * @example
 * import { pricingApi } from '@/lib/api/products-pricing-client';
 * 
 * // Supplier proposes product
 * const result = await pricingApi.proposeProduct({
 *   sellerId: 'sel_123',
 *   title: 'Polo Corporativo',
 *   base_price: 18.50,
 *   units_per_pack: 10,
 * });
 * 
 * // Admin approves with 15% markup
 * await pricingApi.approveProduct('prod_123', 15);
 */
export default pricingApi;
