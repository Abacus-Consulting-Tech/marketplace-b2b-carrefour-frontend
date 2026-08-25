/**
 * Mock Data - Quotes
 * 
 * Datos de prueba para presupuestos de proyectos de apertura
 * Alineado con Medusa + Mercur framework
 */

import { Quote, SupplierInvitation, QuoteSignature, QuoteItem, GetQuoteStatsResponse } from '@/types/quotes'

// ============================================================================
// Mock Quotes Data
// ============================================================================

export const mockQuotes: Quote[] = [
  // Proyecto: Apertura Barcelona Sur - Mobiliario
  {
    id: 'quote_bcn_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_suministros_corp',
    
    project_name: 'Apertura Barcelona Sur',
    project_code: 'BCN-SUR-2026',
    category_name: 'Mobiliario Comercial',
    
    supplier_name: 'Suministros Hosteleros Pro',
    supplier_email: 'ventas@suministroscorporativos.es',
    supplier_company: 'Suministros Hosteleros Pro SL',
    
    amount: 4500000, // €45,000
    currency: 'EUR',
    discount_percentage: 5,
    final_amount: 4275000, // €42,750
    
    pdf_url: 'https://storage.example.com/quotes/bcn-mob-001.pdf',
    notes: 'Incluye instalación y montaje. Plazo de entrega garantizado.',
    
    delivery_days: 45,
    warranty_months: 24,
    payment_terms: '30% anticipo, 70% contra entrega',
    
    items: [
      {
        id: 'item_001',
        quote_id: 'quote_bcn_mob_001',
        title: 'Estanterías Metálicas Profesionales',
        description: 'Sistema de estanterías industriales 200x100x40cm',
        sku: 'EST-MET-200',
        quantity: 50,
        unit_price: 28500,
        subtotal: 1425000,
        tax_rate: 21,
        tax_amount: 299250,
        total: 1724250,
      },
      {
        id: 'item_002',
        quote_id: 'quote_bcn_mob_001',
        title: 'Vitrinas Refrigeradas',
        description: 'Vitrina expositora 2m con sistema de refrigeración',
        sku: 'VIT-REF-2M',
        quantity: 8,
        unit_price: 185000,
        subtotal: 1480000,
        tax_rate: 21,
        tax_amount: 310800,
        total: 1790800,
      },
      {
        id: 'item_003',
        quote_id: 'quote_bcn_mob_001',
        title: 'Mostradores de Caja',
        description: 'Mostrador modular con cajón de seguridad',
        sku: 'MOST-CAJA',
        quantity: 4,
        unit_price: 95000,
        subtotal: 380000,
        tax_rate: 21,
        tax_amount: 79800,
        total: 459800,
      },
    ],
    
    status: 'awarded',
    is_awarded: true,
    
    created_at: '2026-08-15T09:00:00Z',
    submitted_at: '2026-08-16T14:30:00Z',
    updated_at: '2026-08-20T10:00:00Z',
    expires_at: '2026-09-16T14:30:00Z',
    awarded_at: '2026-08-20T10:00:00Z',
  },
  
  // Barcelona Sur - Mobiliario (Competidor rechazado)
  {
    id: 'quote_bcn_mob_002',
    category_id: 'cat_mobiliario',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_mobiliario_pro',
    
    project_name: 'Apertura Barcelona Sur',
    project_code: 'BCN-SUR-2026',
    category_name: 'Mobiliario Comercial',
    
    supplier_name: 'Mobiliario Profesional SL',
    supplier_email: 'comercial@mobiliariopro.es',
    
    amount: 5200000, // €52,000
    currency: 'EUR',
    
    pdf_url: 'https://storage.example.com/quotes/bcn-mob-002.pdf',
    notes: 'Propuesta premium con acabados de alta gama',
    
    delivery_days: 60,
    warranty_months: 36,
    payment_terms: '40% anticipo, 60% contra entrega',
    
    status: 'rejected',
    is_awarded: false,
    rejection_reason: 'Precio superior a presupuesto aprobado',
    
    created_at: '2026-08-15T11:00:00Z',
    submitted_at: '2026-08-17T16:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
    expires_at: '2026-09-17T16:00:00Z',
    rejected_at: '2026-08-20T10:00:00Z',
  },
  
  // Barcelona Sur - Rotulación
  {
    id: 'quote_bcn_rot_001',
    category_id: 'cat_rotulacion',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_papeleria_pub',
    
    project_name: 'Apertura Barcelona Sur',
    project_code: 'BCN-SUR-2026',
    category_name: 'Rotulación y Señalética',
    
    supplier_name: 'Papelería y Publicidad SL',
    supplier_email: 'comercial@papeleriapublicidad.es',
    
    amount: 1850000, // €18,500
    currency: 'EUR',
    discount_percentage: 10,
    final_amount: 1665000, // €16,650
    
    pdf_url: 'https://storage.example.com/quotes/bcn-rot-001.pdf',
    notes: 'Rotulación interior y exterior completa según manual de imagen',
    
    delivery_days: 30,
    warranty_months: 12,
    payment_terms: '50% anticipo, 50% contra instalación',
    
    status: 'under_review',
    is_awarded: false,
    
    created_at: '2026-08-18T10:00:00Z',
    submitted_at: '2026-08-19T15:00:00Z',
    updated_at: '2026-08-19T15:00:00Z',
    expires_at: '2026-09-19T15:00:00Z',
  },
  
  // Barcelona Sur - Equipamiento IT
  {
    id: 'quote_bcn_it_001',
    category_id: 'cat_it',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_tech_solutions',
    
    project_name: 'Apertura Barcelona Sur',
    project_code: 'BCN-SUR-2026',
    category_name: 'Equipamiento IT',
    
    supplier_name: 'Tech Solutions España',
    supplier_email: 'ventas@techsolutions.es',
    
    amount: 2800000, // €28,000
    currency: 'EUR',
    
    pdf_url: 'https://storage.example.com/quotes/bcn-it-001.pdf',
    notes: 'Incluye configuración, instalación y formación de personal',
    internal_notes: 'Proveedor preferido, buenas referencias',
    
    delivery_days: 20,
    warranty_months: 24,
    payment_terms: 'Contra entrega',
    
    items: [
      {
        id: 'item_004',
        quote_id: 'quote_bcn_it_001',
        title: 'Terminales Punto de Venta (TPV)',
        description: 'TPV táctil con impresora térmica y cajón',
        sku: 'TPV-TOUCH-15',
        quantity: 4,
        unit_price: 45000,
        subtotal: 180000,
        tax_rate: 21,
        tax_amount: 37800,
        total: 217800,
      },
      {
        id: 'item_005',
        quote_id: 'quote_bcn_it_001',
        title: 'Servidor Local',
        description: 'Servidor Dell PowerEdge con configuración',
        sku: 'SRV-DELL-PE',
        quantity: 1,
        unit_price: 320000,
        subtotal: 320000,
        tax_rate: 21,
        tax_amount: 67200,
        total: 387200,
      },
    ],
    
    status: 'submitted',
    is_awarded: false,
    
    created_at: '2026-08-20T09:00:00Z',
    submitted_at: '2026-08-21T11:30:00Z',
    updated_at: '2026-08-21T11:30:00Z',
    expires_at: '2026-09-21T11:30:00Z',
  },
  
  // Madrid Centro - Mobiliario (En borrador)
  {
    id: 'quote_mad_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_mad_centro',
    supplier_id: 'seller_suministros_corp',
    
    project_name: 'Apertura Madrid Centro',
    project_code: 'MAD-CTR-2026',
    category_name: 'Mobiliario Comercial',
    
    supplier_name: 'Suministros Hosteleros Pro',
    supplier_email: 'ventas@suministroscorporativos.es',
    
    amount: 3800000, // €38,000
    currency: 'EUR',
    
    notes: 'Borrador pendiente de aprobación interna',
    
    delivery_days: 40,
    warranty_months: 24,
    payment_terms: '30% anticipo, 70% contra entrega',
    
    status: 'draft',
    is_awarded: false,
    
    created_at: '2026-08-22T14:00:00Z',
    updated_at: '2026-08-23T09:00:00Z',
  },
  
  // Madrid Centro - Rotulación (Expirado)
  {
    id: 'quote_mad_rot_001',
    category_id: 'cat_rotulacion',
    project_id: 'proj_mad_centro',
    supplier_id: 'seller_rotulos_express',
    
    project_name: 'Apertura Madrid Centro',
    project_code: 'MAD-CTR-2026',
    category_name: 'Rotulación y Señalética',
    
    supplier_name: 'Rótulos Express',
    supplier_email: 'info@rotulosex press.es',
    
    amount: 1500000, // €15,000
    currency: 'EUR',
    
    pdf_url: 'https://storage.example.com/quotes/mad-rot-001.pdf',
    notes: 'Oferta válida hasta 15/08/2026',
    
    delivery_days: 25,
    warranty_months: 12,
    payment_terms: '100% anticipo',
    
    status: 'expired',
    is_awarded: false,
    
    created_at: '2026-07-20T10:00:00Z',
    submitted_at: '2026-07-22T14:00:00Z',
    updated_at: '2026-08-16T00:00:00Z',
    expires_at: '2026-08-15T23:59:59Z',
  },
  
  // Valencia Este - Mobiliario (Bajo revisión)
  {
    id: 'quote_val_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_val_este',
    supplier_id: 'seller_mobiliario_levante',
    
    project_name: 'Apertura Valencia Este',
    project_code: 'VAL-EST-2026',
    category_name: 'Mobiliario Comercial',
    
    supplier_name: 'Mobiliario Levante SL',
    supplier_email: 'ventas@mobiliariolevante.es',
    
    amount: 4100000, // €41,000
    currency: 'EUR',
    discount_percentage: 8,
    final_amount: 3772000, // €37,720
    
    pdf_url: 'https://storage.example.com/quotes/val-mob-001.pdf',
    notes: 'Propuesta con descuento por volumen. Empresa local.',
    internal_notes: 'Proveedor nuevo, verificar referencias',
    
    delivery_days: 35,
    warranty_months: 18,
    payment_terms: '25% anticipo, 75% contra entrega',
    
    status: 'under_review',
    is_awarded: false,
    
    created_at: '2026-08-21T11:00:00Z',
    submitted_at: '2026-08-22T16:00:00Z',
    updated_at: '2026-08-22T16:00:00Z',
    expires_at: '2026-09-22T16:00:00Z',
  },
]

