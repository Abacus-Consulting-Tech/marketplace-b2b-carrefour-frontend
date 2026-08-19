/**
 * Datos Mock para el Módulo de Nuevas Aperturas
 * 
 * Datos de ejemplo para desarrollo y testing sin backend.
 * Listo para reemplazar con llamadas reales a Medusa.
 */

import type {
  OpeningProject,
  ProjectCategory,
  SupplierInvitation,
  Quote,
  Signature,
  FinancialApproval,
  AuditLog,
} from '@/types/openings';

// ============================================================================
// Mock Data Persistence usando sessionStorage
// ============================================================================

const STORAGE_KEY_PROJECTS = 'mock_openings_projects';

// Inicializar proyectos mock base
const baseMockProjects: OpeningProject[] = [
  {
    id: 'proj_001',
    franchisee_id: 'user_franchisee_juan',
    name: 'Nueva apertura - Calle Carmen 50',
    description: 'Apertura de nuevo Carrefour Express en el centro de Madrid. Local de 250m² en zona comercial de alta afluencia.',
    status: 'quotes_received',
    planned_opening_date: new Date('2026-12-01'),
    store_size_sqm: 250,
    store_format: 'Express',
    address: {
      street: 'Calle Carmen 50',
      city: 'Madrid',
      postal_code: '28013',
      province: 'Madrid',
      country: 'ES',
    },
    fiscal_data: {
      company_name: 'Carrefour Express Madrid Centro S.L.',
      tax_id: 'B12345678',
      contact_name: 'Juan Pérez',
      contact_email: 'juan@carrefour-madrid.com',
      contact_phone: '+34 600 123 456',
    },
    floor_plan_url: 'https://storage.example.com/floor_plans/proj_001_plan.pdf',
    created_at: new Date('2026-08-01T10:00:00Z'),
    updated_at: new Date('2026-08-19T15:30:00Z'),
    created_by: 'user_admin',
    franchisee: {
      id: 'user_franchisee_juan',
      name: 'Juan Pérez',
      email: 'juan@carrefour-madrid.com',
    },
    categories_count: 3,
    quotes_count: 7,
  },
  {
    id: 'proj_002',
    franchisee_id: 'user_franchisee_maria',
    name: 'Nueva apertura - Avenida Andalucía 123',
    description: 'Apertura de Carrefour Market en zona residencial de Sevilla. Supermercado de 600m² con parking.',
    status: 'pending_signature',
    planned_opening_date: new Date('2027-01-15'),
    store_size_sqm: 600,
    store_format: 'Market',
    address: {
      street: 'Avenida Andalucía 123',
      city: 'Sevilla',
      postal_code: '41001',
      province: 'Sevilla',
      country: 'ES',
    },
    fiscal_data: {
      company_name: 'Carrefour Express Sevilla Sur S.L.',
      tax_id: 'B87654321',
      contact_name: 'María García',
      contact_email: 'maria@carrefour-sevilla.com',
      contact_phone: '+34 610 234 567',
    },
    floor_plan_url: 'https://storage.example.com/floor_plans/proj_002_plan.pdf',
    created_at: new Date('2026-07-15T09:00:00Z'),
    updated_at: new Date('2026-08-18T14:00:00Z'),
    created_by: 'user_admin',
    franchisee: {
      id: 'user_franchisee_maria',
      name: 'María García',
      email: 'maria@carrefour-sevilla.com',
    },
    categories_count: 2,
    quotes_count: 4,
  },
  {
    id: 'proj_003',
    franchisee_id: 'user_franchisee_carlos',
    name: 'Nueva apertura - Paseo Marítimo 45',
    description: 'Apertura de Carrefour Express en primera línea de playa en Valencia. Local de 180m² orientado a turismo.',
    status: 'requesting_quotes',
    planned_opening_date: new Date('2027-02-28'),
    store_size_sqm: 180,
    store_format: 'Express',
    address: {
      street: 'Paseo Marítimo 45',
      city: 'Valencia',
      postal_code: '46001',
      province: 'Valencia',
      country: 'ES',
    },
    fiscal_data: {
      company_name: 'Carrefour Express Valencia Costa S.L.',
      tax_id: 'B11223344',
      contact_name: 'Carlos Rodríguez',
      contact_email: 'carlos@carrefour-valencia.com',
      contact_phone: '+34 620 345 678',
    },
    created_at: new Date('2026-08-10T11:00:00Z'),
    updated_at: new Date('2026-08-17T16:00:00Z'),
    created_by: 'user_admin',
    franchisee: {
      id: 'user_franchisee_carlos',
      name: 'Carlos Rodríguez',
      email: 'carlos@carrefour-valencia.com',
    },
    categories_count: 4,
    quotes_count: 0,
  },
];

