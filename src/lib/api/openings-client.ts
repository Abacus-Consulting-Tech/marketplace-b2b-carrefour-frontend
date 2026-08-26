/**
 * Cliente API para el Módulo de Nuevas Aperturas
 * 
 * Implementa todas las llamadas API necesarias con soporte para:
 * - Modo Mock (desarrollo sin backend)
 * - Modo Real (integración con Medusa)
 * 
 * Mode controlled by feature flags in @/config/feature-flags
 */

import { featureFlags } from '@/config/feature-flags';
import type {
  OpeningProject,
  ProjectCategory,
  SupplierInvitation,
  Quote,
  Signature,
  FinancialApproval,
  AuditLog,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateCategoryRequest,
  InviteSuppliersRequest,
  CreateQuoteRequest,
  SignQuoteRequest,
  ReviewFinancingRequest,
  ApiResponse,
  PaginatedResponse,
  ProjectListResponse,
  QuoteComparisonData,
  ProjectFilters,
  ProjectDocument,
  DocumentCategory,
  UploadDocumentRequest,
  ProjectDocumentsResponse,
} from '@/types/openings';

import {
  mockProjects,
  mockCategories,
  mockQuotes,
  mockInvitations,
  mockSuppliers,
  mockSignatures,
  mockFinancialApprovals,
  getMockProjectById,
  getMockCategoriesByProject,
  getMockQuotesByCategory,
  getMockAuditLogsByProject,
  addMockProject,
  updateMockProject,
  saveProjectsToStorage,
  getMockDocumentsByProject,
  getMockDocumentById,
  addMockDocument,
  deleteMockDocument,
  getMockStatusHistory,
  addMockStatusHistory,
  getMockProjects,
} from './openings-mock';
import type { MockSupplier } from './openings-mock';

import { apiClient } from './client';

