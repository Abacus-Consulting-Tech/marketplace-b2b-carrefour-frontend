/**
 * Zustand Store para el Módulo de Nuevas Aperturas
 * 
 * Gestiona el estado global del módulo con persistencia selectiva.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OpeningProject,
  SupplierInvitation,
  Quote,
  QuoteComparisonData,
  ProjectListResponse,
} from '@/types/openings';

// ============================================================================
// Interfaces
// ============================================================================

interface OpeningsState {
  // -------------------------------------------------------------------------
  // Estado Admin
  // -------------------------------------------------------------------------
  projects: ProjectListResponse[];
  selectedProject: OpeningProject | null;
  isLoadingProjects: boolean;

  // -------------------------------------------------------------------------
  // Estado Franquiciado
  // -------------------------------------------------------------------------
  myProjects: ProjectListResponse[];
  activeQuoteComparison: QuoteComparisonData | null;
  isLoadingMyProjects: boolean;

  // -------------------------------------------------------------------------
  // Estado Proveedor
  // -------------------------------------------------------------------------
  myInvitations: SupplierInvitation[];
  myQuotes: Quote[];
  isLoadingInvitations: boolean;

  // -------------------------------------------------------------------------
  // Acciones: Projects
  // -------------------------------------------------------------------------
  setProjects: (projects: ProjectListResponse[]) => void;
  selectProject: (project: OpeningProject | null) => void;
  addProject: (project: ProjectListResponse) => void;
  updateProject: (id: string, updates: Partial<ProjectListResponse>) => void;
  removeProject: (id: string) => void;
  setLoadingProjects: (loading: boolean) => void;

  // -------------------------------------------------------------------------
  // Acciones: My Projects (Franchisee)
  // -------------------------------------------------------------------------
  setMyProjects: (projects: ProjectListResponse[]) => void;
  setLoadingMyProjects: (loading: boolean) => void;

  // -------------------------------------------------------------------------
  // Acciones: Quote Comparison
  // -------------------------------------------------------------------------
  setQuoteComparison: (data: QuoteComparisonData | null) => void;
  clearQuoteComparison: () => void;
  updateQuoteInComparison: (quoteId: string, updates: Partial<Quote>) => void;

  // -------------------------------------------------------------------------
  // Acciones: Invitations (Supplier)
  // -------------------------------------------------------------------------
  setMyInvitations: (invitations: SupplierInvitation[]) => void;
  addInvitation: (invitation: SupplierInvitation) => void;
  updateInvitation: (id: string, updates: Partial<SupplierInvitation>) => void;
  setLoadingInvitations: (loading: boolean) => void;

  // -------------------------------------------------------------------------
  // Acciones: Quotes (Supplier)
  // -------------------------------------------------------------------------
  setMyQuotes: (quotes: Quote[]) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;

  // -------------------------------------------------------------------------
  // Acciones: Reset
  // -------------------------------------------------------------------------
  reset: () => void;
}

// ============================================================================
// Estado Inicial
// ============================================================================

const initialState = {
  // Admin
  projects: [],
  selectedProject: null,
  isLoadingProjects: false,

  // Franchisee
  myProjects: [],
  activeQuoteComparison: null,
  isLoadingMyProjects: false,

  // Supplier
  myInvitations: [],
  myQuotes: [],
  isLoadingInvitations: false,
};

// ============================================================================
// Store
// ============================================================================

export const useOpeningsStore = create<OpeningsState>()(
  persist(
    (set) => ({
      ...initialState,

      // -----------------------------------------------------------------------
      // Projects
      // -----------------------------------------------------------------------

      setProjects: (projects) => set({ projects }),

      selectProject: (project) => set({ selectedProject: project }),

      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updated_at: new Date() } : p
          ),
          selectedProject:
            state.selectedProject?.id === id
              ? { ...state.selectedProject, ...updates, updated_at: new Date() }
              : state.selectedProject,
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        })),

      setLoadingProjects: (loading) => set({ isLoadingProjects: loading }),

      // -----------------------------------------------------------------------
      // My Projects (Franchisee)
      // -----------------------------------------------------------------------

      setMyProjects: (projects) => set({ myProjects: projects }),

      setLoadingMyProjects: (loading) => set({ isLoadingMyProjects: loading }),

      // -----------------------------------------------------------------------
      // Quote Comparison
      // -----------------------------------------------------------------------

      setQuoteComparison: (data) => set({ activeQuoteComparison: data }),

      clearQuoteComparison: () => set({ activeQuoteComparison: null }),

      updateQuoteInComparison: (quoteId, updates) =>
        set((state) => {
          if (!state.activeQuoteComparison) return state;

          return {
            activeQuoteComparison: {
              ...state.activeQuoteComparison,
              quotes: state.activeQuoteComparison.quotes.map((q) =>
                q.id === quoteId ? { ...q, ...updates } : q
              ),
            },
          };
        }),

      // -----------------------------------------------------------------------
      // Invitations (Supplier)
      // -----------------------------------------------------------------------

      setMyInvitations: (invitations) => set({ myInvitations: invitations }),

      addInvitation: (invitation) =>
        set((state) => ({
          myInvitations: [invitation, ...state.myInvitations],
        })),

      updateInvitation: (id, updates) =>
        set((state) => ({
          myInvitations: state.myInvitations.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      setLoadingInvitations: (loading) => set({ isLoadingInvitations: loading }),

      // -----------------------------------------------------------------------
      // Quotes (Supplier)
      // -----------------------------------------------------------------------

      setMyQuotes: (quotes) => set({ myQuotes: quotes }),

      addQuote: (quote) =>
        set((state) => ({
          myQuotes: [quote, ...state.myQuotes],
        })),

      updateQuote: (id, updates) =>
        set((state) => ({
          myQuotes: state.myQuotes.map((q) =>
            q.id === id ? { ...q, ...updates, updated_at: new Date() } : q
          ),
        })),

      // -----------------------------------------------------------------------
      // Reset
      // -----------------------------------------------------------------------

      reset: () => set(initialState),
    }),
    {
      name: 'openings-storage',
      // Particializar: solo persistir IDs y estados críticos, no datos completos
      partialize: (state) => ({
        selectedProjectId: state.selectedProject?.id,
        activeQuoteComparisonCategoryId: state.activeQuoteComparison?.category_id,
      }),
    }
  )
);

// ============================================================================
// Selectores (helpers)
// ============================================================================

export const openingsSelectors = {
  // Obtener proyecto por ID
  getProjectById: (state: OpeningsState, id: string) =>
    state.projects.find((p) => p.id === id),

  // Obtener proyectos por estado
  getProjectsByStatus: (state: OpeningsState, status: string) =>
    state.projects.filter((p) => p.status === status),

  // Obtener invitaciones pendientes
  getPendingInvitations: (state: OpeningsState) =>
    state.myInvitations.filter((inv) => inv.status === 'pending'),

  // Obtener invitaciones con presupuestos enviados
  getInvitationsWithQuotes: (state: OpeningsState) =>
    state.myInvitations.filter((inv) => inv.status === 'quote_submitted'),

  // Obtener presupuestos por estado
  getQuotesByStatus: (state: OpeningsState, status: string) =>
    state.myQuotes.filter((q) => q.status === status),

  // Verificar si hay comparación activa
  hasActiveComparison: (state: OpeningsState) =>
    state.activeQuoteComparison !== null,

  // Obtener presupuesto ganador en comparación
  getAwardedQuoteInComparison: (state: OpeningsState) =>
    state.activeQuoteComparison?.quotes.find((q) => q.status === 'awarded'),
};

// ============================================================================
// Exportar hook personalizado con selectores
// ============================================================================

export function useOpenings() {
  const store = useOpeningsStore();

  return {
    ...store,
    // Añadir selectores como métodos
    getProjectById: (id: string) => openingsSelectors.getProjectById(store, id),
    getProjectsByStatus: (status: string) => openingsSelectors.getProjectsByStatus(store, status),
    getPendingInvitations: () => openingsSelectors.getPendingInvitations(store),
    getInvitationsWithQuotes: () => openingsSelectors.getInvitationsWithQuotes(store),
    getQuotesByStatus: (status: string) => openingsSelectors.getQuotesByStatus(store, status),
    hasActiveComparison: () => openingsSelectors.hasActiveComparison(store),
    getAwardedQuoteInComparison: () => openingsSelectors.getAwardedQuoteInComparison(store),
  };
}