// Funciones para persistir proyectos en sessionStorage
function loadProjectsFromStorage(): OpeningProject[] {
  if (typeof window === 'undefined') return baseMockProjects;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) {
      const projects = JSON.parse(stored);
      // Convertir strings de fecha a objetos Date
      return projects.map((p: any) => ({
        ...p,
        planned_opening_date: p.planned_opening_date ? new Date(p.planned_opening_date) : undefined,
        created_at: new Date(p.created_at),
        updated_at: new Date(p.updated_at),
      }));
    }
  } catch (error) {
    console.error('[MockStorage] Error loading projects:', error);
  }
  
  return baseMockProjects;
}

function saveProjectsToStorage(projects: OpeningProject[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('[MockStorage] Error saving projects:', error);
  }
}

// Export save function for use in API client
export { saveProjectsToStorage };

// Exportar proyectos con persistencia
export let mockProjects: OpeningProject[] = loadProjectsFromStorage();

// Función para agregar un proyecto y persistirlo
export function addMockProject(project: OpeningProject): void {
  mockProjects.push(project);
  saveProjectsToStorage(mockProjects);
  console.log('[MockStorage] Project added and saved. Total projects:', mockProjects.length);
}

// Función para actualizar un proyecto y persistirlo
export function updateMockProject(id: string, updates: Partial<OpeningProject>): void {
  const index = mockProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProjects[index] = { ...mockProjects[index], ...updates };
    saveProjectsToStorage(mockProjects);
    console.log('[MockStorage] Project updated and saved:', id);
  }
}

// Función para resetear proyectos mock (útil para testing)
export function resetMockProjects(): void {
  mockProjects = [...baseMockProjects];
  saveProjectsToStorage(mockProjects);
  console.log('[MockStorage] Projects reset to base data');
}

// ============================================================================
// Categorías Mock
// ============================================================================

export const mockCategories: ProjectCategory[] = [
  {
    id: 'cat_001',
    project_id: 'proj_001',
    name: 'Mobiliario',
    description: 'Muebles y estanterías para la tienda',
    budget_estimate: 3500000, // 35,000 EUR
    specifications: {
      requirements: [
        'Estanterías modulares de 2m de altura',
        'Mostradores de caja',
        'Mobiliario de oficina',
      ],
      deliverables: [
        'Instalación incluida',
        'Garantía de 2 años',
      ],
      timeline_days: 30,
    },
    created_at: new Date('2026-08-02T10:00:00Z'),
    updated_at: new Date('2026-08-02T10:00:00Z'),
    quotes_count: 3,
  },
  {
    id: 'cat_002',
    project_id: 'proj_001',
    name: 'Rotulación',
    description: 'Señalización interior y exterior',
    budget_estimate: 1200000, // 12,000 EUR
    specifications: {
      requirements: [
        'Rótulo luminoso exterior',
        'Señalización interior departamentos',
        'Vinilos decorativos',
      ],
      deliverables: [
        'Instalación y montaje',
        'Garantía de 1 año',
      ],
      timeline_days: 15,
    },
    created_at: new Date('2026-08-02T10:05:00Z'),
    updated_at: new Date('2026-08-02T10:05:00Z'),
    quotes_count: 2,
  },
  {
    id: 'cat_003',
    project_id: 'proj_001',
    name: 'Equipamiento Informático',
    description: 'Hardware y software para gestión',
    budget_estimate: 800000, // 8,000 EUR
    specifications: {
      requirements: [
        'TPVs (2 unidades)',
        'Ordenadores de oficina (2 unidades)',
        'Software de gestión',
      ],
      deliverables: [
        'Instalación y configuración',
        'Formación básica',
      ],
      timeline_days: 10,
    },
    created_at: new Date('2026-08-02T10:10:00Z'),
    updated_at: new Date('2026-08-02T10:10:00Z'),
    quotes_count: 2,
  },
];

// ============================================================================
// Invitaciones Mock
// ============================================================================

