/**
 * Mock Data for Product Pricing Module
 * 
 * Provides sample data for development without backend connection
 */

import type {
  Product,
  Seller,
  SellerMarkup,
  SellerMarkupHistory,
  ProposeProductRequest,
  ProposeProductResponse,
  PendingProductsResponse,
  PendingProductsFilters,
  PricedProductsFilters,
  PricedProductsResponse,
  PricingApprovalResponse,
  UpdateProductMarkupResponse,
  UpdateSellerMarkupResponse,
  GetSellerMarkupHistoryRequest,
  GetSellerMarkupHistoryResponse,
  ApiResponse,
  BulkUploadResult,
  ProductProposal,
} from '@/types/products-pricing';

// ============================================================================
// Mock Sellers
// ============================================================================

export const mockSellers: Seller[] = [
  {
    id: 'seller@mercur.dev',
    name: 'Mercur Demo Seller',
    email: 'seller@mercur.dev',
    global_markup_percentage: 10,
    total_products: 6,
    pending_products: 2,
    approved_products: 3,
  },
  {
    id: 'sel_uniformes_corp',
    name: 'Uniformes Corp',
    email: 'contacto@uniformescorp.com',
    global_markup_percentage: 8,
    total_products: 45,
    pending_products: 4,
    approved_products: 38,
  },
  {
    id: 'sel_tech_supplies',
    name: 'Tech Supplies',
    email: 'ventas@techsupplies.com',
    global_markup_percentage: 12,
    total_products: 23,
    pending_products: 2,
    approved_products: 20,
  },
  {
    id: 'sel_food_distributor',
    name: 'Food Distributor S.L.',
    email: 'admin@fooddist.es',
    global_markup_percentage: 5,
    total_products: 67,
    pending_products: 8,
    approved_products: 55,
  },
  {
    id: 'sel_office_supplies',
    name: 'Office Supplies Pro',
    email: 'info@officesupplies.com',
    global_markup_percentage: 15,
    total_products: 12,
    pending_products: 1,
    approved_products: 10,
  },
];

// ============================================================================
// Mock Seller Markup History
// ============================================================================

export const mockSellerMarkupHistory: SellerMarkupHistory[] = [
  {
    id: 'history_001',
    seller_id: 'sel_uniformes_corp',
    previous_markup: 10,
    new_markup: 8,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-08-15T14:30:00Z',
    reason: 'Ajuste según acuerdo comercial Q3',
    affected_products_count: 35,
  },
  {
    id: 'history_002',
    seller_id: 'sel_uniformes_corp',
    previous_markup: 12,
    new_markup: 10,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-07-10T09:15:00Z',
    reason: 'Optimización de precios competitivos',
    affected_products_count: 28,
  },
  {
    id: 'history_003',
    seller_id: 'sel_tech_supplies',
    previous_markup: 15,
    new_markup: 12,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-08-01T11:00:00Z',
    reason: 'Reducción por volumen de ventas',
    affected_products_count: 18,
  },
  {
    id: 'history_004',
    seller_id: 'sel_food_distributor',
    previous_markup: 5,
    new_markup: 5,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-06-20T16:45:00Z',
    reason: 'Revisión trimestral - sin cambios',
    affected_products_count: 55,
  },
  {
    id: 'history_005',
    seller_id: 'sel_office_supplies',
    previous_markup: 18,
    new_markup: 15,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-07-25T13:20:00Z',
    reason: 'Ajuste por campaña de verano',
    affected_products_count: 10,
  },
];

// ============================================================================
// Mock Products
// ============================================================================

