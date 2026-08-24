/**
 * Products API Client
 * 
 * Dual mode client (mock/real) for product management
 * Mode controlled by feature flags
 * 
 * Medusa endpoints:
 * - GET /admin/products
 * - POST /admin/products
 * - POST /admin/products/:id
 * - DELETE /admin/products/:id
 * - POST /admin/products/:id/variants
 * - POST /admin/products/:id/variants/:variantId
 * - GET /admin/product-categories
 * - GET /admin/product-tags
 */

import { featureFlags } from '@/config/feature-flags';
import type {
  Product,
  ListProductsFilters,
  ListProductsResponse,
  GetProductRequest,
  GetProductResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  UpdateInventoryRequest,
  UpdateInventoryResponse,
  BulkUpdateStatusRequest,
  BulkUpdateStatusResponse,
  GetProductStatsResponse,
  ApiResponse,
} from '@/types/products';

import {
  mockProducts,
  mockSuppliers,
  mockCategories,
  getProductById,
  getProductsByFilters,
  getMockProductStats,
  addMockProduct,
  updateMockProduct,
  deleteMockProduct,
  getMockProducts,
} from './products-mock';

// ============================================================================
// Configuration
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('products');
const API_BASE_URL = featureFlags.getApiBaseUrl('products') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Products API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('products') ? 'Yes ✅' : 'No ⏳'})`
  );
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || null;
}

/**
 * Create headers for API requests
 */
function createHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
        ...createHeaders(),
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
// Mock Mode Implementations
// ============================================================================

const MOCK_DELAY_MS = 300;

async function mockDelay<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return data;
}

function mockListProducts(filters?: ListProductsFilters): Promise<ApiResponse<ListProductsResponse>> {
  return mockDelay({
    data: {
      products: getProductsByFilters({
        search: filters?.q,
        status: filters?.status,
        supplier_id: filters?.supplier_id,
        category_id: filters?.category_id,
      }),
      count: getMockProducts().length,
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
    },
  });
}

function mockGetProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
  return mockDelay({
    data: {
      product: getProductById(request.id)!,
    },
  });
}

function mockCreateProduct(request: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    title: request.title,
    subtitle: request.subtitle,
    description: request.description,
    handle: request.title.toLowerCase().replace(/\s+/g, '-'),
    status: request.status || 'draft',
    thumbnail: request.thumbnail,
    images: request.images?.map((url, i) => ({ id: `img_${i}`, url })),
    supplier_id: request.supplier_id,
    supplier: mockSuppliers.find((s) => s.id === request.supplier_id),
    variants: request.variants?.map((v, i) => ({
      id: `var_${Date.now()}_${i}`,
      product_id: `prod_${Date.now()}`,
      title: v.title,
      sku: v.sku,
      inventory_quantity: v.inventory_quantity || 0,
      manage_inventory: v.manage_inventory ?? true,
      allow_backorder: false,
      prices: v.prices.map((p, j) => ({
        id: `price_${Date.now()}_${j}`,
        ...p,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) || [],
    categories: request.categories?.map((id, i) => ({
      id,
      name: 'Category',
      handle: 'category',
    })),
    tags: request.tags?.map((value) => ({
      id: `tag_${value}`,
      value,
    })),
    metadata: request.metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  addMockProduct(newProduct);

  return mockDelay({
    data: {
      product: newProduct,
    },
  });
}

function mockUpdateProduct(id: string, request: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
  // Transform request data to match Product structure
  const updates: Partial<Product> = {
    ...request,
    updated_at: new Date().toISOString(),
  };

  // Transform tags from string[] to ProductTag[]
  if (request.tags) {
    updates.tags = request.tags.map((tag) => ({
      id: `tag_${tag.toLowerCase().replace(/\s+/g, '_')}`,
      value: tag,
    }));
  }

  // Transform category IDs to ProductCategory[]
  if (request.categories) {
    updates.categories = request.categories
      .map((catId) => mockCategories.find((c) => c.id === catId))
      .filter(Boolean) as any;
  }

  const updated = updateMockProduct(id, updates);

  return mockDelay({
    data: {
      product: updated!,
    },
  });
}

function mockDeleteProduct(id: string): Promise<ApiResponse<DeleteProductResponse>> {
  deleteMockProduct(id);

  return mockDelay({
    data: {
      id,
      object: 'product',
      deleted: true,
    },
  });
}

function mockUpdateInventory(request: UpdateInventoryRequest): Promise<ApiResponse<UpdateInventoryResponse>> {
  // Find product with this variant and update inventory
  const products = getMockProducts();
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === request.variant_id);
    if (variant) {
      variant.inventory_quantity = request.quantity;
      variant.updated_at = new Date().toISOString();

      return mockDelay({
        data: {
          variant,
        },
      });
    }
  }

  throw new Error('Variant not found');
}

function mockBulkUpdateStatus(request: BulkUpdateStatusRequest): Promise<ApiResponse<BulkUpdateStatusResponse>> {
  let count = 0;
  request.product_ids.forEach((id) => {
    const updated = updateMockProduct(id, {
      status: request.status,
      updated_at: new Date().toISOString(),
    });
    if (updated) count++;
  });

  return mockDelay({
    data: {
      updated_count: count,
    },
  });
}

function mockGetProductStats(): Promise<ApiResponse<GetProductStatsResponse>> {
  return mockDelay({
    data: {
      stats: getMockProductStats(),
    },
  });
}

// ============================================================================
// Real API Mode Implementations
// ============================================================================

async function realListProducts(filters?: ListProductsFilters): Promise<ApiResponse<ListProductsResponse>> {
  const params = new URLSearchParams();
  if (filters?.q) params.append('q', filters.q);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
  if (filters?.category_id) params.append('category_id[]', filters.category_id);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  return apiRequest<ListProductsResponse>(`/admin/products?${params.toString()}`);
}

async function realGetProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
  const expand = request.expand ? `?expand=${request.expand}` : '';
  return apiRequest<GetProductResponse>(`/admin/products/${request.id}${expand}`);
}

async function realCreateProduct(request: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
  return apiRequest<CreateProductResponse>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

async function realUpdateProduct(id: string, request: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
  return apiRequest<UpdateProductResponse>(`/admin/products/${id}`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

async function realDeleteProduct(id: string): Promise<ApiResponse<DeleteProductResponse>> {
  return apiRequest<DeleteProductResponse>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

async function realUpdateInventory(request: UpdateInventoryRequest): Promise<ApiResponse<UpdateInventoryResponse>> {
  // Medusa uses inventory items, this is a simplified version
  return apiRequest<UpdateInventoryResponse>(`/admin/variants/${request.variant_id}/inventory`, {
    method: 'POST',
    body: JSON.stringify({ quantity: request.quantity }),
  });
}

async function realBulkUpdateStatus(request: BulkUpdateStatusRequest): Promise<ApiResponse<BulkUpdateStatusResponse>> {
  // Custom endpoint for bulk operations
  return apiRequest<BulkUpdateStatusResponse>('/admin/products/bulk-update-status', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

async function realGetProductStats(): Promise<ApiResponse<GetProductStatsResponse>> {
  // Custom stats endpoint
  return apiRequest<GetProductStatsResponse>('/admin/products/stats');
}

// ============================================================================
// Exported API
// ============================================================================

export const productsApi = {
  /**
   * List products with optional filters
   */
  listProducts(filters?: ListProductsFilters): Promise<ApiResponse<ListProductsResponse>> {
    return isMockMode ? mockListProducts(filters) : realListProducts(filters);
  },

  /**
   * Get product by ID
   */
  getProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
    return isMockMode ? mockGetProduct(request) : realGetProduct(request);
  },

  /**
   * Create new product
   */
  createProduct(request: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
    return isMockMode ? mockCreateProduct(request) : realCreateProduct(request);
  },

  /**
   * Update existing product
   */
  updateProduct(id: string, request: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
    return isMockMode ? mockUpdateProduct(id, request) : realUpdateProduct(id, request);
  },

  /**
   * Delete product
   */
  deleteProduct(id: string): Promise<ApiResponse<DeleteProductResponse>> {
    return isMockMode ? mockDeleteProduct(id) : realDeleteProduct(id);
  },

  /**
   * Update variant inventory
   */
  updateInventory(request: UpdateInventoryRequest): Promise<ApiResponse<UpdateInventoryResponse>> {
    return isMockMode ? mockUpdateInventory(request) : realUpdateInventory(request);
  },

  /**
   * Bulk update product status
   */
  bulkUpdateStatus(request: BulkUpdateStatusRequest): Promise<ApiResponse<BulkUpdateStatusResponse>> {
    return isMockMode ? mockBulkUpdateStatus(request) : realBulkUpdateStatus(request);
  },

  /**
   * Get product statistics
   */
  getStats(): Promise<ApiResponse<GetProductStatsResponse>> {
    return isMockMode ? mockGetProductStats() : realGetProductStats();
  },
};