export const mockInvitations: SupplierInvitation[] = [
  {
    id: 'inv_001',
    category_id: 'cat_001',
    supplier_id: 'user_supplier_mobiliario_a',
    status: 'quote_submitted',
    invited_at: new Date('2026-08-05T09:00:00Z'),
    invited_by: 'user_admin',
    message: 'Le invitamos a presentar presupuesto para el mobiliario de nuestra nueva tienda en Madrid.',
    deadline: new Date('2026-09-15T23:59:59Z'),
    supplier: {
      id: 'user_supplier_mobiliario_a',
      name: 'Mobiliario Retail S.L.',
      email: 'info@mobiliarioretail.com',
    },
    // Include full project and category data for UI display
    project: {
      id: 'proj_001',
      name: 'Nueva apertura - Calle Carmen 50',
      address: {
        street: 'Calle Carmen 50',
        city: 'Madrid',
        postal_code: '28013',
        province: 'Madrid',
        country: 'ES',
      },
      floor_plan_url: 'https://storage.example.com/floor_plans/proj_001_plan.pdf',
    },
    category: {
      id: 'cat_001',
      name: 'Mobiliario',
      description: 'Muebles y estanterías para la tienda',
      budget_estimate: 3500000, // 35,000 EUR
    },
  },
  {
    id: 'inv_002',
    category_id: 'cat_002',
    supplier_id: 'user_supplier_rotulacion_a',
    status: 'pending',
    invited_at: new Date('2026-08-06T10:30:00Z'),
    invited_by: 'user_admin',
    message: 'Necesitamos presupuesto para rotulación interior y exterior de nuestra nueva tienda.',
    deadline: new Date('2026-09-15T23:59:59Z'),
    supplier: {
      id: 'user_supplier_rotulacion_a',
      name: 'Rótulos y Vinilos Madrid',
      email: 'ventas@rotulosmadrid.com',
    },
    project: {
      id: 'proj_001',
      name: 'Nueva apertura - Calle Carmen 50',
      address: {
        street: 'Calle Carmen 50',
        city: 'Madrid',
        postal_code: '28013',
        province: 'Madrid',
        country: 'ES',
      },
      floor_plan_url: 'https://storage.example.com/floor_plans/proj_001_plan.pdf',
    },
    category: {
      id: 'cat_002',
      name: 'Rotulación',
      description: 'Señalización interior y exterior',
      budget_estimate: 1200000, // 12,000 EUR
    },
  },
  {
    id: 'inv_003',
    category_id: 'cat_003',
    supplier_id: 'user_supplier_it_a',
    status: 'pending',
    invited_at: new Date('2026-08-07T11:00:00Z'),
    invited_by: 'user_admin',
    message: 'Solicitamos presupuesto para equipamiento informático completo (TPVs, ordenadores, software).',
    deadline: new Date('2026-09-15T23:59:59Z'),
    supplier: {
      id: 'user_supplier_it_a',
      name: 'Soluciones IT Retail',
      email: 'contacto@solucionesit.com',
    },
    project: {
      id: 'proj_001',
      name: 'Nueva apertura - Calle Carmen 50',
      address: {
        street: 'Calle Carmen 50',
        city: 'Madrid',
        postal_code: '28013',
        province: 'Madrid',
        country: 'ES',
      },
      floor_plan_url: 'https://storage.example.com/floor_plans/proj_001_plan.pdf',
    },
    category: {
      id: 'cat_003',
      name: 'Equipamiento Informático',
      description: 'Hardware y software para gestión',
      budget_estimate: 800000, // 8,000 EUR
    },
  },
];

// ============================================================================
// Presupuestos Mock
// ============================================================================

