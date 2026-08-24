/**
 * Mock Product Data
 * 
 * Realistic B2B product catalog for Carrefour franchisees
 */

import type { Product, ProductStats, Supplier, ProductCategory } from '@/types/products';

// ============================================================================
// Mock Suppliers
// ============================================================================

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup_uniformes',
    name: 'Uniformes Corporativos S.L.',
    email: 'contacto@uniformescorp.com',
    phone: '+34 91 234 5678',
  },
  {
    id: 'sup_imprenta',
    name: 'Imprenta Corporativa S.L.',
    email: 'pedidos@imprentacorp.com',
    phone: '+34 93 567 8901',
  },
  {
    id: 'sup_visual',
    name: 'Visual Retail S.L.',
    email: 'ventas@visualretail.com',
    phone: '+34 96 789 0123',
  },
  {
    id: 'sup_limpieza',
    name: 'Productos de Limpieza Industrial',
    email: 'comercial@limpieza.com',
    phone: '+34 95 432 1098',
  },
  {
    id: 'sup_embalaje',
    name: 'Embalajes y Packaging S.L.',
    email: 'info@embalajes.com',
    phone: '+34 91 876 5432',
  },
];

// ============================================================================
// Mock Categories
// ============================================================================

export const mockCategories: ProductCategory[] = [
  { id: 'cat_uniformes', name: 'Uniformes', handle: 'uniformes' },
  { id: 'cat_marketing', name: 'Material Marketing', handle: 'marketing' },
  { id: 'cat_senalizacion', name: 'Señalización en tienda', handle: 'senalizacion' },
  { id: 'cat_limpieza', name: 'Limpieza', handle: 'limpieza' },
  { id: 'cat_embalaje', name: 'Embalaje', handle: 'embalaje' },
];

