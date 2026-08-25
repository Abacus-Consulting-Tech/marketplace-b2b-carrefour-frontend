/**
 * Quotes Types - Medusa + Mercur Framework
 * 
 * Sistema de presupuestos para proyectos de apertura de franquicias
 * Alineado con: docs/technical/openings/SPECIFICATION_ES.md
 */

// ============================================================================
// Core Quote Types (Mercur-aligned)
// ============================================================================

export type QuoteStatus =
  | 'draft'           // Borrador - Proveedor trabajando en él
  | 'submitted'       // Enviado - Esperando revisión
  | 'under_review'    // En revisión - Franquiciado evaluando
  | 'awarded'         // Adjudicado - Ganador seleccionado
  | 'rejected'        // Rechazado - No seleccionado
  | 'expired'         // Expirado - Pasó el deadline

export type InvitationStatus =
  | 'pending'         // Pendiente - Invitación enviada
  | 'viewed'          // Vista - Proveedor vio la invitación
  | 'quote_submitted' // Presupuesto enviado
  | 'declined'        // Declinada - Proveedor rechazó
  | 'expired'         // Expirada - Pasó el deadline

export type SignatureMethod = 'digital' | 'electronic'

// ============================================================================
// Quote Entity
// ============================================================================

export interface Quote {
  id: string
  
  // Relaciones
  category_id: string       // FK a ProjectCategory
  project_id: string        // FK a OpeningProject (denormalizado)
  supplier_id: string       // FK a Member/Seller
  
  // Información del proyecto (denormalizado para queries)
  project_name: string
  project_code: string
  category_name: string
  
  // Información del proveedor (denormalizado)
  supplier_name: string
  supplier_email: string
  supplier_company?: string
  
  // Datos financieros
  amount: number            // Importe total en céntimos
  currency: string          // EUR
  discount_percentage?: number
  final_amount?: number     // Después de descuento
  
  // Detalles del presupuesto
  pdf_url?: string          // PDF del presupuesto subido
  notes?: string            // Comentarios adicionales del proveedor
  internal_notes?: string   // Notas internas (solo admin)
  
  // Detalles técnicos
  delivery_days?: number    // Días de entrega
  warranty_months?: number  // Meses de garantía
  payment_terms?: string    // Condiciones de pago
  
  // Items del presupuesto (opcional, algunos proveedores usan solo PDF)
  items?: QuoteItem[]
  
  // Estado y tracking
  status: QuoteStatus
  is_awarded: boolean       // Computed: status === 'awarded'
  rejection_reason?: string
  
  // Metadatos
  metadata?: Record<string, any>
  
  // Timestamps
  created_at: string
  submitted_at?: string
  updated_at: string
  expires_at?: string       // Validez del presupuesto
  awarded_at?: string
  rejected_at?: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  
  // Producto/Servicio
  title: string
  description?: string
  sku?: string
  
  // Cantidades y precios
  quantity: number
  unit_price: number        // En céntimos
  subtotal: number          // quantity * unit_price
  tax_rate: number          // Ej: 21 para IVA 21%
  tax_amount: number
  total: number             // subtotal + tax_amount
  
  // Metadatos
  metadata?: Record<string, any>
}

// ============================================================================
// Supplier Invitation
// ============================================================================

export interface SupplierInvitation {
  id: string
  
  // Relaciones
  category_id: string
  project_id: string        // Denormalizado
  supplier_id: string
  
  // Información (denormalizada)
  project_name: string
  category_name: string
  supplier_name: string
  
  // Invitación
  status: InvitationStatus
  message?: string          // Mensaje personalizado del admin
  deadline?: string         // Fecha límite para enviar presupuesto
  
  // Metadatos
  invited_by: string        // ID del admin que invitó
  invited_by_name?: string
  
  // Relación con Quote
  quote_id?: string         // Si ya envió presupuesto
  quote_status?: QuoteStatus
  
  // Timestamps
  invited_at: string
  viewed_at?: string
  responded_at?: string     // Cuando envió quote o declinó
}

// ============================================================================
// Digital Signature
// ============================================================================

export interface QuoteSignature {
  id: string
  quote_id: string
  
  // Firmante
  franchisee_id: string
  franchisee_name: string
  franchisee_email: string
  
  // Datos de firma
  signed_pdf_url: string    // PDF con firma aplicada
  signature_hash: string    // SHA-256 del documento
  signature_method: SignatureMethod
  
  // Trazabilidad de auditoría
  signed_at: string
  ip_address: string
  user_agent: string
  
  // Metadatos legales
  terms_version: string
  consent_text: string
  legal_disclaimer?: string
  
  // Metadatos
  metadata?: Record<string, any>
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface CreateQuoteRequest {
  category_id: string
  project_id: string
  amount: number
  currency?: string
  delivery_days?: number
  warranty_months?: number
  payment_terms?: string
  notes?: string
  items?: Omit<QuoteItem, 'id' | 'quote_id'>[]
}

export interface UpdateQuoteRequest {
  amount?: number
  delivery_days?: number
  warranty_months?: number
  payment_terms?: string
  notes?: string
  items?: Omit<QuoteItem, 'id' | 'quote_id'>[]
}

export interface SubmitQuoteRequest {
  quote_id: string
  pdf_url?: string
}

export interface AwardQuoteRequest {
  quote_id: string
  reason?: string
  internal_notes?: string
}

export interface RejectQuoteRequest {
  quote_id: string
  reason: string
}

export interface SignQuoteRequest {
  quote_id: string
  signature_method: SignatureMethod
  consent_text: string
  terms_version: string
}

export interface DeclineInvitationRequest {
  invitation_id: string
  reason?: string
}

// Response types
export interface GetQuotesResponse {
  quotes: Quote[]
  count: number
  total: number
  page?: number
  limit?: number
}

export interface GetQuoteResponse {
  quote: Quote
  invitation?: SupplierInvitation
  signature?: QuoteSignature
}

export interface GetInvitationsResponse {
  invitations: SupplierInvitation[]
  count: number
  total: number
}

export interface GetQuoteStatsResponse {
  total_quotes: number
  by_status: Record<QuoteStatus, number>
  pending_invitations: number
  submitted_quotes: number
  awarded_quotes: number
  total_value: number        // En céntimos
  average_quote_value: number
}

// ============================================================================
// Search/Filter Types
// ============================================================================

export interface QuoteFilters {
  project_id?: string
  category_id?: string
  supplier_id?: string
  status?: QuoteStatus | QuoteStatus[]
  min_amount?: number
  max_amount?: number
  deadline_before?: string
  deadline_after?: string
  is_awarded?: boolean
}

export interface QuoteSearchParams extends QuoteFilters {
  search?: string           // Buscar en project, category, supplier
  sort_by?: 'created_at' | 'submitted_at' | 'amount' | 'deadline'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ============================================================================
// UI Configuration
// ============================================================================

export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon?: string
}> = {
  draft: {
    label: 'Borrador',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
  submitted: {
    label: 'Enviado',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  under_review: {
    label: 'En Revisión',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  awarded: {
    label: 'Adjudicado',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  rejected: {
    label: 'Rechazado',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
  expired: {
    label: 'Expirado',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
  },
}

export const INVITATION_STATUS_CONFIG: Record<InvitationStatus, {
  label: string
  color: string
  bgColor: string
}> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  viewed: {
    label: 'Vista',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  quote_submitted: {
    label: 'Presupuesto Enviado',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  declined: {
    label: 'Declinada',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  expired: {
    label: 'Expirada',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
}
