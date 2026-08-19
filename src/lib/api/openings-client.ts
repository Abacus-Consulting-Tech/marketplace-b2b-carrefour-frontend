/**
 * Cliente API para el Módulo de Nuevas Aperturas
 * 
 * Implementa todas las llamadas API necesarias con soporte para:
 * - Modo Mock (desarrollo sin backend)
 * - Modo Real (integración con Medusa)
 * 
 * Cambiar entre modos con variable de entorno:
 * NEXT_PUBLIC_MOCK_OPENINGS=true/false
 */

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
} from '@/types/openings';

import {
  mockProjects,
  mockCategories,
  mockQuotes,
  mockInvitations,
  mockSignatures,
  mockFinancialApprovals,
  getMockProjectById,
  getMockCategoriesByProject,
  getMockQuotesByCategory,
  getMockAuditLogsByProject,
  addMockProject,
  updateMockProject,
} from './openings-mock';

import { apiClient } from './client';

// ============================================================================
// Configuración
// ============================================================================

const isMockMode = process.env.NEXT_PUBLIC_MOCK_OPENINGS === 'true';

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
    file: File
  ): Promise<ApiResponse<Quote>> {
    if (isMockMode) {
      const newQuote: Quote = {
        id: `quote_${Date.now()}`,
        category_id: categoryId,
        supplier_id: 'user_supplier_current',
        amount: data.amount,
        currency: 'EUR',
        pdf_url: `https://storage.example.com/quotes/quote_${Date.now()}.pdf`,
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
        message: 'Presupuesto enviado correctamente',
      });
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

  async getQuoteComparison(categoryId: string): Promise<ApiResponse<QuoteComparisonData>> {
    if (isMockMode) {
      const category = mockCategories.find((c) => c.id === categoryId);
      if (!category) {
        return mockDelay({
          success: false,
          error: 'Categoría no encontrada',
        });
      }

      const quotes = getMockQuotesByCategory(categoryId);

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
};

// Exportar como default también
export default openingsApi;