export const mockProducts: Product[] = [
  // PENDING PRODUCTS (awaiting approval)
  {
    id: 'prod_001',
    title: 'Polo Corporativo Manga Corta',
    description: 'Polo de alta calidad para uso corporativo. 100% algodón peinado.',
    base_price: 18.50,
    units_per_pack: 10,
    category_id: 'cat_uniformes',
    tags: ['polo', 'uniformes', 'corporativo'],
    thumbnail: 'https://placehold.co/400x400/e3f2fd/1976d2?text=Polo',
    seller_id: 'sel_uniformes_corp',
    seller_name: 'Uniformes Corp',
    status: 'pending_approval',
    ean: '8421234567890',
    tax_rate: 21,
    created_at: '2026-08-18T10:30:00Z',
    updated_at: '2026-08-18T10:30:00Z',
  },
  {
    id: 'prod_002',
    title: 'Laptop Dell Latitude 5420',
    description: 'Portátil profesional. Intel i5, 16GB RAM, 512GB SSD.',
    base_price: 450.00,
    units_per_pack: 1,
    category_id: 'cat_tecnologia',
    tags: ['laptop', 'ordenador', 'tecnologia'],
    thumbnail: 'https://placehold.co/400x400/f3e5f5/8e24aa?text=Laptop',
    seller_id: 'sel_tech_supplies',
    seller_name: 'Tech Supplies',
    status: 'pending_approval',
    ean: '0987654321098',
    tax_rate: 21,
    created_at: '2026-08-19T14:20:00Z',
    updated_at: '2026-08-19T14:20:00Z',
  },
  {
    id: 'prod_003',
    title: 'Café en Grano Premium 1kg',
    description: 'Café 100% arábica de tueste natural. Origen Colombia.',
    base_price: 12.00,
    units_per_pack: 6,
    category_id: 'cat_alimentacion',
    tags: ['cafe', 'grano', 'premium'],
    thumbnail: 'https://placehold.co/400x400/e8f5e9/388e3c?text=Cafe',
    seller_id: 'sel_food_distributor',
    seller_name: 'Food Distributor S.L.',
    status: 'pending_approval',
    created_at: '2026-08-20T09:15:00Z',
    updated_at: '2026-08-20T09:15:00Z',
  },
  {
    id: 'prod_004',
    title: 'Camiseta Corporativa Cuello Redondo',
    description: 'Camiseta básica para personalización. Disponible en varios colores.',
    base_price: 8.90,
    units_per_pack: 25,
    category_id: 'cat_uniformes',
    tags: ['camiseta', 'basica', 'personalizable'],
    thumbnail: 'https://placehold.co/400x400/fce4ec/c2185b?text=Camiseta',
    seller_id: 'sel_uniformes_corp',
    seller_name: 'Uniformes Corp',
    status: 'pending_approval',
    variants: [
      { id: 'var_001', title: 'Blanco - S', sku: 'CAM-BLC-S', base_price: 8.90, options: { Talla: 'S', Color: 'Blanco' } },
      { id: 'var_002', title: 'Blanco - M', sku: 'CAM-BLC-M', base_price: 8.90, options: { Talla: 'M', Color: 'Blanco' } },
      { id: 'var_003', title: 'Blanco - L', sku: 'CAM-BLC-L', base_price: 9.20, options: { Talla: 'L', Color: 'Blanco' } },
      { id: 'var_004', title: 'Negro - M', sku: 'CAM-NEG-M', base_price: 8.90, options: { Talla: 'M', Color: 'Negro' } },
    ],
    created_at: '2026-08-20T16:45:00Z',
    updated_at: '2026-08-20T16:45:00Z',
  },

  // APPROVED PRODUCTS (with markup)
  {
    id: 'prod_005',
    title: 'Ratón Inalámbrico Logitech M280',
    description: 'Ratón inalámbrico con receptor USB nano. Batería de 18 meses.',
    base_price: 25.00,
    units_per_pack: 20,
    category_id: 'cat_tecnologia',
    tags: ['raton', 'wireless', 'logitech'],
    thumbnail: 'https://placehold.co/400x400/fff3e0/f57c00?text=Raton',
    seller_id: 'sel_tech_supplies',
    seller_name: 'Tech Supplies',
    status: 'approved',
    markup_percentage: null, // Uses seller global (12%)
    tax_rate: 21,
    created_at: '2026-08-15T11:20:00Z',
    updated_at: '2026-08-17T09:30:00Z',
    approved_at: '2026-08-17T09:30:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_006',
    title: 'Aceite de Oliva Virgen Extra 5L',
    description: 'AOVE de primera extracción en frío. Acidez 0.2%.',
    base_price: 24.50,
    units_per_pack: 4,
    category_id: 'cat_alimentacion',
    tags: ['aceite', 'oliva', 'virgen-extra'],
    thumbnail: 'https://placehold.co/400x400/fffde7/fbc02d?text=Aceite',
    seller_id: 'sel_food_distributor',
    seller_name: 'Food Distributor S.L.',
    status: 'approved',
    markup_percentage: 15, // Product-specific markup (exception)
    tax_rate: 10,
    created_at: '2026-08-14T08:10:00Z',
    updated_at: '2026-08-16T14:20:00Z',
    approved_at: '2026-08-16T14:20:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_007',
    title: 'Pantalón de Trabajo Multibolsillos',
    description: 'Pantalón resistente con refuerzos en rodillas. Tejido ripstop.',
    base_price: 32.00,
    units_per_pack: 10,
    category_id: 'cat_uniformes',
    tags: ['pantalon', 'trabajo', 'multibolsillos'],
    thumbnail: 'https://placehold.co/400x400/e0f2f1/00897b?text=Pantalon',
    seller_id: 'sel_uniformes_corp',
    seller_name: 'Uniformes Corp',
    status: 'approved',
    markup_percentage: null, // Uses seller global (8%)
    tax_rate: 21,
    created_at: '2026-08-13T15:40:00Z',
    updated_at: '2026-08-15T10:15:00Z',
    approved_at: '2026-08-15T10:15:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_008',
    title: 'Pack 10 Bolígrafos Azules',
    description: 'Bolígrafos de escritura suave. Tinta azul indeleble.',
    base_price: 3.50,
    units_per_pack: 50,
    category_id: 'cat_papeleria',
    tags: ['boligrafos', 'escritura', 'azul'],
    thumbnail: 'https://placehold.co/400x400/e1f5fe/0277bd?text=Bolis',
    seller_id: 'sel_office_supplies',
    seller_name: 'Office Supplies Pro',
    status: 'approved',
    markup_percentage: null, // Uses seller global (15%)
    tax_rate: 21,
    created_at: '2026-08-12T12:30:00Z',
    updated_at: '2026-08-14T11:00:00Z',
    approved_at: '2026-08-14T11:00:00Z',
    approved_by: 'admin@carrefour.com',
  },

  // REJECTED PRODUCTS (with rejection reasons)
  {
    id: 'prod_009',
    title: 'Reloj Smartwatch Luxury',
    description: 'Reloj inteligente de alta gama con GPS y monitor cardíaco.',
    base_price: 999.00,
    units_per_pack: 1,
    category_id: 'cat_tecnologia',
    tags: ['reloj', 'smartwatch', 'premium'],
    thumbnail: 'https://placehold.co/400x400/fce4ec/ad1457?text=Reloj',
    seller_id: 'sel_tech_supplies',
    seller_name: 'Tech Supplies',
    status: 'rejected',
    rejection_reason: 'Precio base excede el límite acordado en contrato (máx. €800)',
    tax_rate: 21,
    created_at: '2026-08-17T13:25:00Z',
    updated_at: '2026-08-18T09:45:00Z',
    rejected_at: '2026-08-18T09:45:00Z',
    rejected_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_010',
    title: 'Vino Tinto Reserva',
    description: 'Vino tinto con 24 meses en barrica de roble.',
    base_price: 45.00,
    units_per_pack: 6,
    category_id: 'cat_alimentacion',
    tags: ['vino', 'tinto', 'reserva'],
    thumbnail: 'https://placehold.co/400x400/f3e5f5/6a1b9a?text=Vino',
    seller_id: 'sel_food_distributor',
    seller_name: 'Food Distributor S.L.',
    status: 'rejected',
    rejection_reason: 'No tenemos licencia para venta de bebidas alcohólicas en este momento',
    tax_rate: 21,
    created_at: '2026-08-16T10:15:00Z',
    updated_at: '2026-08-17T16:30:00Z',
    rejected_at: '2026-08-17T16:30:00Z',
    rejected_by: 'admin@carrefour.com',
  },
  
  // MERCUR DEMO SELLER PRODUCTS (shown for seller@mercur.dev)
  {
    id: 'prod_mercur_001',
    title: 'Kit Señalética Pasillo Carrefour',
    description: 'Pack completo de señalética interior para lineales y pasillos de tienda.',
    base_price: 145.00,
    units_per_pack: 1,
    category_id: 'cat_rotulacion',
    tags: ['senalizacion', 'carteleria', 'tienda'],
    thumbnail: 'https://placehold.co/400x400/e0f2fe/0369a1?text=Senaletica',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'pending_approval',
    ean: '8437001000001',
    tax_rate: 21,
    created_at: '2026-08-22T09:00:00Z',
    updated_at: '2026-08-22T09:00:00Z',
  },
  {
    id: 'prod_mercur_002',
    title: 'Bolsas Kraft Carrefour Pack 500',
    description: 'Bolsas kraft reciclables con asa reforzada y logo Carrefour.',
    base_price: 62.00,
    units_per_pack: 500,
    category_id: 'cat_embalaje',
    tags: ['bolsas', 'kraft', 'reciclable'],
    thumbnail: 'https://placehold.co/400x400/fef3c7/b45309?text=Bolsas',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'approved',
    markup_percentage: null,
    ean: '8437001000002',
    tax_rate: 21,
    created_at: '2026-08-19T11:20:00Z',
    updated_at: '2026-08-20T10:10:00Z',
    approved_at: '2026-08-20T10:10:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_mercur_003',
    title: 'Uniforme Delantal Frescos',
    description: 'Delantal técnico para secciones de frescos, lavable y resistente a manchas.',
    base_price: 21.50,
    units_per_pack: 20,
    category_id: 'cat_uniformes',
    tags: ['uniforme', 'delantal', 'frescos'],
    thumbnail: 'https://placehold.co/400x400/dcfce7/15803d?text=Delantal',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'approved',
    markup_percentage: 12,
    tax_rate: 21,
    variants: [
      { id: 'var_mercur_001', title: 'Azul - M', sku: 'DEL-FRE-AZU-M', base_price: 21.50, options: { Color: 'Azul', Talla: 'M' } },
      { id: 'var_mercur_002', title: 'Azul - L', sku: 'DEL-FRE-AZU-L', base_price: 22.00, options: { Color: 'Azul', Talla: 'L' } },
    ],
    created_at: '2026-08-18T15:45:00Z',
    updated_at: '2026-08-19T12:15:00Z',
    approved_at: '2026-08-19T12:15:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_mercur_004',
    title: 'Etiquetas Precio Electrónicas Pack 50',
    description: 'Etiquetas electrónicas para lineales con pantalla e-ink y soporte NFC.',
    base_price: 1250.00,
    units_per_pack: 50,
    category_id: 'cat_tecnologia',
    tags: ['etiquetas', 'precio', 'electronica'],
    thumbnail: 'https://placehold.co/400x400/ede9fe/6d28d9?text=Etiquetas',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'pending_approval',
    ean: '8437001000004',
    tax_rate: 21,
    created_at: '2026-08-23T08:30:00Z',
    updated_at: '2026-08-23T08:30:00Z',
  },
  {
    id: 'prod_mercur_005',
    title: 'Display Promocional Cartón XL',
    description: 'Display de suelo para campañas promocionales, personalizable a color.',
    base_price: 38.90,
    units_per_pack: 10,
    category_id: 'cat_rotulacion',
    tags: ['display', 'promocional', 'carton'],
    thumbnail: 'https://placehold.co/400x400/fce7f3/be185d?text=Display',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'approved',
    markup_percentage: null,
    tax_rate: 21,
    created_at: '2026-08-16T13:00:00Z',
    updated_at: '2026-08-17T16:00:00Z',
    approved_at: '2026-08-17T16:00:00Z',
    approved_by: 'admin@carrefour.com',
  },
  {
    id: 'prod_mercur_006',
    title: 'Totem Premium Doble Cara',
    description: 'Tótem rígido de doble cara para entrada de tienda y campañas estacionales.',
    base_price: 980.00,
    units_per_pack: 1,
    category_id: 'cat_rotulacion',
    tags: ['totem', 'premium', 'campana'],
    thumbnail: 'https://placehold.co/400x400/fee2e2/b91c1c?text=Totem',
    seller_id: 'seller@mercur.dev',
    seller_name: 'Mercur Demo Seller',
    status: 'rejected',
    rejection_reason: 'Precio base demasiado alto para la campaña actual. Reenviar propuesta con alternativa económica.',
    tax_rate: 21,
    created_at: '2026-08-14T09:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
    rejected_at: '2026-08-15T10:00:00Z',
    rejected_by: 'admin@carrefour.com',
  },
];

