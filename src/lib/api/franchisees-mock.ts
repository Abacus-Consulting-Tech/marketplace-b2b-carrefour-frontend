/**
 * Franchisees Mock Data
 * 
 * Realistic mock data aligned with Medusa Customer entity
 * Includes 10 franchisees with complete profiles, addresses, and stats
 */

import type {
  Franchisee,
  Address,
  CustomerGroup,
  OrderSummary,
  FranchiseeStats,
} from '@/types/franchisees';

export const MOCK_FRANCHISEES_STORAGE_KEY = 'mock-franchisees-storage';

// ============================================================================
// Customer Groups
// ============================================================================

export const mockB2BGroup: CustomerGroup = {
  id: 'cgrp_b2b_franchisees',
  name: 'B2B Franchisees',
  metadata: {
    tier: 'business',
    discount_enabled: true,
  },
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-01-15T10:00:00Z',
};

// ============================================================================
// Franchisees
// ============================================================================

export const mockFranchisees: Franchisee[] = [
  {
    id: 'cus_01HZXK1234567890ABCD',
    email: 'juan.perez@carrefour-centro.es',
    first_name: 'Juan',
    last_name: 'Pérez García',
    phone: '+34 915 123 456',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_001',
    billing_address: {
      id: 'addr_01HZXK_billing_001',
      customer_id: 'cus_01HZXK1234567890ABCD',
      company: 'Carrefour Express Centro',
      first_name: 'Juan',
      last_name: 'Pérez García',
      address_1: 'Calle Gran Vía, 45',
      address_2: 'Local 2',
      city: 'Madrid',
      country_code: 'es',
      province: 'Madrid',
      postal_code: '28013',
      phone: '+34 915 123 456',
      metadata: { is_main_store: true },
      created_at: '2026-02-01T09:00:00Z',
      updated_at: '2026-02-01T09:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_001',
        customer_id: 'cus_01HZXK1234567890ABCD',
        company: 'Carrefour Express Centro',
        first_name: 'Juan',
        last_name: 'Pérez García',
        address_1: 'Calle Gran Vía, 45',
        city: 'Madrid',
        country_code: 'es',
        province: 'Madrid',
        postal_code: '28013',
        phone: '+34 915 123 456',
        created_at: '2026-02-01T09:00:00Z',
        updated_at: '2026-02-01T09:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Express Centro',
      tax_id: 'B12345678',
      store_name: 'Carrefour Express Centro',
      store_code: 'CRF-MAD-001',
      city: 'Madrid',
      region: 'Comunidad de Madrid',
      country: 'España',
      credit_limit: 50000,
      discount_tier: 'gold',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-02-01T09:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 45,
      total_spent: 23450.80,
      last_order_at: '2026-08-20T14:30:00Z',
      notes: 'Cliente premium con excelente historial de pagos',
      tags: ['premium', 'centro-ciudad', 'alto-volumen'],
    },
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-08-20T14:30:00Z',
  },
  {
    id: 'cus_01HZXK2345678901BCDE',
    email: 'maria.garcia@carrefour-norte.es',
    first_name: 'María',
    last_name: 'García Martínez',
    phone: '+34 933 456 789',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_002',
    billing_address: {
      id: 'addr_01HZXK_billing_002',
      customer_id: 'cus_01HZXK2345678901BCDE',
      company: 'Carrefour Market Norte',
      first_name: 'María',
      last_name: 'García Martínez',
      address_1: 'Avenida Diagonal, 220',
      city: 'Barcelona',
      country_code: 'es',
      province: 'Barcelona',
      postal_code: '08018',
      phone: '+34 933 456 789',
      created_at: '2026-03-10T10:00:00Z',
      updated_at: '2026-03-10T10:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_002',
        customer_id: 'cus_01HZXK2345678901BCDE',
        company: 'Carrefour Market Norte',
        first_name: 'María',
        last_name: 'García Martínez',
        address_1: 'Avenida Diagonal, 220',
        city: 'Barcelona',
        country_code: 'es',
        province: 'Barcelona',
        postal_code: '08018',
        phone: '+34 933 456 789',
        created_at: '2026-03-10T10:00:00Z',
        updated_at: '2026-03-10T10:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Market Norte',
      tax_id: 'B87654321',
      store_name: 'Carrefour Market Norte',
      store_code: 'CRF-BCN-002',
      city: 'Barcelona',
      region: 'Cataluña',
      country: 'España',
      credit_limit: 35000,
      discount_tier: 'silver',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-03-10T10:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 32,
      total_spent: 18920.50,
      last_order_at: '2026-08-18T11:20:00Z',
      notes: 'Buen cliente con potencial de crecimiento',
      tags: ['barcelona', 'medio-volumen'],
    },
    created_at: '2026-03-10T10:00:00Z',
    updated_at: '2026-08-18T11:20:00Z',
  },
  {
    id: 'cus_01HZXK3456789012CDEF',
    email: 'carlos.lopez@carrefour-sur.es',
    first_name: 'Carlos',
    last_name: 'López Fernández',
    phone: '+34 963 789 012',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_003',
    billing_address: {
      id: 'addr_01HZXK_billing_003',
      customer_id: 'cus_01HZXK3456789012CDEF',
      company: 'Carrefour Express Sur',
      first_name: 'Carlos',
      last_name: 'López Fernández',
      address_1: 'Calle Colón, 12',
      city: 'Valencia',
      country_code: 'es',
      province: 'Valencia',
      postal_code: '46004',
      phone: '+34 963 789 012',
      created_at: '2026-04-05T11:00:00Z',
      updated_at: '2026-04-05T11:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_003',
        customer_id: 'cus_01HZXK3456789012CDEF',
        company: 'Carrefour Express Sur',
        first_name: 'Carlos',
        last_name: 'López Fernández',
        address_1: 'Calle Colón, 12',
        city: 'Valencia',
        country_code: 'es',
        province: 'Valencia',
        postal_code: '46004',
        phone: '+34 963 789 012',
        created_at: '2026-04-05T11:00:00Z',
        updated_at: '2026-04-05T11:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Express Sur',
      tax_id: 'B11223344',
      store_name: 'Carrefour Express Sur',
      store_code: 'CRF-VLC-003',
      city: 'Valencia',
      region: 'Comunidad Valenciana',
      country: 'España',
      credit_limit: 25000,
      discount_tier: 'basic',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-04-05T11:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 28,
      total_spent: 14750.25,
      last_order_at: '2026-08-15T09:45:00Z',
      notes: 'Cliente nuevo con buen potencial',
      tags: ['valencia', 'nuevo'],
    },
    created_at: '2026-04-05T11:00:00Z',
    updated_at: '2026-08-15T09:45:00Z',
  },
  {
    id: 'cus_01HZXK4567890123DEFG',
    email: 'laura.sanchez@carrefour-este.es',
    first_name: 'Laura',
    last_name: 'Sánchez Ruiz',
    phone: '+34 954 234 567',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_004',
    billing_address: {
      id: 'addr_01HZXK_billing_004',
      customer_id: 'cus_01HZXK4567890123DEFG',
      company: 'Carrefour Market Este',
      first_name: 'Laura',
      last_name: 'Sánchez Ruiz',
      address_1: 'Avenida de la Constitución, 8',
      city: 'Sevilla',
      country_code: 'es',
      province: 'Sevilla',
      postal_code: '41001',
      phone: '+34 954 234 567',
      created_at: '2026-05-12T12:00:00Z',
      updated_at: '2026-05-12T12:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_004',
        customer_id: 'cus_01HZXK4567890123DEFG',
        company: 'Carrefour Market Este',
        first_name: 'Laura',
        last_name: 'Sánchez Ruiz',
        address_1: 'Avenida de la Constitución, 8',
        city: 'Sevilla',
        country_code: 'es',
        province: 'Sevilla',
        postal_code: '41001',
        phone: '+34 954 234 567',
        created_at: '2026-05-12T12:00:00Z',
        updated_at: '2026-05-12T12:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Market Este',
      tax_id: 'B99887766',
      store_name: 'Carrefour Market Este',
      store_code: 'CRF-SEV-004',
      city: 'Sevilla',
      region: 'Andalucía',
      country: 'España',
      credit_limit: 40000,
      discount_tier: 'gold',
      payment_terms: 45,
      is_active: true,
      approved_at: '2026-05-12T12:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 38,
      total_spent: 21300.75,
      last_order_at: '2026-08-19T16:00:00Z',
      notes: 'Excelente relación comercial',
      tags: ['sevilla', 'alto-volumen', 'pagador-puntual'],
    },
    created_at: '2026-05-12T12:00:00Z',
    updated_at: '2026-08-19T16:00:00Z',
  },
  {
    id: 'cus_01HZXK5678901234EFGH',
    email: 'alberto.ruiz@carrefour-oeste.es',
    first_name: 'Alberto',
    last_name: 'Ruiz Torres',
    phone: '+34 985 567 890',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_005',
    billing_address: {
      id: 'addr_01HZXK_billing_005',
      customer_id: 'cus_01HZXK5678901234EFGH',
      company: 'Carrefour Express Oeste',
      first_name: 'Alberto',
      last_name: 'Ruiz Torres',
      address_1: 'Calle Uría, 32',
      city: 'Oviedo',
      country_code: 'es',
      province: 'Asturias',
      postal_code: '33003',
      phone: '+34 985 567 890',
      created_at: '2026-06-20T10:30:00Z',
      updated_at: '2026-06-20T10:30:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_005',
        customer_id: 'cus_01HZXK5678901234EFGH',
        company: 'Carrefour Express Oeste',
        first_name: 'Alberto',
        last_name: 'Ruiz Torres',
        address_1: 'Calle Uría, 32',
        city: 'Oviedo',
        country_code: 'es',
        province: 'Asturias',
        postal_code: '33003',
        phone: '+34 985 567 890',
        created_at: '2026-06-20T10:30:00Z',
        updated_at: '2026-06-20T10:30:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Express Oeste',
      tax_id: 'B55443322',
      store_name: 'Carrefour Express Oeste',
      store_code: 'CRF-OVI-005',
      city: 'Oviedo',
      region: 'Asturias',
      country: 'España',
      credit_limit: 20000,
      discount_tier: 'basic',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-06-20T10:30:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 15,
      total_spent: 8950.40,
      last_order_at: '2026-08-10T13:15:00Z',
      notes: 'Cliente reciente con buen comportamiento',
      tags: ['oviedo', 'nuevo'],
    },
    created_at: '2026-06-20T10:30:00Z',
    updated_at: '2026-08-10T13:15:00Z',
  },
  {
    id: 'cus_01HZXK6789012345FGHI',
    email: 'elena.torres@carrefour-plaza.es',
    first_name: 'Elena',
    last_name: 'Torres Jiménez',
    phone: '+34 976 890 123',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_006',
    billing_address: {
      id: 'addr_01HZXK_billing_006',
      customer_id: 'cus_01HZXK6789012345FGHI',
      company: 'Carrefour Plaza',
      first_name: 'Elena',
      last_name: 'Torres Jiménez',
      address_1: 'Paseo Independencia, 25',
      city: 'Zaragoza',
      country_code: 'es',
      province: 'Zaragoza',
      postal_code: '50001',
      phone: '+34 976 890 123',
      created_at: '2026-07-01T09:45:00Z',
      updated_at: '2026-07-01T09:45:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_006',
        customer_id: 'cus_01HZXK6789012345FGHI',
        company: 'Carrefour Plaza',
        first_name: 'Elena',
        last_name: 'Torres Jiménez',
        address_1: 'Paseo Independencia, 25',
        city: 'Zaragoza',
        country_code: 'es',
        province: 'Zaragoza',
        postal_code: '50001',
        phone: '+34 976 890 123',
        created_at: '2026-07-01T09:45:00Z',
        updated_at: '2026-07-01T09:45:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Plaza',
      tax_id: 'B44556677',
      store_name: 'Carrefour Plaza',
      store_code: 'CRF-ZGZ-006',
      city: 'Zaragoza',
      region: 'Aragón',
      country: 'España',
      credit_limit: 30000,
      discount_tier: 'silver',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-07-01T09:45:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 22,
      total_spent: 12480.60,
      last_order_at: '2026-08-12T10:30:00Z',
      notes: 'Cliente con crecimiento sostenido',
      tags: ['zaragoza', 'medio-volumen'],
    },
    created_at: '2026-07-01T09:45:00Z',
    updated_at: '2026-08-12T10:30:00Z',
  },
  {
    id: 'cus_01HZXK7890123456GHIJ',
    email: 'miguel.gonzalez@carrefour-central.es',
    first_name: 'Miguel',
    last_name: 'González Vega',
    phone: '+34 942 345 678',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_007',
    billing_address: {
      id: 'addr_01HZXK_billing_007',
      customer_id: 'cus_01HZXK7890123456GHIJ',
      company: 'Carrefour Central',
      first_name: 'Miguel',
      last_name: 'González Vega',
      address_1: 'Avenida de Pontejos, 5',
      city: 'Santander',
      country_code: 'es',
      province: 'Cantabria',
      postal_code: '39001',
      phone: '+34 942 345 678',
      created_at: '2026-02-15T11:00:00Z',
      updated_at: '2026-02-15T11:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_007',
        customer_id: 'cus_01HZXK7890123456GHIJ',
        company: 'Carrefour Central',
        first_name: 'Miguel',
        last_name: 'González Vega',
        address_1: 'Avenida de Pontejos, 5',
        city: 'Santander',
        country_code: 'es',
        province: 'Cantabria',
        postal_code: '39001',
        phone: '+34 942 345 678',
        created_at: '2026-02-15T11:00:00Z',
        updated_at: '2026-02-15T11:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Central',
      tax_id: 'B33445566',
      store_name: 'Carrefour Central',
      store_code: 'CRF-SAN-007',
      city: 'Santander',
      region: 'Cantabria',
      country: 'España',
      credit_limit: 45000,
      discount_tier: 'platinum',
      payment_terms: 60,
      is_active: true,
      approved_at: '2026-02-15T11:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 52,
      total_spent: 28750.90,
      last_order_at: '2026-08-21T15:00:00Z',
      notes: 'Cliente VIP con máximo descuento',
      tags: ['vip', 'cantabria', 'alto-volumen', 'platinum'],
    },
    created_at: '2026-02-15T11:00:00Z',
    updated_at: '2026-08-21T15:00:00Z',
  },
  {
    id: 'cus_01HZXK8901234567HIJK',
    email: 'patricia.moreno@carrefour-costa.es',
    first_name: 'Patricia',
    last_name: 'Moreno Silva',
    phone: '+34 952 678 901',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_008',
    billing_address: {
      id: 'addr_01HZXK_billing_008',
      customer_id: 'cus_01HZXK8901234567HIJK',
      company: 'Carrefour Costa',
      first_name: 'Patricia',
      last_name: 'Moreno Silva',
      address_1: 'Calle Larios, 7',
      city: 'Málaga',
      country_code: 'es',
      province: 'Málaga',
      postal_code: '29015',
      phone: '+34 952 678 901',
      created_at: '2026-03-25T14:00:00Z',
      updated_at: '2026-03-25T14:00:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_008',
        customer_id: 'cus_01HZXK8901234567HIJK',
        company: 'Carrefour Costa',
        first_name: 'Patricia',
        last_name: 'Moreno Silva',
        address_1: 'Calle Larios, 7',
        city: 'Málaga',
        country_code: 'es',
        province: 'Málaga',
        postal_code: '29015',
        phone: '+34 952 678 901',
        created_at: '2026-03-25T14:00:00Z',
        updated_at: '2026-03-25T14:00:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Costa',
      tax_id: 'B22334455',
      store_name: 'Carrefour Costa',
      store_code: 'CRF-MAL-008',
      city: 'Málaga',
      region: 'Andalucía',
      country: 'España',
      credit_limit: 28000,
      discount_tier: 'silver',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-03-25T14:00:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 26,
      total_spent: 15320.45,
      last_order_at: '2026-08-14T12:20:00Z',
      notes: 'Cliente turístico con alta rotación',
      tags: ['málaga', 'zona-turística'],
    },
    created_at: '2026-03-25T14:00:00Z',
    updated_at: '2026-08-14T12:20:00Z',
  },
  {
    id: 'cus_01HZXK9012345678IJKL',
    email: 'david.castro@carrefour-ciudad.es',
    first_name: 'David',
    last_name: 'Castro Romero',
    phone: '+34 987 234 567',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_009',
    billing_address: {
      id: 'addr_01HZXK_billing_009',
      customer_id: 'cus_01HZXK9012345678IJKL',
      company: 'Carrefour Ciudad',
      first_name: 'David',
      last_name: 'Castro Romero',
      address_1: 'Calle Ancha, 15',
      city: 'León',
      country_code: 'es',
      province: 'León',
      postal_code: '24001',
      phone: '+34 987 234 567',
      created_at: '2026-04-18T09:30:00Z',
      updated_at: '2026-04-18T09:30:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_009',
        customer_id: 'cus_01HZXK9012345678IJKL',
        company: 'Carrefour Ciudad',
        first_name: 'David',
        last_name: 'Castro Romero',
        address_1: 'Calle Ancha, 15',
        city: 'León',
        country_code: 'es',
        province: 'León',
        postal_code: '24001',
        phone: '+34 987 234 567',
        created_at: '2026-04-18T09:30:00Z',
        updated_at: '2026-04-18T09:30:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Ciudad',
      tax_id: 'B11223399',
      store_name: 'Carrefour Ciudad',
      store_code: 'CRF-LEO-009',
      city: 'León',
      region: 'Castilla y León',
      country: 'España',
      credit_limit: 22000,
      discount_tier: 'basic',
      payment_terms: 30,
      is_active: true,
      approved_at: '2026-04-18T09:30:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 19,
      total_spent: 10850.30,
      last_order_at: '2026-08-08T11:00:00Z',
      notes: 'Cliente en crecimiento',
      tags: ['león', 'castilla-leon'],
    },
    created_at: '2026-04-18T09:30:00Z',
    updated_at: '2026-08-08T11:00:00Z',
  },
  {
    id: 'cus_01HZXK0123456789JKLM',
    email: 'ana.rodriguez@carrefour-parque.es',
    first_name: 'Ana',
    last_name: 'Rodríguez López',
    phone: '+34 968 456 789',
    has_account: true,
    billing_address_id: 'addr_01HZXK_billing_010',
    billing_address: {
      id: 'addr_01HZXK_billing_010',
      customer_id: 'cus_01HZXK0123456789JKLM',
      company: 'Carrefour Parque',
      first_name: 'Ana',
      last_name: 'Rodríguez López',
      address_1: 'Gran Vía Escultor Salzillo, 50',
      city: 'Murcia',
      country_code: 'es',
      province: 'Murcia',
      postal_code: '30002',
      phone: '+34 968 456 789',
      created_at: '2026-05-22T13:15:00Z',
      updated_at: '2026-05-22T13:15:00Z',
    },
    shipping_addresses: [
      {
        id: 'addr_01HZXK_shipping_010',
        customer_id: 'cus_01HZXK0123456789JKLM',
        company: 'Carrefour Parque',
        first_name: 'Ana',
        last_name: 'Rodríguez López',
        address_1: 'Gran Vía Escultor Salzillo, 50',
        city: 'Murcia',
        country_code: 'es',
        province: 'Murcia',
        postal_code: '30002',
        phone: '+34 968 456 789',
        created_at: '2026-05-22T13:15:00Z',
        updated_at: '2026-05-22T13:15:00Z',
      },
    ],
    groups: [mockB2BGroup],
    metadata: {
      company_name: 'Carrefour Parque',
      tax_id: 'B99887700',
      store_name: 'Carrefour Parque',
      store_code: 'CRF-MUR-010',
      city: 'Murcia',
      region: 'Región de Murcia',
      country: 'España',
      credit_limit: 32000,
      discount_tier: 'gold',
      payment_terms: 45,
      is_active: true,
      approved_at: '2026-05-22T13:15:00Z',
      approved_by: 'admin@carrefour.es',
      total_orders: 30,
      total_spent: 17650.80,
      last_order_at: '2026-08-17T14:45:00Z',
      notes: 'Cliente con buen potencial de expansión',
      tags: ['murcia', 'alto-potencial'],
    },
    created_at: '2026-05-22T13:15:00Z',
    updated_at: '2026-08-17T14:45:00Z',
  },

  // ==========================================================================
  // Pending approval (self-registered, awaiting admin review)
  // ==========================================================================
  {
    id: 'fran_pending_001',
    email: 'laura.fernandez@carrefour-oeste.es',
    first_name: 'Laura',
    last_name: 'Fernández Ortega',
    phone: '+34 610 234 567',
    has_account: false,
    groups: [],
    metadata: {
      company_name: 'Carrefour Express Oeste',
      tax_id: 'B55443322',
      city: 'Alcorcón',
      country: 'España',
      status: 'pending_approval',
      subscription_status: 'active',
      stripe_customer_id: 'cus_mock_001',
      stripe_subscription_id: 'sub_mock_001',
      current_period_end: '2027-08-30T10:15:00Z',
      onboarding_status: 'pending_approval',
      is_active: false,
      notes: 'Alta autoservicio · IBAN: ES1234567890123456789012 · Titular: Laura Fernández Ortega · Cuota de alta pagada (Stripe payment_method: pm_mock_001)',
    },
    created_at: '2026-08-30T10:15:00Z',
    updated_at: '2026-08-30T10:15:00Z',
  },
  {
    id: 'fran_pending_002',
    email: 'ivan.molina@carrefour-est.es',
    first_name: 'Iván',
    last_name: 'Molina Reyes',
    phone: '+34 622 345 678',
    has_account: false,
    groups: [],
    metadata: {
      company_name: 'Carrefour Market Est',
      tax_id: 'B66554433',
      city: 'Badalona',
      country: 'España',
      status: 'pending_approval',
      subscription_status: 'active',
      stripe_customer_id: 'cus_mock_002',
      stripe_subscription_id: 'sub_mock_002',
      current_period_end: '2027-08-31T16:40:00Z',
      onboarding_status: 'pending_approval',
      is_active: false,
      notes: 'Alta autoservicio · IBAN: ES9876543210987654321098 · Titular: Iván Molina Reyes · Cuota de alta pagada (Stripe payment_method: pm_mock_002)',
    },
    created_at: '2026-08-31T16:40:00Z',
    updated_at: '2026-08-31T16:40:00Z',
  },
  {
    id: 'fran_pending_003',
    email: 'noelia.santos@carrefour-sur.es',
    first_name: 'Noelia',
    last_name: 'Santos Delgado',
    phone: '+34 633 456 789',
    has_account: false,
    groups: [],
    metadata: {
      company_name: 'Carrefour Express Sur',
      tax_id: 'B77665544',
      city: 'Dos Hermanas',
      country: 'España',
      status: 'pending_approval',
      subscription_status: 'active',
      stripe_customer_id: 'cus_mock_003',
      stripe_subscription_id: 'sub_mock_003',
      current_period_end: '2027-09-01T09:05:00Z',
      onboarding_status: 'pending_approval',
      is_active: false,
      notes: 'Alta autoservicio · IBAN: PT50000201231234567890154 · Titular: Noelia Santos Delgado · Cuota de alta pagada (Stripe payment_method: pm_mock_003)',
    },
    created_at: '2026-09-01T09:05:00Z',
    updated_at: '2026-09-01T09:05:00Z',
  },
];

