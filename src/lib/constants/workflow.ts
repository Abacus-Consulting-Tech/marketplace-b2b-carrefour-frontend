/**
 * Constantes y lógica del Workflow de Estados del Proyecto
 * 
 * Define el flujo completo de estados, transiciones válidas,
 * fases del proyecto y metadata visual.
 */

import type { ProjectStatus } from '@/types/openings';

// ============================================================================
// Orden de Estados y Fases
// ============================================================================

/**
 * Orden secuencial de todos los estados del proyecto
 */
export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
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
];

/**
 * Fases principales del workflow (para agrupación visual)
 */
export interface WorkflowPhase {
  name: string;
  description: string;
  statuses: ProjectStatus[];
  color: string;
}

export const WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    name: 'Preparación',
    description: 'Creación del proyecto y documentación',
    statuses: ['draft', 'preparing_documentation'],
    color: 'gray',
  },
  {
    name: 'Presupuesto',
    description: 'Invitación a proveedores y recepción de ofertas',
    statuses: ['requesting_quotes', 'quotes_received', 'pending_selection'],
    color: 'blue',
  },
  {
    name: 'Adjudicación',
    description: 'Selección de proveedores y firma de contratos',
    statuses: ['awarded', 'pending_signature', 'signed'],
    color: 'yellow',
  },
  {
    name: 'Financiación',
    description: 'Aprobación de financiación',
    statuses: ['pending_financing', 'financing_approved', 'financing_rejected'],
    color: 'purple',
  },
  {
    name: 'Ejecución',
    description: 'Construcción y finalización',
    statuses: ['in_execution', 'completed'],
    color: 'green',
  },
];

// ============================================================================
// Transiciones Válidas
// ============================================================================

/**
 * Mapeo de estados a sus posibles transiciones siguientes
 * Define qué cambios de estado son válidos según reglas de negocio
 */
export const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  // Draft: puede pasar a preparación o cancelarse
  draft: ['preparing_documentation', 'cancelled'],
  
  // Preparando documentación: puede volver a draft, avanzar a cotización, o cancelarse
  preparing_documentation: ['draft', 'requesting_quotes', 'cancelled'],
  
  // Solicitando presupuestos: puede recibir presupuestos o cancelarse
  requesting_quotes: ['quotes_received', 'cancelled'],
  
  // Presupuestos recibidos: puede pasar a selección o volver a solicitar más
  quotes_received: ['pending_selection', 'requesting_quotes', 'cancelled'],
  
  // Pendiente de selección: puede adjudicarse o volver a recibir más presupuestos
  pending_selection: ['awarded', 'quotes_received', 'cancelled'],
  
  // Adjudicado: pasa automáticamente a firma
  awarded: ['pending_signature', 'cancelled'],
  
  // Pendiente de firma: puede firmarse o volver a adjudicado si se rechaza
  pending_signature: ['signed', 'awarded', 'cancelled'],
  
  // Firmado: puede necesitar financiación o ir directo a ejecución
  signed: ['pending_financing', 'in_execution', 'cancelled'],
  
  // Pendiente de financiación: puede aprobarse o rechazarse
  pending_financing: ['financing_approved', 'financing_rejected', 'cancelled'],
  
  // Financiación aprobada: pasa a ejecución
  financing_approved: ['in_execution', 'cancelled'],
  
  // Financiación rechazada: puede volver a intentar o cancelar
  financing_rejected: ['pending_financing', 'cancelled'],
  
  // En ejecución: puede completarse o cancelarse
  in_execution: ['completed', 'cancelled'],
  
  // Estados finales: no tienen transiciones
  completed: [],
  cancelled: [],
};

// ============================================================================
// Metadata de Estados
// ============================================================================

/**
 * Información detallada de cada estado para UI
 */
export interface StatusMetadata {
  status: ProjectStatus;
  icon: string; // Nombre del icono de lucide-react
  description: string;
  isFinal: boolean; // Si es un estado terminal
  requiresAction: boolean; // Si requiere acción manual
  actionBy?: 'admin' | 'franchisee' | 'supplier' | 'system';
}