// ============================================================================
// Mock API Functions
// ============================================================================

let mockProductsStore = [...mockProducts];
let mockSellersStore = [...mockSellers];
let mockSellerMarkupHistoryStore = [...mockSellerMarkupHistory];

// Helper: Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Generate ID
const generateId = () => `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`;

const sellerAliases: Record<string, string> = {
  'supplier@test.com': 'sel_uniformes_corp',
  'supplier@carrefour.es': 'sel_uniformes_corp',
  'seller@mercur.dev': 'seller@mercur.dev',
};

const resolveSellerId = (sellerId: string) => sellerAliases[sellerId] || sellerId;

const getSellerById = (sellerId: string) => {
  const resolvedSellerId = resolveSellerId(sellerId);
  return mockSellersStore.find(s => s.id === resolvedSellerId);
};

/**
 * Mock: Propose new product (Supplier)
 */
export async function mockProposeProduct(
  request: ProposeProductRequest
): Promise<ApiResponse<ProposeProductResponse>> {
  await delay();

  const newProduct: Product = {
    id: generateId(),
    title: request.title,
    description: request.description,
    base_price: request.base_price,
    units_per_pack: request.units_per_pack,
    category_id: request.category_id,
    subcategory: request.subcategory,
    tags: request.tags,
    thumbnail: request.thumbnail,
    images: request.images,
    seller_id: resolveSellerId(request.sellerId),
    seller_name: getSellerById(request.sellerId)?.name,
    status: 'pending_approval',
    variants: request.variants,
    ean: request.ean,
    tax_rate: request.tax_rate || 21,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockProductsStore.push(newProduct);

  return {
    data: {
      product: newProduct,
      message: 'Producto propuesto correctamente. Pendiente de aprobación.',
    },
  };
}

/**
 * Mock: Get supplier's products
 */
export async function mockGetMyProducts(sellerId: string): Promise<ApiResponse<Product[]>> {
  await delay();

  const resolvedSellerId = resolveSellerId(sellerId);
  const products = mockProductsStore.filter(p => p.seller_id === resolvedSellerId);

  return {
    data: products,
    message: `${products.length} productos encontrados`,
  };
}

/**
 * Mock: Get pending products for admin
 */
export async function mockGetPendingProducts(
  filters?: PendingProductsFilters
): Promise<ApiResponse<PendingProductsResponse>> {
  await delay();

  let products = mockProductsStore.filter(p => p.status === 'pending_approval');

  // Apply filters
  if (filters?.seller_id) {
    const resolvedSellerId = resolveSellerId(filters.seller_id);
    products = products.filter(p => p.seller_id === resolvedSellerId);
  }

  if (filters?.category_id) {
    products = products.filter(p => p.category_id === filters.category_id);
  }

  // Pagination
  const offset = filters?.offset || 0;
  const limit = filters?.limit || 50;
  const paginatedProducts = products.slice(offset, offset + limit);

  return {
    data: {
      products: paginatedProducts,
      total: products.length,
      limit,
      offset,
    },
    message: `${products.length} productos pendientes`,
  };
}

/**
 * Mock: Get priced products for admin markup review
 */
export async function mockGetPricedProducts(
  filters?: PricedProductsFilters
): Promise<ApiResponse<PricedProductsResponse>> {
  await delay();

  let products = mockProductsStore.filter(p => p.status === 'approved');

  if (filters?.status && filters.status !== 'all') {
    products = products.filter(p => p.status === filters.status);
  }

  if (filters?.seller_id) {
    const resolvedSellerId = resolveSellerId(filters.seller_id);
    products = products.filter(p => p.seller_id === resolvedSellerId);
  }

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.ean?.toLowerCase().includes(query)
    );
  }

  const offset = filters?.offset || 0;
  const limit = filters?.limit || 50;
  const paginatedProducts = products.slice(offset, offset + limit);

  return {
    data: {
      products: paginatedProducts,
      total: products.length,
      limit,
      offset,
    },
    message: `${products.length} productos tarificados`,
  };
}