let hasLoadedMockFranchiseesFromStorage = false;

export function initializeMockFranchiseesStorage(): void {
  if (typeof window === 'undefined' || hasLoadedMockFranchiseesFromStorage) {
    return;
  }

  hasLoadedMockFranchiseesFromStorage = true;

  const raw = localStorage.getItem(MOCK_FRANCHISEES_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(MOCK_FRANCHISEES_STORAGE_KEY, JSON.stringify(mockFranchisees));
    return;
  }

  try {
    const stored = JSON.parse(raw) as Franchisee[];
    mockFranchisees.splice(0, mockFranchisees.length, ...stored);
  } catch {
    localStorage.setItem(MOCK_FRANCHISEES_STORAGE_KEY, JSON.stringify(mockFranchisees));
  }
}

export function persistMockFranchisees(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(MOCK_FRANCHISEES_STORAGE_KEY, JSON.stringify(mockFranchisees));
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get franchisee by ID
 */
export function getFranchiseeById(id: string): Franchisee | undefined {
  initializeMockFranchiseesStorage();
  return mockFranchisees.find((f) => f.id === id);
}

/**
 * Get franchisees by filters
 */
export function getFranchiseesByFilters(filters: {
  search?: string;
  tier?: string;
  region?: string;
  isActive?: boolean;
}): Franchisee[] {
  initializeMockFranchiseesStorage();
  let results = [...mockFranchisees];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (f) =>
        f.first_name?.toLowerCase().includes(search) ||
        f.last_name?.toLowerCase().includes(search) ||
        f.email.toLowerCase().includes(search) ||
        f.metadata.company_name?.toLowerCase().includes(search) ||
        f.metadata.store_code?.toLowerCase().includes(search) ||
        f.metadata.city?.toLowerCase().includes(search)
    );
  }

  if (filters.tier) {
    results = results.filter((f) => f.metadata.discount_tier === filters.tier);
  }

  if (filters.region) {
    results = results.filter((f) => f.metadata.region === filters.region);
  }

  if (filters.isActive !== undefined) {
    results = results.filter((f) => f.metadata.is_active === filters.isActive);
  }

  return results;
}