export const mockQuotes: Quote[] = [
  {
    id: 'quote_001',
    category_id: 'cat_001',
    supplier_id: 'user_supplier_mobiliario_a',
    amount: 3200000, // 32,000 EUR
    currency: 'EUR',
    pdf_url: 'https://storage.example.com/quotes/quote_001.pdf',
    notes: 'Incluye instalación y transporte',
    delivery_days: 30,
    warranty_months: 24,
    payment_terms: 'Pago en 3 plazos: 40% anticipo, 40% instalación, 20% entrega',
    status: 'submitted',
    submitted_at: new Date('2026-08-10T14:30:00Z'),
    updated_at: new Date('2026-08-10T14:30:00Z'),
    supplier: {
      id: 'user_supplier_mobiliario_a',
      name: 'Mobiliario Retail S.L.',
      email: 'info@mobiliarioretail.com',
      company_name: 'Mobiliario Retail S.L.',
    },
  },
  {
    id: 'quote_002',
    category_id: 'cat_001',
    supplier_id: 'user_supplier_mobiliario_b',
    amount: 3450000, // 34,500 EUR
    currency: 'EUR',
    pdf_url: 'https://storage.example.com/quotes/quote_002.pdf',
    notes: 'Mobiliario premium con acabados especiales',
    delivery_days: 25,
    warranty_months: 36,
    payment_terms: 'Pago en 2 plazos: 50% anticipo, 50% entrega',
    status: 'submitted',
    submitted_at: new Date('2026-08-12T10:15:00Z'),
    updated_at: new Date('2026-08-12T10:15:00Z'),
    supplier: {
      id: 'user_supplier_mobiliario_b',
      name: 'Equipamiento Express S.A.',
      email: 'comercial@equipamientoexpress.com',
      company_name: 'Equipamiento Express S.A.',
    },
  },
  {
    id: 'quote_003',
    category_id: 'cat_002',
    supplier_id: 'user_supplier_rotulacion_a',
    amount: 1150000, // 11,500 EUR
    currency: 'EUR',
    pdf_url: 'https://storage.example.com/quotes/quote_003.pdf',
    delivery_days: 15,
    warranty_months: 12,
    status: 'submitted',
    submitted_at: new Date('2026-08-11T16:00:00Z'),
    updated_at: new Date('2026-08-11T16:00:00Z'),
    supplier: {
      id: 'user_supplier_rotulacion_a',
      name: 'Rotulación Visual S.L.',
      email: 'contacto@rotulacionvisual.com',
      company_name: 'Rotulación Visual S.L.',
    },
  },
];

// ============================================================================
// Firmas Mock
// ============================================================================

export const mockSignatures: Signature[] = [
  {
    id: 'sig_001',
    quote_id: 'quote_004',
    franchisee_id: 'user_franchisee_maria',
    signed_pdf_url: 'https://storage.example.com/signatures/sig_001_signed.pdf',
    signature_hash: 'a3f5d9b2e1c4f7a8d3b6c9e2f5a8b1d4c7e0f3a6b9c2e5f8',
    signature_method: 'digital',
    signed_at: new Date('2026-08-18T12:30:00Z'),
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    terms_version: '1.0',
    consent_text: 'Acepto los términos y condiciones del presupuesto presentado por Mobiliario Express S.L. por un importe de 31.500 EUR.',
  },
];

// ============================================================================
// Aprobaciones Financieras Mock
// ============================================================================

export const mockFinancialApprovals: FinancialApproval[] = [
  {
    id: 'appr_001',
    project_id: 'proj_002',
    reviewer_id: 'user_finance',
    status: 'pending',
    created_at: new Date('2026-08-18T13:00:00Z'),
    updated_at: new Date('2026-08-18T13:00:00Z'),
  },
  {
    id: 'appr_002',
    project_id: 'proj_004',
    reviewer_id: 'user_finance',
    status: 'approved',
    amount_approved: 4200000, // 42,000 EUR
    notes: 'Aprobado con las condiciones estándar de financiación.',
    conditions: [
      'Pago en 3 plazos: 40% inicio, 40% instalación, 20% fin de obra',
      'Seguro de responsabilidad civil requerido',
    ],
    approved_at: new Date('2026-08-15T16:45:00Z'),
    created_at: new Date('2026-08-14T10:00:00Z'),
    updated_at: new Date('2026-08-15T16:45:00Z'),
    reviewer: {
      id: 'user_finance',
      name: 'Ana García - Carrefour Finanzas',
      email: 'ana.garcia@carrefour.es',
    },
  },
];