// ============================================================================
// Mock Supplier Invitations
// ============================================================================

export const mockInvitations: SupplierInvitation[] = [
  {
    id: 'inv_bcn_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_suministros_corp',
    
    project_name: 'Apertura Barcelona Sur',
    category_name: 'Mobiliario Comercial',
    supplier_name: 'Suministros Hosteleros Pro',
    
    status: 'quote_submitted',
    message: 'Le invitamos a presentar presupuesto para mobiliario comercial de nuestra nueva apertura',
    deadline: '2026-08-31T23:59:59Z',
    
    invited_by: 'admin_carlos',
    invited_by_name: 'Carlos Administrador',
    
    quote_id: 'quote_bcn_mob_001',
    quote_status: 'awarded',
    
    invited_at: '2026-08-14T10:00:00Z',
    viewed_at: '2026-08-15T08:30:00Z',
    responded_at: '2026-08-16T14:30:00Z',
  },
  
  {
    id: 'inv_bcn_mob_002',
    category_id: 'cat_mobiliario',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_mobiliario_pro',
    
    project_name: 'Apertura Barcelona Sur',
    category_name: 'Mobiliario Comercial',
    supplier_name: 'Mobiliario Profesional SL',
    
    status: 'quote_submitted',
    message: 'Apreciamos su interés en participar en este proyecto',
    deadline: '2026-08-31T23:59:59Z',
    
    invited_by: 'admin_carlos',
    invited_by_name: 'Carlos Administrador',
    
    quote_id: 'quote_bcn_mob_002',
    quote_status: 'rejected',
    
    invited_at: '2026-08-14T10:00:00Z',
    viewed_at: '2026-08-15T09:00:00Z',
    responded_at: '2026-08-17T16:00:00Z',
  },
  
  {
    id: 'inv_bcn_rot_001',
    category_id: 'cat_rotulacion',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_papeleria_pub',
    
    project_name: 'Apertura Barcelona Sur',
    category_name: 'Rotulación y Señalética',
    supplier_name: 'Papelería y Publicidad SL',
    
    status: 'quote_submitted',
    deadline: '2026-08-31T23:59:59Z',
    
    invited_by: 'admin_carlos',
    invited_by_name: 'Carlos Administrador',
    
    quote_id: 'quote_bcn_rot_001',
    quote_status: 'under_review',
    
    invited_at: '2026-08-17T14:00:00Z',
    viewed_at: '2026-08-18T09:00:00Z',
    responded_at: '2026-08-19T15:00:00Z',
  },
  
  {
    id: 'inv_bcn_it_001',
    category_id: 'cat_it',
    project_id: 'proj_bcn_sur',
    supplier_id: 'seller_tech_solutions',
    
    project_name: 'Apertura Barcelona Sur',
    category_name: 'Equipamiento IT',
    supplier_name: 'Tech Solutions España',
    
    status: 'quote_submitted',
    message: 'Buscamos proveedor certificado para equipamiento IT',
    deadline: '2026-08-31T23:59:59Z',
    
    invited_by: 'admin_maria',
    invited_by_name: 'María Admin',
    
    quote_id: 'quote_bcn_it_001',
    quote_status: 'submitted',
    
    invited_at: '2026-08-19T11:00:00Z',
    viewed_at: '2026-08-20T08:00:00Z',
    responded_at: '2026-08-21T11:30:00Z',
  },
  
  {
    id: 'inv_mad_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_mad_centro',
    supplier_id: 'seller_suministros_corp',
    
    project_name: 'Apertura Madrid Centro',
    category_name: 'Mobiliario Comercial',
    supplier_name: 'Suministros Hosteleros Pro',
    
    status: 'viewed',
    deadline: '2026-09-10T23:59:59Z',
    
    invited_by: 'admin_carlos',
    invited_by_name: 'Carlos Administrador',
    
    invited_at: '2026-08-22T10:00:00Z',
    viewed_at: '2026-08-22T13:00:00Z',
  },
  
  {
    id: 'inv_val_mob_001',
    category_id: 'cat_mobiliario',
    project_id: 'proj_val_este',
    supplier_id: 'seller_mobiliario_levante',
    
    project_name: 'Apertura Valencia Este',
    category_name: 'Mobiliario Comercial',
    supplier_name: 'Mobiliario Levante SL',
    
    status: 'quote_submitted',
    deadline: '2026-09-05T23:59:59Z',
    
    invited_by: 'admin_pedro',
    invited_by_name: 'Pedro Admin',
    
    quote_id: 'quote_val_mob_001',
    quote_status: 'under_review',
    
    invited_at: '2026-08-20T14:00:00Z',
    viewed_at: '2026-08-21T09:00:00Z',
    responded_at: '2026-08-22T16:00:00Z',
  },
]