/**
 * Get mock stats for a franchisee
 */
export function getMockStatsForFranchisee(franchiseeId: string): FranchiseeStats {
  const franchisee = getFranchiseeById(franchiseeId);
  
  return {
    franchisee_id: franchiseeId,
    total_orders: franchisee?.metadata.total_orders || 0,
    total_spent: franchisee?.metadata.total_spent || 0,
    average_order_value: franchisee?.metadata.total_spent && franchisee?.metadata.total_orders 
      ? franchisee.metadata.total_spent / franchisee.metadata.total_orders 
      : 0,
    last_order_date: franchisee?.metadata.last_order_at,
    first_order_date: franchisee?.created_at,
    orders_by_status: {
      pending: Math.floor((franchisee?.metadata.total_orders || 0) * 0.1),
      completed: Math.floor((franchisee?.metadata.total_orders || 0) * 0.85),
      canceled: Math.floor((franchisee?.metadata.total_orders || 0) * 0.05),
    },
    orders_by_month: [
      { month: '2026-06', count: 3, total: 1500.50 },
      { month: '2026-07', count: 4, total: 2100.75 },
      { month: '2026-08', count: 5, total: 2800.30 },
    ],
    top_categories: [
      { category: 'Uniformes', count: 12, total: 5400.00 },
      { category: 'Señalización', count: 8, total: 3200.00 },
      { category: 'Merchandising', count: 6, total: 2100.00 },
    ],
  };
}

/**
 * Get mock orders for a franchisee
 */
export function getMockOrdersForFranchisee(franchiseeId: string): OrderSummary[] {
  return [
    {
      id: `order_${franchiseeId}_001`,
      display_id: 1001,
      status: 'completed',
      total: 520.50,
      currency_code: 'eur',
      created_at: '2026-08-15T10:30:00Z',
      updated_at: '2026-08-16T14:20:00Z',
    },
    {
      id: `order_${franchiseeId}_002`,
      display_id: 1002,
      status: 'completed',
      total: 780.25,
      currency_code: 'eur',
      created_at: '2026-08-10T09:15:00Z',
      updated_at: '2026-08-11T16:45:00Z',
    },
    {
      id: `order_${franchiseeId}_003`,
      display_id: 1003,
      status: 'pending',
      total: 340.80,
      currency_code: 'eur',
      created_at: '2026-08-20T14:00:00Z',
      updated_at: '2026-08-20T14:00:00Z',
    },
  ];
}