// ============================================================================
// Configuración
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('openings');
const API_BASE_URL = featureFlags.getApiBaseUrl('openings') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Openings API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('openings') ? 'Yes ✅' : 'No ⏳'})`
  );
}

// Simular delay de red en modo mock
const MOCK_DELAY_MS = 300;

async function mockDelay<T>(data: T): Promise<T> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  }
  return data;
}

// ============================================================================
// API: Proyectos
// ============================================================================

export const openingsApi = {
  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------

  async getProjects(
    filters?: ProjectFilters
  ): Promise<PaginatedResponse<ProjectListResponse>> {
    if (isMockMode) {
      let projects = [...mockProjects];

      // Aplicar filtros
      if (filters?.status) {
        projects = projects.filter((p) => p.status === filters.status);
      }
      if (filters?.franchisee_id) {
        projects = projects.filter((p) => p.franchisee_id === filters.franchisee_id);
      }

      // Paginación
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProjects = projects.slice(start, end);

      return mockDelay({
        success: true,
        data: paginatedProjects.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          franchisee: p.franchisee!,
          categories_count: p.categories_count || 0,
          quotes_count: p.quotes_count || 0,
          created_at: p.created_at,
          planned_opening_date: p.planned_opening_date,
        })),
        meta: {
          page,
          limit,
          total: projects.length,
          total_pages: Math.ceil(projects.length / limit),
        },
      });
    }

    // Modo real: llamada a Medusa
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.franchisee_id) params.append('franchisee_id', filters.franchisee_id);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<ProjectListResponse>>(
      `/openings/projects?${params.toString()}`
    );
    return response.data;
  },

  async getProjectById(id: string): Promise<ApiResponse<OpeningProject>> {
    console.log('[openingsApi.getProjectById] Looking for project:', id);
    console.log('[openingsApi.getProjectById] Available projects:', mockProjects.map(p => p.id));
    
    if (isMockMode) {
      const project = getMockProjectById(id);
      console.log('[openingsApi.getProjectById] Found project:', project ? 'YES' : 'NO');
      
      if (!project) {
        console.error('[openingsApi.getProjectById] Project not found!');
        return mockDelay({
          success: false,
          error: 'Proyecto no encontrado',
        });
      }

      // Enriquecer con categorías
      const categories = getMockCategoriesByProject(id);
      const enrichedProject: OpeningProject = {
        ...project,
        categories,
      };

      console.log('[openingsApi.getProjectById] Returning enriched project');
      return mockDelay({
        success: true,
        data: enrichedProject,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<OpeningProject>>(
      `/openings/projects/${id}`
    );
    return response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<ApiResponse<OpeningProject>> {
    console.log('[openingsApi.createProject] isMockMode:', isMockMode);
    console.log('[openingsApi.createProject] Request data:', data);
    
    if (isMockMode) {
      const newProject: OpeningProject = {
        id: `proj_${Date.now()}`,
        franchisee_id: data.franchisee_id,
        name: data.name,
        address: data.address,
        fiscal_data: data.fiscal_data,
        planned_opening_date: data.planned_opening_date 
          ? (typeof data.planned_opening_date === 'string' 
            ? new Date(data.planned_opening_date) 
            : data.planned_opening_date)
          : undefined,
        status: 'draft',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user_admin',
        franchisee: {
          id: data.franchisee_id,
          name: 'Franquiciado Mock',
          email: 'mock@example.com',
        },
      };

      console.log('[openingsApi.createProject] Created mock project:', newProject);
      addMockProject(newProject);  // Use helper function for persistence
      console.log('[openingsApi.createProject] Project added to storage');

      const response = {
        success: true,
        data: newProject,
        message: 'Proyecto creado correctamente',
      };
      
      console.log('[openingsApi.createProject] Returning response after delay');
      return mockDelay(response);
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<OpeningProject>>(
      '/openings/projects',
      data
    );
    return response.data;
  },

  async updateProject(
    id: string,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<OpeningProject>> {
    if (isMockMode) {
      const project = getMockProjectById(id);
      if (!project) {
        return mockDelay({
          success: false,
          error: 'Proyecto no encontrado',
        });
      }

      const updatedProject: OpeningProject = {
        ...project,
        ...data,
        planned_opening_date: data.planned_opening_date !== undefined
          ? (typeof data.planned_opening_date === 'string' 
            ? new Date(data.planned_opening_date) 
            : data.planned_opening_date)
          : project.planned_opening_date,
        updated_at: new Date(),
      };

      updateMockProject(id, updatedProject);  // Use helper function for persistence

      return mockDelay({
        success: true,
        data: updatedProject,
        message: 'Proyecto actualizado correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.patch<ApiResponse<OpeningProject>>(
      `/openings/projects/${id}`,
      data
    );
    return response.data;
  },

  async uploadFloorPlan(projectId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    if (isMockMode) {
      const mockUrl = `https://storage.example.com/floor_plans/${projectId}_${file.name}`;

      return mockDelay({
        success: true,
        data: { url: mockUrl },
        message: 'Plano subido correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `/openings/projects/${projectId}/upload-floor-plan`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Categories
  // --------------------------------------------------------------------------

  async getCategoriesByProject(projectId: string): Promise<ApiResponse<ProjectCategory[]>> {
    if (isMockMode) {
      const categories = getMockCategoriesByProject(projectId);

      return mockDelay({
        success: true,
        data: categories,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<ProjectCategory[]>>(
      `/openings/projects/${projectId}/categories`
    );
    return response.data;
  },

  async createCategory(
    projectId: string,
    data: CreateCategoryRequest
  ): Promise<ApiResponse<ProjectCategory>> {
    if (isMockMode) {
      const newCategory: ProjectCategory = {
        id: `cat_${Date.now()}`,
        project_id: projectId,
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategories.push(newCategory);

      return mockDelay({
        success: true,
        data: newCategory,
        message: 'Categoría creada correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<ProjectCategory>>(
      `/openings/projects/${projectId}/categories`,
      data
    );
    return response.data;
  },

  async updateCategory(
    categoryId: string,
    data: Partial<CreateCategoryRequest>
  ): Promise<ApiResponse<ProjectCategory>> {
    if (isMockMode) {
      const categoryIndex = mockCategories.findIndex((c) => c.id === categoryId);

      if (categoryIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Categoría no encontrada',
        });
      }

      mockCategories[categoryIndex] = {
        ...mockCategories[categoryIndex],
        ...data,
        updated_at: new Date(),
      };

      return mockDelay({
        success: true,
        data: mockCategories[categoryIndex],
        message: 'Categoría actualizada correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.patch<ApiResponse<ProjectCategory>>(
      `/openings/categories/${categoryId}`,
      data
    );
    return response.data;
  },

  async deleteCategory(categoryId: string): Promise<ApiResponse<void>> {
    if (isMockMode) {
      const categoryIndex = mockCategories.findIndex((c) => c.id === categoryId);

      if (categoryIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Categoría no encontrada',
        });
      }

      mockCategories.splice(categoryIndex, 1);

      return mockDelay({
        success: true,
        message: 'Categoría eliminada correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.delete<ApiResponse<void>>(
      `/openings/categories/${categoryId}`
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Invitations
  // --------------------------------------------------------------------------

  async inviteSuppliers(
    categoryId: string,
    data: InviteSuppliersRequest
  ): Promise<ApiResponse<SupplierInvitation[]>> {
    if (isMockMode) {
      const newInvitations: SupplierInvitation[] = data.supplier_ids.map((supplierId) => ({
        id: `inv_${Date.now()}_${supplierId}`,
        project_id: category?.project_id || 'proj_001',
        category_id: categoryId,
        supplier_id: supplierId,
        status: 'pending',
        invited_at: new Date(),
        invited_by: 'user_admin',
        message: data.message,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        supplier: {
          id: supplierId,
          name: 'Proveedor Mock',
          email: 'supplier@example.com',
        },
      }));

      mockInvitations.push(...newInvitations);

      return mockDelay({
        success: true,
        data: newInvitations,
        message: `${newInvitations.length} invitaciones enviadas correctamente`,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<SupplierInvitation[]>>(
      `/openings/categories/${categoryId}/invite`,
      data
    );
    return response.data;
  },

  async getMyInvitations(): Promise<ApiResponse<SupplierInvitation[]>> {
    if (isMockMode) {
      // En mock, devolver todas las invitaciones
      // En real, el backend filtrará por el usuario actual
      return mockDelay({
        success: true,
        data: mockInvitations,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<SupplierInvitation[]>>(
      '/openings/invitations'
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Quotes
  // --------------------------------------------------------------------------

  async getQuotesByCategory(categoryId: string): Promise<ApiResponse<Quote[]>> {
    if (isMockMode) {
      const quotes = getMockQuotesByCategory(categoryId);

      return mockDelay({
        success: true,
        data: quotes,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<Quote[]>>(
      `/openings/categories/${categoryId}/quotes`
    );
    return response.data;
  },

  async createQuote(
    categoryId: string,
    data: CreateQuoteRequest,
    file?: File
  ): Promise<ApiResponse<Quote>> {
    if (isMockMode) {
      const newQuote: Quote = {
        id: `quote_${Date.now()}`,
        category_id: categoryId,
        supplier_id: 'user_supplier_current',
        amount: data.amount,
        currency: 'EUR',
        pdf_url: file ? `https://storage.example.com/quotes/quote_${Date.now()}.pdf` : '',
        notes: data.notes,
        delivery_days: data.delivery_days,
        warranty_months: data.warranty_months,
        payment_terms: data.payment_terms,
        status: 'submitted',
        submitted_at: new Date(),
        updated_at: new Date(),
        supplier: {
          id: 'user_supplier_current',
          name: 'Mi Empresa',
          email: 'mi@empresa.com',
        },
      };

      mockQuotes.push(newQuote);

      return mockDelay({
        success: true,
        data: newQuote,
        message: newQuote.status === 'draft' ? 'Borrador guardado' : 'Presupuesto enviado correctamente',
      });
    }

    if (!file) {
      return {
        success: false,
        error: 'El archivo PDF es requerido',
      };
    }

    // Modo real: llamada a Medusa
    const formData = new FormData();
    formData.append('file', file);
    formData.append('amount', data.amount.toString());
    if (data.delivery_days) formData.append('delivery_days', data.delivery_days.toString());
    if (data.warranty_months) formData.append('warranty_months', data.warranty_months.toString());
    if (data.payment_terms) formData.append('payment_terms', data.payment_terms);
    if (data.notes) formData.append('notes', data.notes);

    const response = await apiClient.post<ApiResponse<Quote>>(
      `/openings/categories/${categoryId}/quotes`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  async getQuoteByInvitation(invitationId: string): Promise<ApiResponse<Quote | null>> {
    if (isMockMode) {
      // Find invitation
      const invitation = mockInvitations.find(i => i.id === invitationId);
      if (!invitation) {
        return mockDelay({
          success: false,
          error: 'Invitación no encontrada',
        });
      }

      // Find quote for this category and supplier
      const quote = mockQuotes.find(
        q => q.category_id === invitation.category_id && q.supplier_id === invitation.supplier_id
      );

      return mockDelay({
        success: true,
        data: quote || null,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<Quote | null>>(
      `/openings/invitations/${invitationId}/quote`
    );
    return response.data;
  },

  async updateQuote(
    quoteId: string,
    data: Partial<CreateQuoteRequest>,
    file?: File
  ): Promise<ApiResponse<Quote>> {
    if (isMockMode) {
      const quoteIndex = mockQuotes.findIndex(q => q.id === quoteId);
      
      if (quoteIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Presupuesto no encontrado',
        });
      }

      const quote = mockQuotes[quoteIndex];

      // Update fields
      if (data.amount !== undefined) quote.amount = data.amount;
      if (data.delivery_days !== undefined) quote.delivery_days = data.delivery_days;
      if (data.warranty_months !== undefined) quote.warranty_months = data.warranty_months;
      if (data.payment_terms !== undefined) quote.payment_terms = data.payment_terms;
      if (data.notes !== undefined) quote.notes = data.notes;
      if (file) quote.pdf_url = `https://storage.example.com/quotes/quote_${Date.now()}.pdf`;
      quote.updated_at = new Date();

      return mockDelay({
        success: true,
        data: quote,
        message: quote.status === 'draft' ? 'Borrador guardado' : 'Presupuesto actualizado',
      });
    }

    // Modo real: llamada a Medusa
    if (file) {
      // Si hay archivo, usar FormData
      const formData = new FormData();
      formData.append('file', file);
      if (data.amount !== undefined) formData.append('amount', data.amount.toString());
      if (data.delivery_days) formData.append('delivery_days', data.delivery_days.toString());
      if (data.warranty_months) formData.append('warranty_months', data.warranty_months.toString());
      if (data.payment_terms) formData.append('payment_terms', data.payment_terms);
      if (data.notes) formData.append('notes', data.notes);

      const response = await apiClient.patch<ApiResponse<Quote>>( 
        `/openings/quotes/${quoteId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } else {
      // Sin archivo, usar JSON normal
      const response = await apiClient.patch<ApiResponse<Quote>>(
        `/openings/quotes/${quoteId}`,
        data
      );
      return response.data;
    }
  },

  async awardQuote(quoteId: string): Promise<ApiResponse<{ quote: Quote; other_quotes_updated: number }>> {
    if (isMockMode) {
      const quoteIndex = mockQuotes.findIndex((q) => q.id === quoteId);
      if (quoteIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Presupuesto no encontrado',
        });
      }

      const quote = mockQuotes[quoteIndex];
      quote.status = 'awarded';
      quote.updated_at = new Date();

      // Rechazar otros presupuestos de la misma categoría
      const otherQuotes = mockQuotes.filter(
        (q) => q.category_id === quote.category_id && q.id !== quoteId
      );
      otherQuotes.forEach((q) => {
        q.status = 'rejected';
        q.updated_at = new Date();
      });

      return mockDelay({
        success: true,
        data: {
          quote,
          other_quotes_updated: otherQuotes.length,
        },
        message: 'Presupuesto adjudicado correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<{ quote: Quote; other_quotes_updated: number }>>(
      `/openings/quotes/${quoteId}/award`,
      {}
    );
    return response.data;
  },

  async revertQuote(quoteId: string): Promise<ApiResponse<{ quote: Quote; other_quotes_updated: number }>> {
    if (isMockMode) {
      const quoteIndex = mockQuotes.findIndex((q) => q.id === quoteId);
      if (quoteIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Presupuesto no encontrado',
        });
      }

      const quote = mockQuotes[quoteIndex];
      
      // Solo se puede revertir si está adjudicado
      if (quote.status !== 'awarded') {
        return mockDelay({
          success: false,
          error: 'Solo se pueden revertir presupuestos adjudicados',
        });
      }

      quote.status = 'submitted';
      quote.updated_at = new Date();

      // Revertir otros presupuestos rechazados a submitted
      const otherQuotes = mockQuotes.filter(
        (q) => q.category_id === quote.category_id && q.id !== quoteId && q.status === 'rejected'
      );
      otherQuotes.forEach((q) => {
        q.status = 'submitted';
        q.updated_at = new Date();
      });

      return mockDelay({
        success: true,
        data: {
          quote,
          other_quotes_updated: otherQuotes.length,
        },
        message: 'Adjudicación revertida correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<{ quote: Quote; other_quotes_updated: number }>>(
      `/openings/quotes/${quoteId}/revert`,
      {}
    );
    return response.data;
  },

  async getQuoteComparison(categoryId: string): Promise<ApiResponse<QuoteComparisonData>> {
    if (isMockMode) {
      const category = mockCategories.find((c) => c.id === categoryId);
      if (!category) {
        return mockDelay({
          success: false,
          error: 'Categoría no encontrada',
        });
      }

      // Obtener solo quotes enviados o adjudicados (no borradores)
      const allQuotes = getMockQuotesByCategory(categoryId);
      const quotes = allQuotes.filter(
        (q) => q.status === 'submitted' || q.status === 'awarded' || q.status === 'rejected'
      );

      return mockDelay({
        success: true,
        data: {
          category_id: categoryId,
          category_name: category.name,
          budget_estimate: category.budget_estimate,
          quotes: quotes.map((q) => ({
            id: q.id,
            supplier: q.supplier!,
            amount: q.amount,
            delivery_days: q.delivery_days,
            warranty_months: q.warranty_months,
            payment_terms: q.payment_terms,
            pdf_url: q.pdf_url,
            status: q.status,
            submitted_at: q.submitted_at,
          })),
        },
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<QuoteComparisonData>>(
      `/openings/categories/${categoryId}/quotes/comparison`
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Signatures
  // --------------------------------------------------------------------------

  async signQuote(quoteId: string, data: SignQuoteRequest): Promise<ApiResponse<Signature>> {
    if (isMockMode) {
      const quote = mockQuotes.find((q) => q.id === quoteId);
      if (!quote) {
        return mockDelay({
          success: false,
          error: 'Presupuesto no encontrado',
        });
      }

      const newSignature: Signature = {
        id: `sig_${Date.now()}`,
        quote_id: quoteId,
        franchisee_id: 'user_franchisee_current',
        signed_pdf_url: `https://storage.example.com/signatures/sig_${Date.now()}_signed.pdf`,
        signature_hash: `hash_${Date.now()}`,
        signature_method: 'digital',
        signed_at: new Date(),
        ip_address: '192.168.1.1',
        user_agent: navigator.userAgent,
        terms_version: data.terms_version,
        consent_text: data.consent_text,
      };

      mockSignatures.push(newSignature);

      return mockDelay({
        success: true,
        data: newSignature,
        message: 'Documento firmado correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<Signature>>(
      `/openings/quotes/${quoteId}/sign`,
      data
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Financial Approvals
  // --------------------------------------------------------------------------

  async requestFinancing(projectId: string): Promise<ApiResponse<FinancialApproval>> {
    if (isMockMode) {
      const newApproval: FinancialApproval = {
        id: `appr_${Date.now()}`,
        project_id: projectId,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockFinancialApprovals.push(newApproval);

      return mockDelay({
        success: true,
        data: newApproval,
        message: 'Solicitud de financiación enviada correctamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<FinancialApproval>>(
      `/openings/projects/${projectId}/request-financing`,
      {}
    );
    return response.data;
  },

  async reviewFinancing(
    approvalId: string,
    data: ReviewFinancingRequest
  ): Promise<ApiResponse<FinancialApproval>> {
    if (isMockMode) {
      const approvalIndex = mockFinancialApprovals.findIndex((a) => a.id === approvalId);
      if (approvalIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Aprobación no encontrada',
        });
      }

      const approval = mockFinancialApprovals[approvalIndex];
      approval.status = data.status;
      approval.amount_approved = data.amount_approved;
      approval.notes = data.notes;
      approval.conditions = data.conditions;
      approval.rejection_reason = data.rejection_reason;
      approval.updated_at = new Date();

      if (data.status === 'approved' || data.status === 'approved_with_conditions') {
        approval.approved_at = new Date();
      } else if (data.status === 'rejected') {
        approval.rejected_at = new Date();
      }

      return mockDelay({
        success: true,
        data: approval,
        message: 'Revisión de financiación completada',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<FinancialApproval>>(
      `/openings/approvals/${approvalId}/review`,
      data
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Audit Logs
  // --------------------------------------------------------------------------

  async getAuditLogs(projectId: string): Promise<ApiResponse<AuditLog[]>> {
    if (isMockMode) {
      const logs = getMockAuditLogsByProject(projectId);

      return mockDelay({
        success: true,
        data: logs,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<AuditLog[]>>(
      `/openings/projects/${projectId}/audit`
    );
    return response.data;
  },

  // ============================================================================
  // Proveedores
  // ============================================================================

  async getSuppliers(): Promise<ApiResponse<MockSupplier[]>> {
    if (isMockMode) {
      return mockDelay({
        success: true,
        data: mockSuppliers,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<MockSupplier[]>>('/openings/suppliers');
    return response.data;
  },

  // ============================================================================
  // Invitaciones
  // ============================================================================

  async getInvitationsByProject(projectId: string): Promise<ApiResponse<SupplierInvitation[]>> {
    if (isMockMode) {
      // Get all invitations that belong to categories of this project
      const projectCategories = getMockCategoriesByProject(projectId);
      const categoryIds = projectCategories.map(c => c.id);
      const invitations = mockInvitations.filter(inv => categoryIds.includes(inv.category_id));

      return mockDelay({
        success: true,
        data: invitations,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.get<ApiResponse<SupplierInvitation[]>>(
      `/openings/projects/${projectId}/invitations`
    );
    return response.data;
  },

  async createInvitation(data: {
    category_id: string;
    supplier_ids: string[];
    message?: string;
    deadline_days: number;
  }): Promise<ApiResponse<SupplierInvitation[]>> {
    if (isMockMode) {
      const category = mockCategories.find(c => c.id === data.category_id);
      
      if (!category) {
        return mockDelay({
          success: false,
          error: 'Categoría no encontrada',
        });
      }

      // Create invitations for each supplier
      const newInvitations: SupplierInvitation[] = data.supplier_ids.map((supplierId) => {
        const supplier = mockSuppliers.find(s => s.id === supplierId);
        const invitedAt = new Date();
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + data.deadline_days);

        const invitation: SupplierInvitation = {
          id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          project_id: category.project_id,
          category_id: data.category_id,
          supplier_id: supplierId,
          status: 'pending',
          invited_at: invitedAt,
          invited_by: 'user_admin', // En producción vendría del contexto de auth
          message: data.message,
          deadline,
          supplier: supplier ? {
            id: supplier.id,
            name: supplier.name,
            email: supplier.email,
          } : undefined,
          category: {
            id: category.id,
            name: category.name,
            description: category.description,
            budget_estimate: category.budget_estimate,
          },
        };

        mockInvitations.push(invitation);
        return invitation;
      });

      return mockDelay({
        success: true,
        data: newInvitations,
        message: `${newInvitations.length} invitación(es) creada(s) exitosamente`,
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.post<ApiResponse<SupplierInvitation[]>>(
      '/openings/invitations',
      data
    );
    return response.data;
  },

  async deleteInvitation(invitationId: string): Promise<ApiResponse<void>> {
    if (isMockMode) {
      const invitationIndex = mockInvitations.findIndex(i => i.id === invitationId);
      
      if (invitationIndex === -1) {
        return mockDelay({
          success: false,
          error: 'Invitación no encontrada',
        });
      }

      mockInvitations.splice(invitationIndex, 1);

      return mockDelay({
        success: true,
        message: 'Invitación eliminada exitosamente',
      });
    }

    // Modo real: llamada a Medusa
    const response = await apiClient.delete<ApiResponse<void>>(
      `/openings/invitations/${invitationId}`
    );
    return response.data;
  },

  // --------------------------------------------------------------------------
  // Documents
  // --------------------------------------------------------------------------

  /**
   * Subir documento/plano técnico a un proyecto
   */
  async uploadProjectDocument(
    projectId: string,
    data: UploadDocumentRequest
  ): Promise<ApiResponse<ProjectDocument>> {
    if (isMockMode) {
      const newDoc: ProjectDocument = {
        id: `doc_${Date.now()}`,
        project_id: projectId,
        category: data.category,
        subcategory: data.subcategory || null,
        name: data.name,
        description: data.description || null,
        file_url: `https://storage.example.com/docs/${data.category}_${projectId}_${Date.now()}.pdf`,
        file_name: data.file.name,
        file_size_bytes: data.file.size,
        file_mime_type: data.file.type,
        uploaded_by: 'admin_user_id',
        uploaded_at: new Date().toISOString(),
        is_active: true,
        version: 1,
      };

      // Añadir a mockProjectDocuments
      addMockDocument(newDoc);

      return mockDelay({
        success: true,
        data: newDoc,
        message: 'Documento subido exitosamente',
      });
    }

    // Modo real: llamada al backend
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('category', data.category);
    if (data.subcategory) formData.append('subcategory', data.subcategory);
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);

    const response = await apiClient.post<ApiResponse<ProjectDocument>>(
      `/admin/openings/projects/${projectId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Obtener lista de documentos de un proyecto
   */
  async getProjectDocuments(
    projectId: string,
    filters?: {
      category?: DocumentCategory;
      subcategory?: string;
    }
  ): Promise<ApiResponse<ProjectDocumentsResponse>> {
    if (isMockMode) {
      let documents = getMockDocumentsByProject(projectId);

      // Aplicar filtros
      if (filters?.category) {
        documents = documents.filter((d) => d.category === filters.category);
      }
      if (filters?.subcategory) {
        documents = documents.filter((d) => d.subcategory === filters.subcategory);
      }

      // Calcular estadísticas por categoría
      const categories: Record<string, number> = {};
      documents.forEach((doc) => {
        categories[doc.category] = (categories[doc.category] || 0) + 1;
      });

      return mockDelay({
        success: true,
        data: {
          project_id: projectId,
          documents,
          total_documents: documents.length,
          categories: categories as Record<DocumentCategory, number>,
        },
      });
    }

    // Modo real: llamada al backend
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.subcategory) params.append('subcategory', filters.subcategory);

    const queryString = params.toString();
    const url = `/admin/openings/projects/${projectId}/documents${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ApiResponse<ProjectDocumentsResponse>>(url);
    return response.data;
  },

  /**
   * Obtener URL de descarga de un documento específico
   */
  async getDocumentDownloadUrl(
    projectId: string,
    documentId: string
  ): Promise<ApiResponse<{ download_url: string; expires_at: string }>> {
    if (isMockMode) {
      const doc = getMockDocumentById(documentId);
      
      if (!doc) {
        return mockDelay({
          success: false,
          error: 'Documento no encontrado',
        });
      }

      return mockDelay({
        success: true,
        data: {
          download_url: doc.file_url,
          expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hora
        },
      });
    }

    // Modo real: llamada al backend
    const response = await apiClient.get<ApiResponse<{ download_url: string; expires_at: string }>>(
      `/admin/openings/projects/${projectId}/documents/${documentId}`
    );
    return response.data;
  },

  /**
   * Eliminar un documento del proyecto
   */
  async deleteProjectDocument(
    projectId: string,
    documentId: string
  ): Promise<ApiResponse<void>> {
    if (isMockMode) {
      deleteMockDocument(documentId);

      return mockDelay({
        success: true,
        data: undefined,
        message: 'Documento eliminado exitosamente',
      });
    }

    // Modo real: llamada al backend
    const response = await apiClient.delete<ApiResponse<void>>(
      `/admin/openings/projects/${projectId}/documents/${documentId}`
    );
    return response.data;
  },

  // ==========================================================================
  // GESTIÓN DE ESTADO DEL PROYECTO
  // ==========================================================================

  /**
   * Actualizar el estado del proyecto
   */
  async updateProjectStatus(
    projectId: string,
    data: import('@/types/openings').UpdateProjectStatusRequest
  ): Promise<ApiResponse<import('@/types/openings').OpeningProject>> {
    if (isMockMode) {
      const project = getMockProjects().find((p) => p.id === projectId);

      if (!project) {
        return mockDelay({
          success: false,
          error: 'Proyecto no encontrado',
        });
      }

      // Actualizar estado en mock
      project.status = data.new_status;

      // Agregar entrada al historial
      addMockStatusHistory(projectId, {
        from_status: project.status,
        to_status: data.new_status,
        notes: data.notes,
      });

      return mockDelay({
        success: true,
        data: project,
        message: 'Estado del proyecto actualizado',
      });
    }

    // Modo real: llamada al backend
    const response = await apiClient.patch<ApiResponse<import('@/types/openings').OpeningProject>>(
      `/admin/openings/projects/${projectId}/status`,
      data
    );
    return response.data;
  },

  /**
   * Obtener historial de cambios de estado del proyecto
   */
  async getStatusHistory(
    projectId: string
  ): Promise<ApiResponse<import('@/types/openings').StatusHistoryResponse>> {
    if (isMockMode) {
      const project = getMockProjects().find((p) => p.id === projectId);

      if (!project) {
        return mockDelay({
          success: false,
          error: 'Proyecto no encontrado',
        });
      }

      const history = getMockStatusHistory(projectId);

      return mockDelay({
        success: true,
        data: {
          project_id: projectId,
          current_status: project.status,
          history,
        },
      });
    }

    // Modo real: llamada al backend
    const response = await apiClient.get<ApiResponse<import('@/types/openings').StatusHistoryResponse>>(
      `/admin/openings/projects/${projectId}/status-history`
    );
    return response.data;
  },
};

// Exportar como default también
export default openingsApi;