export const STATUS_METADATA: Record<ProjectStatus, StatusMetadata> = {
  draft: {
    status: 'draft',
    icon: 'FileEdit',
    description: 'Proyecto en borrador, sin categorías definidas',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  preparing_documentation: {
    status: 'preparing_documentation',
    icon: 'FolderOpen',
    description: 'Añadiendo categorías y documentos técnicos',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  requesting_quotes: {
    status: 'requesting_quotes',
    icon: 'Send',
    description: 'Invitando proveedores a cotizar',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  quotes_received: {
    status: 'quotes_received',
    icon: 'Inbox',
    description: 'Recibiendo presupuestos de proveedores',
    isFinal: false,
    requiresAction: false,
    actionBy: 'supplier',
  },
  pending_selection: {
    status: 'pending_selection',
    icon: 'ClipboardList',
    description: 'Franquiciado comparando ofertas',
    isFinal: false,
    requiresAction: true,
    actionBy: 'franchisee',
  },
  awarded: {
    status: 'awarded',
    icon: 'Award',
    description: 'Presupuestos adjudicados a proveedores',
    isFinal: false,
    requiresAction: false,
    actionBy: 'system',
  },
  pending_signature: {
    status: 'pending_signature',
    icon: 'PenTool',
    description: 'Esperando firma digital de contratos',
    isFinal: false,
    requiresAction: true,
    actionBy: 'franchisee',
  },
  signed: {
    status: 'signed',
    icon: 'CheckCircle2',
    description: 'Contratos firmados digitalmente',
    isFinal: false,
    requiresAction: false,
    actionBy: 'franchisee',
  },
  pending_financing: {
    status: 'pending_financing',
    icon: 'DollarSign',
    description: 'Solicitud de financiación en revisión',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  financing_approved: {
    status: 'financing_approved',
    icon: 'ThumbsUp',
    description: 'Financiación aprobada',
    isFinal: false,
    requiresAction: false,
    actionBy: 'admin',
  },
  financing_rejected: {
    status: 'financing_rejected',
    icon: 'ThumbsDown',
    description: 'Financiación rechazada',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  in_execution: {
    status: 'in_execution',
    icon: 'Hammer',
    description: 'Proyecto en construcción',
    isFinal: false,
    requiresAction: true,
    actionBy: 'admin',
  },
  completed: {
    status: 'completed',
    icon: 'CheckCircle',
    description: 'Proyecto completado exitosamente',
    isFinal: true,
    requiresAction: false,
  },
  cancelled: {
    status: 'cancelled',
    icon: 'XCircle',
    description: 'Proyecto cancelado',
    isFinal: true,
    requiresAction: false,
  },
};

// ============================================================================
// Funciones de Utilidad
// ============================================================================

/**
 * Obtiene el índice de un estado en el flujo secuencial
 */
export function getStatusIndex(status: ProjectStatus): number {
  return PROJECT_STATUS_ORDER.indexOf(status);
}

/**
 * Verifica si una transición de estado es válida
 */
export function isValidTransition(from: ProjectStatus, to: ProjectStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Obtiene los posibles estados siguientes desde un estado dado
 */
export function getNextStates(currentStatus: ProjectStatus): ProjectStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}

/**
 * Determina si un estado está "completado" en relación a otro
 * Útil para visualizar el progreso en el timeline
 */
export function isStatusCompleted(status: ProjectStatus, currentStatus: ProjectStatus): boolean {
  const statusIndex = getStatusIndex(status);
  const currentIndex = getStatusIndex(currentStatus);
  
  // Estados cancelados/rechazados no se consideran "completados"
  if (status === 'cancelled' || status === 'financing_rejected') {
    return status === currentStatus;
  }
  
  // Si el estado actual es posterior, entonces este está completado
  return statusIndex < currentIndex && currentIndex !== -1;
}

/**
 * Obtiene la fase del workflow a la que pertenece un estado
 */
export function getPhaseForStatus(status: ProjectStatus): WorkflowPhase | undefined {
  return WORKFLOW_PHASES.find((phase) => phase.statuses.includes(status));
}

/**
 * Calcula el porcentaje de progreso del proyecto
 * (excluye estados finales negativos como cancelled/rejected)
 */
export function calculateProgress(currentStatus: ProjectStatus): number {
  if (currentStatus === 'cancelled' || currentStatus === 'financing_rejected') return 0;
  
  const positiveStates = PROJECT_STATUS_ORDER.filter(
    (s) => s !== 'cancelled' && s !== 'financing_rejected'
  );
  
  const currentIndex = positiveStates.indexOf(currentStatus);
  if (currentIndex === -1) return 0;
  
  return Math.round((currentIndex / (positiveStates.length - 1)) * 100);
}
