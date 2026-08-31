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
import { createApiHeaders } from './api-utils';
import type {
  Product,
  ProductStatus,
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
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com';

function getApiBaseUrl(): string {
  return typeof window !== 'undefined' ? '/api' : BACKEND_API_URL;
}

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Products API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('products') ? 'Yes ✅' : 'No ⏳'})`
  );
}

/**
 * Generic API request handler
 */
interface RequestOptions extends RequestInit {
  isStore?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { isStore = false, ...fetchOptions } = options;
    const url = `${getApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...createApiHeaders({ isStore }),
        ...fetchOptions.headers,
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

type BackendProductRecord = Record<string, any>;

function toProductStatus(status: unknown): ProductStatus {
  switch (status) {
    case 'published':
    case 'approved':
      return 'published';
    case 'pending_approval':
    case 'proposed':
      return 'proposed';
    case 'rejected':
      return 'rejected';
    default:
      return 'draft';
  }
}

function toCents(amount: unknown): number {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 0;
  }

  return Number.isInteger(amount) && amount >= 1000 ? amount : Math.round(amount * 100);
}

function normalizeVariant(productId: string, rawVariant: BackendProductRecord, fallbackTitle: string) {
  const priceAmount = Array.isArray(rawVariant.prices) && rawVariant.prices[0]?.amount !== undefined
    ? rawVariant.prices[0].amount
    : rawVariant.base_price ?? rawVariant.unit_price ?? rawVariant.price ?? 0;

  return {
    id: rawVariant.id ?? rawVariant.variant_id ?? `${productId}-default-variant`,
    product_id: productId,
    title: rawVariant.title ?? fallbackTitle,
    sku: rawVariant.sku ?? rawVariant.ean ?? productId,
    ean: rawVariant.ean,
    inventory_quantity: rawVariant.inventory_quantity ?? rawVariant.stock_available ?? rawVariant.stock ?? 0,
    manage_inventory: rawVariant.manage_inventory ?? true,
    allow_backorder: rawVariant.allow_backorder ?? false,
    prices: Array.isArray(rawVariant.prices) && rawVariant.prices.length > 0
      ? rawVariant.prices.map((price: BackendProductRecord, index: number) => ({
          id: price.id ?? `${productId}-price-${index}`,
          currency_code: price.currency_code ?? rawVariant.currency ?? 'EUR',
          amount: typeof price.amount === 'number' ? price.amount : toCents(priceAmount),
        }))
      : [{
          id: `${productId}-price-default`,
          currency_code: rawVariant.currency ?? 'EUR',
          amount: toCents(priceAmount),
        }],
    created_at: rawVariant.created_at ?? new Date().toISOString(),
    updated_at: rawVariant.updated_at ?? rawVariant.created_at ?? new Date().toISOString(),
  };
}

function normalizeProduct(rawProduct: BackendProductRecord): Product {
  const id = rawProduct.id ?? rawProduct.product_id ?? rawProduct.offer_id ?? `prod_${Date.now()}`;
  const title = rawProduct.title ?? rawProduct.name ?? rawProduct.product_name ?? 'Producto sin nombre';
  const rawVariants = Array.isArray(rawProduct.variants) && rawProduct.variants.length > 0
    ? rawProduct.variants
    : [rawProduct];
  const categories = Array.isArray(rawProduct.categories)
    ? rawProduct.categories.map((category: BackendProductRecord, index: number) => ({
        id: category.id ?? category.category_id ?? `${id}-category-${index}`,
        name: category.name ?? category.title ?? rawProduct.category ?? 'Sin categoría',
        description: category.description,
        handle: category.handle ?? category.name ?? `category-${index}`,
      }))
    : rawProduct.category_id || rawProduct.category
    ? [{
        id: rawProduct.category_id ?? String(rawProduct.category),
        name: rawProduct.category ?? String(rawProduct.category_id),
        handle: String(rawProduct.category_id ?? rawProduct.category).toLowerCase().replace(/\s+/g, '-'),
      }]
    : undefined;
  const images = Array.isArray(rawProduct.images)
    ? rawProduct.images.map((image: BackendProductRecord | string) =>
        typeof image === 'string' ? { id: image, url: image } : { id: image.id ?? image.url, url: image.url }
      )
    : undefined;
  const supplierId = rawProduct.supplier_id ?? rawProduct.seller_id ?? rawProduct.supplier?.id;
  const supplierName = rawProduct.supplier?.name ?? rawProduct.seller_name ?? rawProduct.supplier_name;

  return {
    id,
    title,
    subtitle: rawProduct.subtitle,
    description: rawProduct.description,
    handle: rawProduct.handle,
    status: toProductStatus(rawProduct.status),
    thumbnail: rawProduct.thumbnail ?? images?.[0]?.url,
    supplier_id: supplierId,
    supplier: supplierId
      ? {
          id: supplierId,
          name: supplierName ?? supplierId,
        }
      : undefined,
    variants: rawVariants.map((variant: BackendProductRecord) => normalizeVariant(id, variant, title)),
    categories,
    tags: Array.isArray(rawProduct.tags)
      ? rawProduct.tags.map((tag: BackendProductRecord | string, index: number) =>
          typeof tag === 'string'
            ? { id: `${id}-tag-${index}`, value: tag }
            : { id: tag.id ?? `${id}-tag-${index}`, value: tag.value ?? tag.name ?? '' }
        )
      : undefined,
    images,
    metadata: rawProduct.metadata,
    created_at: rawProduct.created_at ?? new Date().toISOString(),
    updated_at: rawProduct.updated_at ?? rawProduct.created_at ?? new Date().toISOString(),
  };
}

