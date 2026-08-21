/**
 * Products Pricing API Client
 * 
 * Dual mode client (mock/real) for product proposal & pricing approval workflow
 * Mode controlled by feature flags in @/config/feature-flags
 */

import { featureFlags } from '@/config/feature-flags';
import type {
  Product,
  Seller,
  SellerMarkup,
  SellerMarkupHistory,
  ProposeProductRequest,
  ProposeProductResponse,
  PendingProductsFilters,
  PendingProductsResponse,
  PricingApprovalRequest,
  PricingApprovalResponse,
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
  mockApproveProduct,
  mockRejectProduct,
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
const API_BASE_URL = featureFlags.getApiBaseUrl('pricing') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Pricing API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('pricing') ? 'Yes ✅' : 'No ⏳'})`
  );
}

/**
 * Get auth token from storage or context
 * TODO: Replace with actual auth implementation
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || null;
}

/**
 * Create headers for API requests
 */
function createHeaders(sellerId?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (sellerId) {
    headers['x-seller-id'] = sellerId;
  }

  return headers;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

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

    return apiRequest<ProposeProductResponse>('/vendor/custom/products', {
      method: 'POST',
      headers: createHeaders(request.sellerId),
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

    return apiRequest<Product[]>('/vendor/custom/products', {
      method: 'GET',
      headers: createHeaders(sellerId),
    });
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
      headers: createHeaders(sellerId),
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
      headers: createHeaders(sellerId),
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
      headers: createHeaders(),
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
    markup: number
  ): Promise<ApiResponse<PricingApprovalResponse>> {
    if (isMockMode) {
      return mockApproveProduct(productId, markup);
    }

    return apiRequest<PricingApprovalResponse>(
      `/admin/custom/products/${productId}/pricing-approval`,
      {
        method: 'PATCH',
        headers: createHeaders(),
        body: JSON.stringify({
          status: 'approved',
          markup_percentage: markup,
        }),
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
        headers: createHeaders(),
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: reason,
        }),
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
      headers: createHeaders(),
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
        headers: createHeaders(),
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
      headers: createHeaders(),
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
      headers: createHeaders(),
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