/**
 * Mock: Approve product with markup
 */
export async function mockApproveProduct(
  productId: string,
  markup: number | null
): Promise<ApiResponse<PricingApprovalResponse>> {
  await delay();

  const productIndex = mockProductsStore.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return {
      data: null as any,
      error: 'Producto no encontrado',
    };
  }

  const product = mockProductsStore[productIndex];
  const updatedProduct: Product = {
    ...product,
    status: 'approved',
    markup_percentage: markup,
    updated_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    approved_by: 'admin@carrefour.com', // Mock admin user
  };

  mockProductsStore[productIndex] = updatedProduct;

  return {
    data: {
      product: updatedProduct,
      message: markup === null
        ? 'Producto aprobado con markup global del proveedor'
        : `Producto aprobado con markup del ${markup}%`,
    },
  };
}

/**
 * Mock: Update product-specific markup after approval
 */
export async function mockUpdateProductMarkup(
  productId: string,
  markup: number | null,
  reason?: string
): Promise<ApiResponse<UpdateProductMarkupResponse>> {
  await delay();

  const productIndex = mockProductsStore.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return {
      data: null as any,
      error: 'Producto no encontrado',
    };
  }

  const product = mockProductsStore[productIndex];
  const updatedProduct: Product = {
    ...product,
    markup_percentage: markup,
    updated_at: new Date().toISOString(),
  };

  mockProductsStore[productIndex] = updatedProduct;

  return {
    data: {
      product: updatedProduct,
      message: markup === null
        ? 'Producto configurado para usar el markup global del proveedor'
        : `Markup específico actualizado a ${markup}%`,
    },
  };
}