function normalizeListResponse(rawData: BackendProductRecord | BackendProductRecord[]): ListProductsResponse {
  const rawProducts = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData.products)
    ? rawData.products
    : [];

  return {
    products: rawProducts.map(normalizeProduct),
    count: Array.isArray(rawData) ? rawProducts.length : rawData.count ?? rawData.total ?? rawProducts.length,
    offset: Array.isArray(rawData) ? 0 : rawData.offset ?? rawData.skip ?? 0,
    limit: Array.isArray(rawData) ? rawProducts.length : rawData.limit ?? rawData.take ?? rawProducts.length,
  };
}

function normalizeGetResponse(rawData: BackendProductRecord): GetProductResponse {
  const product = rawData.product ? normalizeProduct(rawData.product) : normalizeProduct(rawData);
  return { product };
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
  } as Partial<Product>;

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
  if (filters?.category_id) params.append('category_id', filters.category_id);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const data = await apiRequest<BackendProductRecord | BackendProductRecord[]>(
    `/admin/custom/catalog-products${params.toString() ? `?${params.toString()}` : ''}`
  );

  return { data: normalizeListResponse(data.data ?? data) };
}

async function realGetProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
  const expand = request.expand ? `?expand=${request.expand}` : '';
  const data = await apiRequest<BackendProductRecord>(`/admin/custom/catalog-products/${request.id}${expand}`);
  return { data: normalizeGetResponse(data.data ?? data) };
}

async function realCreateProduct(request: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
  return apiRequest<CreateProductResponse>('/admin/custom/catalog-products', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

async function realUpdateProduct(id: string, request: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
  return apiRequest<UpdateProductResponse>(`/admin/custom/catalog-products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}

async function realDeleteProduct(id: string): Promise<ApiResponse<DeleteProductResponse>> {
  return apiRequest<DeleteProductResponse>(`/admin/custom/catalog-products/${id}`, {
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
  return apiRequest<BulkUpdateStatusResponse>('/admin/custom/catalog-products/bulk-update-status', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

async function realGetProductStats(): Promise<ApiResponse<GetProductStatsResponse>> {
  // Custom stats endpoint
  return apiRequest<GetProductStatsResponse>('/admin/custom/catalog-products/stats');
}

async function realListCatalogProducts(filters?: ListProductsFilters): Promise<ApiResponse<ListProductsResponse>> {
  const params = new URLSearchParams();
  if (filters?.q) params.append('search', filters.q);
  if (filters?.supplier_id) {
    params.append('seller_id', filters.supplier_id);
    params.append('supplier_id', filters.supplier_id);
  }
  if (filters?.category_id) params.append('category_id', filters.category_id);
  if (filters?.limit) params.append('take', filters.limit.toString());
  if (filters?.offset) params.append('skip', filters.offset.toString());

  const data = await apiRequest<BackendProductRecord | BackendProductRecord[]>(
    `/store/products${params.toString() ? `?${params.toString()}` : ''}`,
    { isStore: true }
  );

  return { data: normalizeListResponse(data.data ?? data) };
}

async function realGetCatalogProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
  const data = await apiRequest<BackendProductRecord>(`/store/products/${request.id}`, {
    isStore: true,
  });

  return { data: normalizeGetResponse(data.data ?? data) };
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

  listCatalogProducts(filters?: ListProductsFilters): Promise<ApiResponse<ListProductsResponse>> {
    return isMockMode ? mockListProducts(filters) : realListCatalogProducts(filters);
  },

  getCatalogProduct(request: GetProductRequest): Promise<ApiResponse<GetProductResponse>> {
    return isMockMode ? mockGetProduct(request) : realGetCatalogProduct(request);
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