// ============================================================================
// Mock Signatures
// ============================================================================

export const mockSignatures: QuoteSignature[] = [
  {
    id: 'sig_bcn_mob_001',
    quote_id: 'quote_bcn_mob_001',
    
    franchisee_id: 'cus_bcn_norte_001',
    franchisee_name: 'Juan García',
    franchisee_email: 'franquicia.barcelona@carrefour.es',
    
    signed_pdf_url: 'https://storage.example.com/signatures/bcn-mob-001-signed.pdf',
    signature_hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    signature_method: 'digital',
    
    signed_at: '2026-08-20T11:30:00Z',
    ip_address: '185.25.123.45',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    
    terms_version: 'v2.1',
    consent_text: 'Acepto los términos y condiciones del presupuesto',
    legal_disclaimer: 'Documento legalmente vinculante según normativa española',
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getMockQuoteById(id: string): Quote | undefined {
  return mockQuotes.find(q => q.id === id)
}

export function getMockQuotesByProject(projectId: string): Quote[] {
  return mockQuotes.filter(q => q.project_id === projectId)
}

export function getMockQuotesBySupplier(supplierId: string): Quote[] {
  return mockQuotes.filter(q => q.supplier_id === supplierId)
}

export function getMockQuotesByStatus(status: string): Quote[] {
  return mockQuotes.filter(q => q.status === status)
}

export function getMockInvitationById(id: string): SupplierInvitation | undefined {
  return mockInvitations.find(i => i.id === id)
}

export function getMockInvitationsBySupplier(supplierId: string): SupplierInvitation[] {
  return mockInvitations.filter(i => i.supplier_id === supplierId)
}

export function getMockSignatureByQuote(quoteId: string): QuoteSignature | undefined {
  return mockSignatures.find(s => s.quote_id === quoteId)
}

export function getMockQuoteStats(): GetQuoteStatsResponse {
  const byStatus = mockQuotes.reduce((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const totalValue = mockQuotes
    .filter(q => q.status !== 'draft' && q.status !== 'expired')
    .reduce((sum, q) => sum + q.amount, 0)
  
  return {
    total_quotes: mockQuotes.length,
    by_status: byStatus as any,
    pending_invitations: mockInvitations.filter(i => i.status === 'pending').length,
    submitted_quotes: mockQuotes.filter(q => q.status === 'submitted').length,
    awarded_quotes: mockQuotes.filter(q => q.status === 'awarded').length,
    total_value: totalValue,
    average_quote_value: totalValue / mockQuotes.filter(q => q.status !== 'draft').length,
  }
}