// ============================================================================
// Logs de Auditoría Mock
// ============================================================================

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_001',
    project_id: 'proj_001',
    action: 'project_created',
    actor_id: 'user_admin',
    actor_role: 'admin',
    entity_type: 'project',
    entity_id: 'proj_001',
    new_value: {
      name: 'Nueva apertura - Calle Carmen 50',
      status: 'draft',
    },
    created_at: new Date('2026-08-01T10:00:00Z'),
    actor: {
      id: 'user_admin',
      name: 'Admin Carrefour',
      role: 'admin',
    },
  },
  {
    id: 'log_002',
    project_id: 'proj_001',
    action: 'category_added',
    actor_id: 'user_admin',
    actor_role: 'admin',
    entity_type: 'category',
    entity_id: 'cat_001',
    new_value: {
      name: 'Mobiliario',
      budget_estimate: 3500000,
    },
    created_at: new Date('2026-08-02T10:00:00Z'),
    actor: {
      id: 'user_admin',
      name: 'Admin Carrefour',
      role: 'admin',
    },
  },
  {
    id: 'log_003',
    project_id: 'proj_001',
    action: 'suppliers_invited',
    actor_id: 'user_admin',
    actor_role: 'admin',
    entity_type: 'invitation',
    entity_id: 'cat_001',
    new_value: {
      supplier_count: 3,
    },
    created_at: new Date('2026-08-05T09:00:00Z'),
    actor: {
      id: 'user_admin',
      name: 'Admin Carrefour',
      role: 'admin',
    },
  },
  {
    id: 'log_004',
    project_id: 'proj_001',
    action: 'quote_submitted',
    actor_id: 'user_supplier_mobiliario_a',
    actor_role: 'supplier',
    entity_type: 'quote',
    entity_id: 'quote_001',
    new_value: {
      amount: 3200000,
      status: 'submitted',
    },
    created_at: new Date('2026-08-10T14:30:00Z'),
    actor: {
      id: 'user_supplier_mobiliario_a',
      name: 'Mobiliario Retail S.L.',
      role: 'supplier',
    },
  },
];

// ============================================================================
// Funciones Helper para Datos Mock
// ============================================================================
// Proveedores Mock (disponibles para invitar)
// ============================================================================

export interface MockSupplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories: string[]; // Especialidades
  rating?: number;
}

export const mockSuppliers: MockSupplier[] = [
  {
    id: 'user_supplier_mobiliario_a',
    name: 'Mobiliario Retail S.L.',
    email: 'info@mobiliarioretail.com',
    phone: '+34 600 111 222',
    categories: ['Mobiliario', 'Estanterías'],
    rating: 4.5,
  },
  {
    id: 'user_supplier_mobiliario_b',
    name: 'Equipamiento Express S.A.',
    email: 'comercial@equipamientoexpress.com',
    phone: '+34 600 222 333',
    categories: ['Mobiliario', 'Equipamiento'],
    rating: 4.2,
  },
  {
    id: 'user_supplier_rotulacion_a',
    name: 'Rótulos y Vinilos Madrid',
    email: 'ventas@rotulosmadrid.com',
    phone: '+34 600 333 444',
    categories: ['Rotulación', 'Señalización'],
    rating: 4.7,
  },
  {
    id: 'user_supplier_rotulacion_b',
    name: 'Señalética Profesional',
    email: 'info@senaleticapro.com',
    phone: '+34 600 444 555',
    categories: ['Rotulación', 'Impresión'],
    rating: 4.3,
  },
  {
    id: 'user_supplier_it_a',
    name: 'Soluciones IT Retail',
    email: 'contacto@solucionesit.com',
    phone: '+34 600 555 666',
    categories: ['Equipamiento Informático', 'Software'],
    rating: 4.6,
  },
  {
    id: 'user_supplier_it_b',
    name: 'Tech Store Solutions',
    email: 'info@techstore.com',
    phone: '+34 600 666 777',
    categories: ['Equipamiento Informático', 'TPV'],
    rating: 4.4,
  },
];

// ============================================================================
// Helper functions
// ============================================================================

export function getMockProjectById(id: string): OpeningProject | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getMockProjectsByFranchisee(franchiseeId: string): OpeningProject[] {
  return mockProjects.filter((p) => p.franchisee_id === franchiseeId);
}

export function getMockCategoriesByProject(projectId: string): ProjectCategory[] {
  return mockCategories.filter((c) => c.project_id === projectId);
}

export function getMockQuotesByCategory(categoryId: string): Quote[] {
  return mockQuotes.filter((q) => q.category_id === categoryId);
}

export function getMockInvitationsBySupplier(supplierId: string): SupplierInvitation[] {
  return mockInvitations.filter((i) => i.supplier_id === supplierId);
}
export function getMockInvitationsByCategory(categoryId: string): SupplierInvitation[] {
  return mockInvitations.filter((i) => i.category_id === categoryId);
}
export function getMockAuditLogsByProject(projectId: string): AuditLog[] {
  return mockAuditLogs.filter((log) => log.project_id === projectId);
}