/**
 * Mock: Reject product with reason
 */
export async function mockRejectProduct(
  productId: string,
  reason: string
): Promise<ApiResponse<PricingApprovalResponse>> {
  await delay();

  const productIndex = mockProductsStore.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return {
      data: null as any,
      error: 'Producto no encontrado',
    };
  }

  const product = mockProductsStore[productIndex];
  const updatedProduct: Product = {
    ...product,
    status: 'rejected',
    rejection_reason: reason,
    updated_at: new Date().toISOString(),
    rejected_at: new Date().toISOString(),
    rejected_by: 'admin@carrefour.com', // Mock admin user
  };

  mockProductsStore[productIndex] = updatedProduct;

  return {
    data: {
      product: updatedProduct,
      message: 'Producto rechazado',
    },
  };
}

/**
 * Mock: Resubmit rejected product for approval (Supplier)
 */
export async function mockResubmitRejectedProduct(
  productId: string,
  sellerId: string
): Promise<ApiResponse<PricingApprovalResponse>> {
  await delay();

  const resolvedSellerId = resolveSellerId(sellerId);
  const productIndex = mockProductsStore.findIndex(
    p => p.id === productId && p.seller_id === resolvedSellerId
  );

  if (productIndex === -1) {
    return {
      data: null as any,
      error: 'Producto no encontrado',
    };
  }

  const product = mockProductsStore[productIndex];
  const updatedProduct: Product = {
    ...product,
    status: 'pending_approval',
    rejection_reason: undefined,
    rejected_at: undefined,
    rejected_by: undefined,
    updated_at: new Date().toISOString(),
  };

  mockProductsStore[productIndex] = updatedProduct;

  return {
    data: {
      product: updatedProduct,
      message: 'Producto reenviado a aprobación',
    },
  };
}

