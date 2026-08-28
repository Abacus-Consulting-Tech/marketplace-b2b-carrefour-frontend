/**
 * Tipos TypeScript para el Módulo de Nuevas Aperturas
 * 
 * Define todas las entidades, estados y tipos auxiliares
 * para el sistema de gestión de aperturas de tiendas.
 */

// ============================================================================
// Estados y Enums
// ============================================================================

export type ProjectStatus =
  | 'draft'
  | 'preparing_documentation'
  | 'requesting_quotes'
  | 'quotes_received'
  | 'pending_selection'
  | 'awarded'
  | 'pending_signature'
  | 'signed'
  | 'pending_financing'
  | 'financing_approved'
  | 'financing_rejected'
  | 'in_execution'
  | 'completed'
  | 'cancelled';

export type InvitationStatus =
  | 'pending'
  | 'viewed'
  | 'quote_submitted'
  | 'declined'
  | 'expired';

export type QuoteStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'awarded'
  | 'rejected'
  | 'expired';

export type ApprovalStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'approved_with_conditions'
  | 'rejected'
  | 'cancelled';

export type SignatureMethod = 'digital' | 'electronic';

// ============================================================================
// Tipos de Datos Auxiliares
// ============================================================================

export interface Address {
  street: string;
  city: string;
  postal_code: string;
  province: string;
  country: string;
}

export interface FiscalData {
  company_name: string;
  tax_id: string; // CIF/NIF
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

export interface CategorySpecifications {
  requirements: string[];
  deliverables: string[];
  timeline_days?: number;
}

export interface DocumentReference {
  id: string;
  name: string;
  url: string;
  uploaded_at: Date;
  size_bytes: number;
}

// ============================================================================
// Entidades Principales
// ============================================================================

export interface OpeningProject {
  id: string;
  franchisee_id: string;
  store_id?: string;
  store_sap_code?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  planned_opening_date?: Date;
  
  // Datos del establecimiento
  store_size_sqm?: number;
  store_format?: string; // Express, Market, Hipermercado, etc.
  
  // Datos de dirección
  address: Address;
  
  // Datos fiscales
  fiscal_data?: FiscalData;
  
  // Archivos
  floor_plan_url?: string;
  additional_documents?: DocumentReference[];
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  created_by: string;
  
  // Datos relacionados (populados en algunas consultas)
  franchisee?: {
    id: string;
    name: string;
    email: string;
  };
  categories?: ProjectCategory[];
  categories_count?: number;
  quotes_count?: number;
  financial_approval?: FinancialApproval;
}

export interface ProjectCategory {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  budget_estimate?: number; // en céntimos
  
  // Especificaciones técnicas
  specifications?: CategorySpecifications;
  
  created_at: Date;
  updated_at: Date;
  
  // Datos relacionados (populados en algunas consultas)
  project?: OpeningProject;
  invitations?: SupplierInvitation[];
  quotes?: Quote[];
  quotes_count?: number;
  awarded_quote_id?: string;
  awarded_quote?: Quote;
}

export interface SupplierInvitation {
  id: string;
  project_id: string;
  category_id: string;
  supplier_id: string;
  status: InvitationStatus;
  
  invited_at: Date;
  invited_by: string;
  
  // Metadatos de invitación
  message?: string;
  deadline?: Date;
  
  // Datos relacionados (populados en algunas consultas)
  category?: Partial<ProjectCategory> & Pick<ProjectCategory, 'id' | 'name'>;
  supplier?: {
    id: string;
    name: string;
    email: string;
  };
  project?: Partial<OpeningProject> & Pick<OpeningProject, 'id' | 'name'>;
  quote?: Quote;
}

export interface Quote {
  id: string;
  category_id: string;
  supplier_id: string;
  
  // Datos financieros
  amount: number; // en céntimos
  currency: string;
  
  // Detalles del presupuesto
  pdf_url: string;
  notes?: string;
  
  // Detalles técnicos
  delivery_days?: number;
  warranty_months?: number;
  payment_terms?: string;
  
  // Estado
  status: QuoteStatus;
  
  submitted_at: Date;
  updated_at: Date;
  
  // Datos relacionados (populados en algunas consultas)
  category?: ProjectCategory;
  supplier?: {
    id: string;
    name: string;
    email: string;
    company_name?: string;
  };
  signature?: Signature;
}

export interface Signature {
  id: string;
  quote_id: string;
  franchisee_id: string;
  