// ============================================================================
// Mock Products
// ============================================================================

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    title: 'Polo Corporativo Carrefour - Azul',
    subtitle: 'Uniforme oficial para empleados',
    description: 'Polo de alta calidad con logo bordado de Carrefour. Tallas S-XXL. Material: 100% algodón peinado.',
    handle: 'polo-corporativo-carrefour-azul',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80',
    supplier_id: 'sup_uniformes',
    supplier: mockSuppliers[0],
    variants: [
      {
        id: 'var_001_s',
        product_id: 'prod_001',
        title: 'Talla S',
        sku: 'POLO-CAR-AZ-S',
        ean: '8412345678901',
        inventory_quantity: 150,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          { id: 'price_001', currency_code: 'EUR', amount: 1850 }
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'var_001_m',
        product_id: 'prod_001',
        title: 'Talla M',
        sku: 'POLO-CAR-AZ-M',
        ean: '8412345678902',
        inventory_quantity: 200,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          { id: 'price_002', currency_code: 'EUR', amount: 1850 }
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'var_001_l',
        product_id: 'prod_001',
        title: 'Talla L',
        sku: 'POLO-CAR-AZ-L',
        ean: '8412345678903',
        inventory_quantity: 180,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          { id: 'price_003', currency_code: 'EUR', amount: 2200 }
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_uniformes', name: 'Uniformes', handle: 'uniformes' }
    ],
    tags: [
      { id: 'tag_ropa', value: 'ropa' },
      { id: 'tag_corporativo', value: 'corporativo' }
    ],
    metadata: {
      units_per_pack: 1,
      min_order_quantity: 5,
      lead_time_days: 7,
      approval_status: 'approved',
      approved_at: '2024-01-10T12:00:00Z',
    },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod_002',
    title: 'Folleto Promocional A5',
    subtitle: 'Pack de 1.000 unidades',
    description: 'Folletos promocionales impresos a todo color. Papel 115g couché. Impresión offset de alta calidad.',
    handle: 'folleto-promocional-a5',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    supplier_id: 'sup_imprenta',
    supplier: mockSuppliers[1],
    variants: [
      {
        id: 'var_002',
        product_id: 'prod_002',
        title: 'Pack 1.000 uds',
        sku: 'FOLL-A5-1000',
        inventory_quantity: 8,
        manage_inventory: true,
        allow_backorder: true,
        prices: [
          { id: 'price_004', currency_code: 'EUR', amount: 8900 }
        ],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_marketing', name: 'Material Marketing', handle: 'marketing' }
    ],
    tags: [
      { id: 'tag_imprenta', value: 'imprenta' },
      { id: 'tag_promocional', value: 'promocional' }
    ],
    metadata: {
      units_per_pack: 1000,
      pack_description: 'Pack de 1.000 folletos',
      min_order_quantity: 1,
      lead_time_days: 5,
      approval_status: 'approved',
    },
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'prod_003',
    title: 'Tótem Expositivo de Pie',
    subtitle: 'Señalización en tienda',
    description: 'Tótem publicitario de aluminio con base antideslizante. Medidas: 180cm altura x 60cm ancho. Incluye lona impresa.',
    handle: 'totem-expositivo-pie',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80',
    supplier_id: 'sup_visual',
    supplier: mockSuppliers[2],
    variants: [
      {
        id: 'var_003',
        product_id: 'prod_003',
        title: 'Estándar',
        sku: 'TOT-EXP-180',
        inventory_quantity: 0,
        manage_inventory: true,
        allow_backorder: true,
        prices: [
          { id: 'price_005', currency_code: 'EUR', amount: 12500 }
        ],
        created_at: '2024-02-10T10:00:00Z',
        updated_at: '2024-02-10T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_senalizacion', name: 'Señalización', handle: 'senalizacion' }
    ],
    tags: [
      { id: 'tag_visual', value: 'visual' },
      { id: 'tag_tienda', value: 'tienda' }
    ],
    metadata: {
      units_per_pack: 1,
      min_order_quantity: 1,
      lead_time_days: 10,
      approval_status: 'approved',
    },
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'prod_004',
    title: 'Detergente Industrial Multiusos',
    subtitle: 'Garrafa 5L',
    description: 'Detergente concentrado para limpieza profesional. Biodegradable. Rendimiento: 1 garrafa = 250 litros de producto diluido.',
    handle: 'detergente-industrial-5l',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80',
    supplier_id: 'sup_limpieza',
    supplier: mockSuppliers[3],
    variants: [
      {
        id: 'var_004',
        product_id: 'prod_004',
        title: '5 Litros',
        sku: 'DET-IND-5L',
        ean: '8412345678903',
        inventory_quantity: 45,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          { id: 'price_006', currency_code: 'EUR', amount: 2350 }
        ],
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_limpieza', name: 'Productos de Limpieza', handle: 'limpieza' }
    ],
    tags: [
      { id: 'tag_limpieza', value: 'limpieza' },
      { id: 'tag_industrial', value: 'industrial' }
    ],
    metadata: {
      units_per_pack: 1,
      min_order_quantity: 4,
      lead_time_days: 3,
      approval_status: 'approved',
    },
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'prod_005',
    title: 'Bolsa de Plástico Biodegradable',
    subtitle: 'Pack 500 uds - Talla M',
    description: 'Bolsas de plástico 100% biodegradables. Medidas: 30x40cm. Grosor: 50 micras. Aptas para alimentación.',
    handle: 'bolsa-plastico-biodegradable-m',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=800&q=80',
    supplier_id: 'sup_embalaje',
    supplier: mockSuppliers[4],
    variants: [
      {
        id: 'var_005',
        product_id: 'prod_005',
        title: 'Pack 500 uds',
        sku: 'BOLSA-BIO-M-500',
        ean: '8412345678904',
        inventory_quantity: 120,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          { id: 'price_007', currency_code: 'EUR', amount: 1850 }
        ],
        created_at: '2024-03-10T10:00:00Z',
        updated_at: '2024-03-10T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_embalaje', name: 'Embalaje', handle: 'embalaje' }
    ],
    tags: [
      { id: 'tag_embalaje', value: 'embalaje' },
      { id: 'tag_ecologico', value: 'ecológico' }
    ],
    metadata: {
      units_per_pack: 500,
      pack_description: 'Pack de 500 bolsas',
      min_order_quantity: 2,
      lead_time_days: 2,
      approval_status: 'approved',
    },
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'prod_006',
    title: 'Cartel PVC Promocional A3',
    subtitle: 'Impresión personalizada',
    description: 'Cartel promocional impreso en PVC de 3mm. Resistente al agua. Incluye agujeros para colgar.',
    handle: 'cartel-pvc-a3',
    status: 'proposed',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    supplier_id: 'sup_visual',
    supplier: mockSuppliers[2],
    variants: [
      {
        id: 'var_006',
        product_id: 'prod_006',
        title: 'A3',
        sku: 'CART-PVC-A3',
        inventory_quantity: 0,
        manage_inventory: true,
        allow_backorder: true,
        prices: [
          { id: 'price_008', currency_code: 'EUR', amount: 1250 }
        ],
        created_at: '2024-08-20T10:00:00Z',
        updated_at: '2024-08-20T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_senalizacion', name: 'Señalización', handle: 'senalizacion' }
    ],
    tags: [
      { id: 'tag_visual', value: 'visual' },
      { id: 'tag_promocional', value: 'promocional' }
    ],
    metadata: {
      units_per_pack: 1,
      min_order_quantity: 5,
      lead_time_days: 7,
      approval_status: 'pending',
    },
    created_at: '2024-08-20T10:00:00Z',
    updated_at: '2024-08-20T10:00:00Z',
  },
  {
    id: 'prod_007',
    title: 'Guantes de Trabajo',
    subtitle: 'Pack 100 pares - Talla L',
    description: 'Guantes de nitrilo desechables. Resistentes a químicos y grasas. Sin látex.',
    handle: 'guantes-trabajo-l',
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
    supplier_id: 'sup_limpieza',
    supplier: mockSuppliers[3],
    variants: [
      {
        id: 'var_007',
        product_id: 'prod_007',
        title: 'Pack 100 pares',
        sku: 'GUAN-NIT-L-100',
        inventory_quantity: 0,
        manage_inventory: true,
        allow_backorder: true,
        prices: [
          { id: 'price_009', currency_code: 'EUR', amount: 2900 }
        ],
        created_at: '2024-08-22T10:00:00Z',
        updated_at: '2024-08-22T10:00:00Z',
      },
    ],
    categories: [
      { id: 'cat_seguridad', name: 'Seguridad e Higiene', handle: 'seguridad' }
    ],
    tags: [
      { id: 'tag_seguridad', value: 'seguridad' },
      { id: 'tag_desechable', value: 'desechable' }
    ],
    metadata: {
      units_per_pack: 100,
      pack_description: 'Pack de 100 pares',
      min_order_quantity: 1,
      lead_time_days: 5,
      approval_status: 'pending',
    },
    created_at: '2024-08-22T10:00:00Z',
    updated_at: '2024-08-22T10:00:00Z',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getProductById(id: string): Product | null {
  return inMemoryProducts.find((p) => p.id === id) || null;
}

export function getProductsByFilters(filters: {
  search?: string;
  status?: string;
  supplier_id?: string;
  category_id?: string;
}): Product[] {
  let results = [...inMemoryProducts];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.supplier?.name.toLowerCase().includes(search) ||
        p.categories?.some((c) => c.name.toLowerCase().includes(search))
    );
  }

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters.supplier_id) {
    results = results.filter((p) => p.supplier_id === filters.supplier_id);
  }

  if (filters.category_id) {
    results = results.filter((p) =>
      p.categories?.some((c) => c.id === filters.category_id)
    );
  }

  return results;
}