/**
 * Mock: Get seller markup
 */
export async function mockGetSellerMarkup(sellerId: string): Promise<ApiResponse<SellerMarkup>> {
  await delay();

  const resolvedSellerId = resolveSellerId(sellerId);
  const seller = mockSellersStore.find(s => s.id === resolvedSellerId);

  if (!seller) {
    return {
      data: null as any,
      error: 'Proveedor no encontrado',
    };
  }

  return {
    data: {
      seller_id: resolvedSellerId,
      global_markup_percentage: seller.global_markup_percentage,
      updated_at: new Date().toISOString(),
    },
  };
}

/**
 * Mock: Update seller markup
 */
export async function mockUpdateSellerMarkup(
  sellerId: string,
  markup: number,
  reason?: string
): Promise<ApiResponse<UpdateSellerMarkupResponse>> {
  await delay();

  const resolvedSellerId = resolveSellerId(sellerId);
  const sellerIndex = mockSellersStore.findIndex(s => s.id === resolvedSellerId);

  if (sellerIndex === -1) {
    return {
      data: null as any,
      error: 'Proveedor no encontrado',
    };
  }

  const seller = mockSellersStore[sellerIndex];
  const previousMarkup = seller.global_markup_percentage;

  // Update seller markup
  mockSellersStore[sellerIndex].global_markup_percentage = markup;

  // Count products using global markup (markup_percentage = null)
  const affectedProducts = mockProductsStore.filter(
    p => p.seller_id === resolvedSellerId && p.markup_percentage === null
  ).length;

  // Add to history
  const historyEntry: SellerMarkupHistory = {
    id: `history_${Date.now()}`,
    seller_id: resolvedSellerId,
    previous_markup: previousMarkup,
    new_markup: markup,
    changed_by: 'admin@carrefour.dev', // TODO: Get from auth context
    changed_at: new Date().toISOString(),
    reason: reason || 'Actualización manual',
    affected_products_count: affectedProducts,
  };

  mockSellerMarkupHistoryStore.unshift(historyEntry);

  return {
    data: {
      seller_markup: {
        seller_id: resolvedSellerId,
        global_markup_percentage: markup,
        updated_at: new Date().toISOString(),
      },
      affected_products: affectedProducts,
      message: `Markup global actualizado a ${markup}%. ${affectedProducts} productos afectados.`,
    },
  };
}