  // Datos de firma
  signed_pdf_url: string;
  signature_hash: string;
  signature_method: SignatureMethod;
  
  // Trazabilidad de auditoría
  signed_at: Date;
  ip_address: string;
  user_agent: string;
  
  // Metadatos legales
  terms_version: string;
  consent_text: string;
  
  // Datos relacionados (populados en algunas consultas)
  quote?: Quote;
  franchisee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FinancialApproval {
  id: string;
  project_id: string;
  reviewer_id?: string;
  
  status: ApprovalStatus;
  amount_approved?: number; // en céntimos
  
  notes?: string;
  conditions?: string[];
  
  approved_at?: Date;
  rejected_at?: Date;
  rejection_reason?: string;
  
  created_at: Date;
  updated_at: Date;
  
  // Datos relacionados (populados en algunas consultas)
  project?: OpeningProject;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuditLog {
  id: string;
  project_id: string;
  
  action: string;
  actor_id?: string;
  actor_role?: string;
  
  // Qué cambió
  entity_type: string;
  entity_id: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  
  // Contexto
  ip_address?: string;
  user_agent?: string;
  
  created_at: Date;
  
  // Datos relacionados (populados en algunas consultas)
  actor?: {
    id: string;
    name: string;
    role: string;
  };
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateProjectRequest {
  franchisee_id: string;
  store_sap_code?: string;
  name: string;
  address: Address;
  fiscal_data?: FiscalData;
  planned_opening_date?: Date | string;
}

export interface UpdateProjectRequest {
  name?: string;
  status?: ProjectStatus;
  address?: Address;
  fiscal_data?: FiscalData;
  planned_opening_date?: Date | string;
  floor_plan_url?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  budget_estimate?: number;
  specifications?: CategorySpecifications;
}

export interface InviteSuppliersRequest {
  supplier_ids: string[];
  message?: string;
  deadline?: Date | string;
}

export interface CreateQuoteRequest {
  amount: number;
  delivery_days?: number;
  warranty_months?: number;
  payment_terms?: string;
  notes?: string;
  // file se enviará como FormData
}

export interface SignQuoteRequest {
  consent_text: string;
  terms_version: string;
}

export interface ReviewFinancingRequest {
  status: 'approved' | 'approved_with_conditions' | 'rejected';
  amount_approved?: number;
  notes?: string;
  conditions?: string[];
  rejection_reason?: string;
}

// ============================================================================
// Respuestas de API
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ProjectListResponse {
  id: string;
  name: string;
  status: ProjectStatus;
  franchisee: {
    id: string;
    name: string;
    email: string;
  };
  categories_count: number;
  quotes_count: number;
  created_at: Date;
  planned_opening_date?: Date;
}

export interface QuoteComparisonData {
  category_id: string;
  category_name: string;
  budget_estimate?: number;
  quotes: Array<{
    id: string;
    supplier: {
      id: string;
      name: string;
      email: string;
    };
    amount: number;
    delivery_days?: number;
    warranty_months?: number;
    payment_terms?: string;
    pdf_url: string;
    status: QuoteStatus;
    submitted_at: Date;
  }>;
}

// ============================================================================
// Helpers y Utilidades
// ============================================================================

export interface ProjectFilters {
  status?: ProjectStatus;
  franchisee_id?: string;
  page?: number;
  limit?: number;
}

export interface CategoryFilters {
  project_id: string;
}

export interface QuoteFilters {
  category_id?: string;
  supplier_id?: string;
  status?: QuoteStatus;
}

// ============================================================================
// Documentos del Proyecto
// ============================================================================

/**
 * Categorías de documentos de proyecto
 */
export type DocumentCategory = 
  | 'equipamientos'
  | 'obras_iluminacion'
  | 'obras_clima'
  | 'obras_electricidad'
  | 'obras_general'
  | 'otros';

/**
 * Documento técnico de un proyecto
 */
export interface ProjectDocument {
  id: string;
  project_id: string;
  category: DocumentCategory;
  subcategory?: string | null;
  name: string;
  description?: string | null;
  file_url: string;
  file_name: string;
  file_size_bytes: number;
  file_mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  is_active: boolean;
  version: number;
}

/**
 * Request para subir documento
 */
export interface UploadDocumentRequest {
  category: DocumentCategory;
  subcategory?: string;
  name: string;
  description?: string;
  file: File;
}

/**
 * Respuesta de lista de documentos con estadísticas
 */
export interface ProjectDocumentsResponse {
  project_id: string;
  documents: ProjectDocument[];
  total_documents: number;
  categories: Record<DocumentCategory, number>;
}

/**
 * Metadatos de categorías de documentos
 */
export interface DocumentCategoryMetadata {
  code: DocumentCategory;
  label: string;
  description: string;
  icon: string; // Nombre del icono de lucide-react
  color: string; // Clase de Tailwind para color
}

// ============================================================================
// Historial de Estados
// ============================================================================

/**
 * Entrada en el historial de cambios de estado del proyecto
 */
export interface StatusHistoryEntry {
  id: string;
  project_id: string;
  from_status: ProjectStatus | null; // null para el estado inicial
  to_status: ProjectStatus;
  changed_by_user_id: string;
  changed_by_name: string;
  changed_by_role: 'admin' | 'franchisee' | 'system';
  changed_at: string;
  notes?: string;
  metadata?: Record<string, unknown>; // Datos adicionales del cambio
}

/**
 * Request para cambiar el estado del proyecto
 */
export interface UpdateProjectStatusRequest {
  new_status: ProjectStatus;
  notes?: string;
}

/**
 * Respuesta de historial de estados
 */
export interface StatusHistoryResponse {
  project_id: string;
  current_status: ProjectStatus;
  history: StatusHistoryEntry[];
}

// ============================================================================
// Mapas de Estado (para UI)
// ============================================================================

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Borrador',
  preparing_documentation: 'Preparando Documentación',
  requesting_quotes: 'Solicitando Presupuestos',
  quotes_received: 'Presupuestos Recibidos',
  pending_selection: 'Pendiente de Selección',
  awarded: 'Adjudicado',
  pending_signature: 'Pendiente de Firma',
  signed: 'Firmado',
  pending_financing: 'Pendiente de Financiación',
  financing_approved: 'Financiación Aprobada',
  financing_rejected: 'Financiación Rechazada',
  in_execution: 'En Ejecución',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, 'gray' | 'blue' | 'yellow' | 'green' | 'red'> = {
  draft: 'gray',
  preparing_documentation: 'blue',
  requesting_quotes: 'blue',
  quotes_received: 'yellow',
  pending_selection: 'yellow',
  awarded: 'green',
  pending_signature: 'yellow',
  signed: 'green',
  pending_financing: 'yellow',
  financing_approved: 'green',
  financing_rejected: 'red',
  in_execution: 'blue',
  completed: 'green',
  cancelled: 'red',
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  submitted: 'Enviado',
  under_review: 'En Revisión',
  awarded: 'Adjudicado',
  rejected: 'Rechazado',
  expired: 'Expirado',
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pendiente',
  under_review: 'En Revisión',
  approved: 'Aprobado',
  approved_with_conditions: 'Aprobado con Condiciones',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

// ============================================================================
// Funciones de Validación
// ============================================================================

export function isValidProjectStatus(status: string): status is ProjectStatus {
  return [
    'draft',
    'preparing_documentation',
    'requesting_quotes',
    'quotes_received',
    'pending_selection',
    'awarded',
    'pending_signature',
    'signed',
    'pending_financing',
    'financing_approved',
    'financing_rejected',
    'in_execution',
    'completed',
    'cancelled',
  ].includes(status);
}

export function canTransitionProjectStatus(
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus
): boolean {
  const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
    draft: ['preparing_documentation', 'cancelled'],
    preparing_documentation: ['requesting_quotes', 'draft', 'cancelled'],
    requesting_quotes: ['quotes_received', 'preparing_documentation', 'cancelled'],
    quotes_received: ['pending_selection', 'requesting_quotes', 'cancelled'],
    pending_selection: ['awarded', 'quotes_received', 'cancelled'],
    awarded: ['pending_signature', 'pending_selection', 'cancelled'],
    pending_signature: ['signed', 'awarded', 'cancelled'],
    signed: ['pending_financing', 'cancelled'],
    pending_financing: ['financing_approved', 'financing_rejected', 'cancelled'],
    financing_approved: ['in_execution', 'cancelled'],
    financing_rejected: ['pending_financing', 'cancelled'],
    in_execution: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function formatCurrency(amountInCents: number, currency: string = 'EUR'): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