export function getMockProductStats(): ProductStats {
  const products = inMemoryProducts;
  
  return {
    total_products: products.length,
    by_status: {
      draft: products.filter((p) => p.status === 'draft').length,
      proposed: products.filter((p) => p.status === 'proposed').length,
      published: products.filter((p) => p.status === 'published').length,
      rejected: products.filter((p) => p.status === 'rejected').length,
    },
    by_supplier: mockSuppliers.map((s) => ({
      supplier_id: s.id,
      supplier_name: s.name,
      product_count: products.filter((p) => p.supplier_id === s.id).length,
    })),
    low_stock_count: products.filter((p) =>
      p.variants.some((v) => v.inventory_quantity > 0 && v.inventory_quantity < 20)
    ).length,
    out_of_stock_count: products.filter((p) =>
      p.variants.every((v) => v.inventory_quantity === 0)
    ).length,
  };
}

// In-memory storage for demo
let inMemoryProducts = [...mockProducts];

export function addMockProduct(product: Product): Product {
  inMemoryProducts = [...inMemoryProducts, product];
  return product;
}

export function updateMockProduct(id: string, updates: Partial<Product>): Product | null {
  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
  return inMemoryProducts[index];
}

export function deleteMockProduct(id: string): boolean {
  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  
  inMemoryProducts.splice(index, 1);
  return true;
}

export function getMockProducts(): Product[] {
  return inMemoryProducts;
}