/**
 * Mock: Get seller markup history
 */
export async function mockGetSellerMarkupHistory(
  request: GetSellerMarkupHistoryRequest
): Promise<ApiResponse<GetSellerMarkupHistoryResponse>> {
  await delay();

  const resolvedSellerId = resolveSellerId(request.seller_id);
  const seller = mockSellersStore.find(s => s.id === resolvedSellerId);

  if (!seller) {
    return {
      data: null as any,
      error: 'Proveedor no encontrado',
    };
  }

  // Filter history for this seller
  const sellerHistory = mockSellerMarkupHistoryStore
    .filter(h => h.seller_id === resolvedSellerId)
    .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

  // Pagination
  const limit = request.limit || 10;
  const offset = request.offset || 0;
  const paginatedHistory = sellerHistory.slice(offset, offset + limit);

  return {
    data: {
      history: paginatedHistory,
      total: sellerHistory.length,
      seller: seller,
    },
    message: `${paginatedHistory.length} cambios encontrados`,
  };
}

/**
 * Mock: Get all sellers (for admin)
 */
export async function mockGetAllSellers(): Promise<ApiResponse<Seller[]>> {
  await delay();
  return {
    data: mockSellersStore,
    message: `${mockSellersStore.length} proveedores encontrados`,
  };
}

/**
 * Mock: Bulk propose products (CSV/Excel upload)
 */
export async function mockBulkProposeProducts(
  sellerId: string,
  products: ProductProposal[]
): Promise<ApiResponse<BulkUploadResult>> {
  await delay(1000); // Longer delay for bulk operation

  const successful: Array<{ row: number; product_id: string; title: string }> = [];
  const warnings: Array<{ row: number; message: string; product_id: string }> = [];
  const errors: Array<{ row: number; message: string; data: any }> = [];

  products.forEach((proposal, index) => {
    const row = index + 2; // Excel rows start at 2 (header is row 1)

    // Validation
    if (!proposal.title || proposal.base_price <= 0) {
      errors.push({
        row,
        message: 'Título o precio base inválido',
        data: proposal,
      });
      return;
    }

    // Create product
    const productId = generateId();
    const newProduct: Product = {
      id: productId,
      title: proposal.title,
      description: proposal.description,
      base_price: proposal.base_price,
      units_per_pack: proposal.units_per_pack,
      category_id: proposal.category_id,
      subcategory: proposal.subcategory,
      tags: proposal.tags,
      thumbnail: proposal.thumbnail,
      seller_id: resolveSellerId(sellerId),
      seller_name: getSellerById(sellerId)?.name,
      status: 'pending_approval',
      ean: proposal.ean,
      tax_rate: proposal.tax_rate || 21,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockProductsStore.push(newProduct);

    successful.push({
      row,
      product_id: productId,
      title: proposal.title,
    });

    // Check for warnings
    if (!proposal.ean) {
      warnings.push({
        row,
        message: 'Producto creado pero falta EAN (recomendado)',
        product_id: productId,
      });
    }
  });

  return {
    data: {
      success: successful.length,
      warnings: warnings.length,
      errors: errors.length,
      details: {
        successful,
        warnings,
        errors,
      },
    },
    message: `Importación completada: ${successful.length} productos creados, ${errors.length} errores`,
  };
}

/**
 * Reset mock data to initial state (useful for testing)
 */
export function resetMockData(): void {
  mockProductsStore = [...mockProducts];
  mockSellersStore = [...mockSellers];
}
