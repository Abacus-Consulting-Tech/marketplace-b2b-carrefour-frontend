/**
 * Franchisees API Client
 * 
 * Dual mode client (mock/real) for franchisee management
 * Mode controlled by feature flags in @/config/feature-flags
 * 
 * Medusa endpoints:
 * - GET /admin/customers
 * - POST /admin/customers  
 * - POST /admin/customers/:id
 * - DELETE /admin/customers/:id
 * - GET /admin/customers/:id/addresses
 * - POST /admin/customers/:id/addresses
 * - PATCH /admin/customers/:id/addresses/:addressId
 * - DELETE /admin/customers/:id/addresses/:addressId
 * - GET /admin/orders?customer_id=:id
 */

import { featureFlags } from '@/config/feature-flags';
import type {
  Franchisee,
  FranchiseeMetadata,
  Address,
  ListFranchiseesFilters,
  ListFranchiseesResponse,
  CreateFranchiseeRequest,
  CreateFranchiseeResponse,
  UpdateFranchiseeRequest,
  UpdateFranchiseeResponse,
  GetFranchiseeRequest,
  GetFranchiseeResponse,
  DeleteFranchiseeResponse,
  AddAddressRequest,
  AddAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  GetFranchiseeOrdersRequest,
  GetFranchiseeOrdersResponse,
  GetFranchiseeStatsResponse,
  BulkUpdateFranchiseesRequest,
  BulkUpdateFranchiseesResponse,
  InviteFranchiseeRequest,
  InviteFranchiseeResponse,
  ApiResponse,
} from '@/types/franchisees';

import {
  mockFranchisees,
  mockB2BGroup,
  getFranchiseeById,
  getFranchiseesByFilters,
  getMockStatsForFranchisee,
  getMockOrdersForFranchisee,
  initializeMockFranchiseesStorage,
  persistMockFranchisees,
} from './franchisees-mock';

// ============================================================================
// Configuration
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('franchisees');
const API_BASE_URL = featureFlags.getApiBaseUrl('franchisees') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Franchisees API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('franchisees') ? 'Yes ✅' : 'No ⏳'})`
  );
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || null;
}

/**
 * Create headers for API requests
 */
function createHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...createHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// ============================================================================
// Mock Mode Implementations
// ============================================================================

/**
 * Mock: List franchisees
 */
function mockListFranchisees(filters?: ListFranchiseesFilters): Promise<ApiResponse<ListFranchiseesResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      let results = getFranchiseesByFilters({
        search: filters?.q,
        tier: filters?.groups?.[0],
        isActive: filters?.has_account,
      });

      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;
      const paginated = results.slice(offset, offset + limit);

      resolve({
        data: {
          customers: paginated,
          count: results.length,
          offset,
          limit,
        },
      });
    }, 300);
  });
}

/**
 * Mock: Get franchisee by ID
 */
function mockGetFranchisee(id: string): Promise<ApiResponse<GetFranchiseeResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const franchisee = getFranchiseeById(id);
      if (!franchisee) {
        reject(new Error('Franchisee not found'));
        return;
      }
      resolve({ data: { customer: franchisee } });
    }, 200);
  });
}

/**
 * Mock: Create franchisee
 */
function mockCreateFranchisee(request: CreateFranchiseeRequest): Promise<ApiResponse<CreateFranchiseeResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const newFranchisee: Franchisee = {
        id: `cus_${Date.now()}`,
        email: request.email,
        first_name: request.first_name,
        last_name: request.last_name,
        phone: request.phone,
        has_account: !!request.password,
        groups: request.groups ? [mockB2BGroup] : [],
        metadata: {
          ...request.metadata,
          is_active: true,
          approved_at: new Date().toISOString(),
          approved_by: 'admin@carrefour.es',
          total_orders: 0,
          total_spent: 0,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFranchisees.push(newFranchisee);
  persistMockFranchisees();

      resolve({
        data: { customer: newFranchisee },
        message: 'Franchisee created successfully',
      });
    }, 400);
  });
}

/**
 * Mock: Update franchisee
 */
function mockUpdateFranchisee(id: string, request: UpdateFranchiseeRequest): Promise<ApiResponse<UpdateFranchiseeResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const index = mockFranchisees.findIndex((f) => f.id === id);
      if (index === -1) {
        reject(new Error('Franchisee not found'));
        return;
      }

      const updated: Franchisee = {
        ...mockFranchisees[index],
        ...request,
        metadata: {
          ...mockFranchisees[index].metadata,
          ...request.metadata,
        },
        updated_at: new Date().toISOString(),
      } as Franchisee;

      mockFranchisees[index] = updated;
  persistMockFranchisees();

      resolve({
        data: { customer: updated },
        message: 'Franchisee updated successfully',
      });
    }, 400);
  });
}

/**
 * Mock: Update franchisee status (approve / suspend / deactivate)
 *
 * Mirrors the confirmed backend behaviour: when a franchisee moves into
 * 'active', we asynchronously (fire-and-forget) notify Odoo to create/update
 * the partner — never inside this same call.
 */
function mockUpdateFranchiseeStatus(
  id: string,
  status: NonNullable<FranchiseeMetadata['status']>
): Promise<ApiResponse<UpdateFranchiseeResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const index = mockFranchisees.findIndex((f) => f.id === id);
      if (index === -1) {
        reject(new Error('Franchisee not found'));
        return;
      }

      const previousStatus = mockFranchisees[index].metadata?.status;

      const updated: Franchisee = {
        ...mockFranchisees[index],
        metadata: {
          ...mockFranchisees[index].metadata,
          status,
          is_active: status === 'active',
          onboarding_status:
            status === 'active'
              ? 'approved_pending_credentials'
              : mockFranchisees[index].metadata?.subscription_status === 'active'
                ? 'pending_approval'
                : 'pending_payment',
          ...(status === 'active' && previousStatus !== 'active'
            ? { approved_at: new Date().toISOString(), approved_by: 'admin@carrefour.es' }
            : {}),
        },
        updated_at: new Date().toISOString(),
      };

      mockFranchisees[index] = updated;
  persistMockFranchisees();

      if (status === 'active' && previousStatus === 'pending_approval') {
        // Simulated outbox event, processed asynchronously (see FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md)
        setTimeout(() => {
          console.log(`🔄 [mock outbox] partner.franchisee_created emitido para ${updated.id} (sync Odoo en segundo plano)`);
        }, 500);
      }

      resolve({
        data: { customer: updated },
        message: 'Franchisee status updated successfully',
      });
    }, 400);
  });
}

/**
 * Mock: Invite a franchisee (name + email only)
 *
 * Generates a link to the public self-registration page. There's no real
 * email service, so the link is returned to the admin UI directly instead.
 */
function mockInviteFranchisee(request: InviteFranchiseeRequest): Promise<ApiResponse<InviteFranchiseeResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const registrationUrl = `${origin}/franchisee/register?invited_name=${encodeURIComponent(request.name)}&invited_email=${encodeURIComponent(request.email)}`;

      console.log(`📧 [mock email] Invitación de franquiciado enviada a ${request.email}: ${registrationUrl}`);

      resolve({
        data: {
          invitation: {
            id: `inv_${Date.now()}`,
            name: request.name,
            email: request.email,
            registrationUrl,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        },
        message: 'Invitation sent successfully',
      });
    }, 500);
  });
}

/**
 * Mock: Delete franchisee
 */
function mockDeleteFranchisee(id: string): Promise<ApiResponse<DeleteFranchiseeResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const index = mockFranchisees.findIndex((f) => f.id === id);
      if (index === -1) {
        reject(new Error('Franchisee not found'));
        return;
      }

      mockFranchisees.splice(index, 1);
  persistMockFranchisees();

      resolve({
        data: {
          id,
          object: 'customer',
          deleted: true,
        },
        message: 'Franchisee deleted successfully',
      });
    }, 300);
  });
}

/**
 * Mock: Add address
 */
function mockAddAddress(franchiseeId: string, request: AddAddressRequest): Promise<ApiResponse<AddAddressResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const franchisee = getFranchiseeById(franchiseeId);
      if (!franchisee) {
        reject(new Error('Franchisee not found'));
        return;
      }

      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        customer_id: franchiseeId,
        ...request.address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (!franchisee.shipping_addresses) {
        franchisee.shipping_addresses = [];
      }
      franchisee.shipping_addresses.push(newAddress);
      persistMockFranchisees();

      resolve({
        data: { customer: franchisee },
        message: 'Address added successfully',
      });
    }, 300);
  });
}

/**
 * Mock: Update address
 */
function mockUpdateAddress(
  franchiseeId: string,
  addressId: string,
  request: UpdateAddressRequest
): Promise<ApiResponse<UpdateAddressResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const franchisee = getFranchiseeById(franchiseeId);
      if (!franchisee) {
        reject(new Error('Franchisee not found'));
        return;
      }

      const addressIndex = franchisee.shipping_addresses?.findIndex((a) => a.id === addressId);
      if (addressIndex === undefined || addressIndex === -1) {
        reject(new Error('Address not found'));
        return;
      }

      franchisee.shipping_addresses![addressIndex] = {
        ...franchisee.shipping_addresses![addressIndex],
        ...request,
        updated_at: new Date().toISOString(),
      };
      persistMockFranchisees();

      resolve({
        data: { customer: franchisee },
        message: 'Address updated successfully',
      });
    }, 300);
  });
}

/**
 * Mock: Delete address
 */
function mockDeleteAddress(franchiseeId: string, addressId: string): Promise<ApiResponse<AddAddressResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const franchisee = getFranchiseeById(franchiseeId);
      if (!franchisee) {
        reject(new Error('Franchisee not found'));
        return;
      }

      if (!franchisee.shipping_addresses) {
        reject(new Error('No addresses found'));
        return;
      }

      franchisee.shipping_addresses = franchisee.shipping_addresses.filter((a) => a.id !== addressId);
  persistMockFranchisees();

      resolve({
        data: { customer: franchisee },
        message: 'Address deleted successfully',
      });
    }, 300);
  });
}

/**
 * Mock: Get franchisee orders
 */
function mockGetFranchiseeOrders(request: GetFranchiseeOrdersRequest): Promise<ApiResponse<GetFranchiseeOrdersResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getMockOrdersForFranchisee(request.customer_id);
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginated = orders.slice(offset, offset + limit);

      resolve({
        data: {
          orders: paginated,
          count: orders.length,
          offset,
          limit,
        },
      });
    }, 300);
  });
}

/**
 * Mock: Get franchisee stats
 */
function mockGetFranchiseeStats(franchiseeId: string): Promise<ApiResponse<GetFranchiseeStatsResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = getMockStatsForFranchisee(franchiseeId);
      resolve({ data: { stats } });
    }, 300);
  });
}

/**
 * Mock: Bulk update franchisees
 */
function mockBulkUpdateFranchisees(request: BulkUpdateFranchiseesRequest): Promise<ApiResponse<BulkUpdateFranchiseesResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const updated: Franchisee[] = [];

      request.customer_ids.forEach((id) => {
        const index = mockFranchisees.findIndex((f) => f.id === id);
        if (index !== -1) {
          mockFranchisees[index] = {
            ...mockFranchisees[index],
            metadata: {
              ...mockFranchisees[index].metadata,
              ...request.metadata,
            },
            groups: request.groups || mockFranchisees[index].groups,
            updated_at: new Date().toISOString(),
          } as Franchisee;
          updated.push(mockFranchisees[index]);
        }
      });

      persistMockFranchisees();

      resolve({
        data: {
          updated: updated.length,
          customers: updated,
        },
        message: `${updated.length} franchisees updated successfully`,
      });
    }, 500);
  });
}

// ============================================================================
// API Client
// ============================================================================

export const franchiseesApi = {
  /**
   * Check if running in mock mode
   */
  isMockMode: () => isMockMode,

  /**
   * List franchisees
   * GET /admin/customers
   */
  async listFranchisees(filters?: ListFranchiseesFilters): Promise<ApiResponse<ListFranchiseesResponse>> {
    if (isMockMode) {
      return mockListFranchisees(filters);
    }

    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.expand) params.append('expand', filters.expand);
    if (filters?.has_account !== undefined) params.append('has_account', filters.has_account.toString());

    const queryString = params.toString();
    const endpoint = `/admin/customers${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ListFranchiseesResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get franchisee by ID
   * GET /admin/customers/:id
   */
  async getFranchisee(request: GetFranchiseeRequest): Promise<ApiResponse<GetFranchiseeResponse>> {
    if (isMockMode) {
      return mockGetFranchisee(request.id);
    }

    const params = new URLSearchParams();
    if (request.expand) params.append('expand', request.expand);

    const queryString = params.toString();
    const endpoint = `/admin/customers/${request.id}${queryString ? `?${queryString}` : ''}`;

    return apiRequest<GetFranchiseeResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Create franchisee
   * POST /admin/customers
   */
  async createFranchisee(request: CreateFranchiseeRequest): Promise<ApiResponse<CreateFranchiseeResponse>> {
    if (isMockMode) {
      return mockCreateFranchisee(request);
    }

    return apiRequest<CreateFranchiseeResponse>('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Update franchisee
   * POST /admin/customers/:id
   */
  async updateFranchisee(id: string, request: UpdateFranchiseeRequest): Promise<ApiResponse<UpdateFranchiseeResponse>> {
    if (isMockMode) {
      return mockUpdateFranchisee(id, request);
    }

    return apiRequest<UpdateFranchiseeResponse>(`/admin/customers/${id}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Update franchisee status (approve / suspend / deactivate)
   * PATCH /admin/franchisees/:id/status (per backend notes; contract vs
   * /admin/customers/:id still needs confirming with backend — see open
   * questions in FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md)
   */
  async updateFranchiseeStatus(
    id: string,
    status: NonNullable<FranchiseeMetadata['status']>
  ): Promise<ApiResponse<UpdateFranchiseeResponse>> {
    if (isMockMode) {
      return mockUpdateFranchiseeStatus(id, status);
    }

    return apiRequest<UpdateFranchiseeResponse>(`/admin/franchisees/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Invite a franchisee (name + email only)
   * POST /admin/franchisees/invitations (proposed endpoint, not built yet)
   */
  async inviteFranchisee(request: InviteFranchiseeRequest): Promise<ApiResponse<InviteFranchiseeResponse>> {
    if (isMockMode) {
      return mockInviteFranchisee(request);
    }

    return apiRequest<InviteFranchiseeResponse>('/admin/franchisees/invitations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Delete franchisee
   * DELETE /admin/customers/:id
   */
  async deleteFranchisee(id: string): Promise<ApiResponse<DeleteFranchiseeResponse>> {
    if (isMockMode) {
      return mockDeleteFranchisee(id);
    }

    return apiRequest<DeleteFranchiseeResponse>(`/admin/customers/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add address to franchisee
   * POST /admin/customers/:id/addresses
   */
  async addAddress(franchiseeId: string, request: AddAddressRequest): Promise<ApiResponse<AddAddressResponse>> {
    if (isMockMode) {
      return mockAddAddress(franchiseeId, request);
    }

    return apiRequest<AddAddressResponse>(`/admin/customers/${franchiseeId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Update address
   * PATCH /admin/customers/:id/addresses/:addressId
   */
  async updateAddress(
    franchiseeId: string,
    addressId: string,
    request: UpdateAddressRequest
  ): Promise<ApiResponse<UpdateAddressResponse>> {
    if (isMockMode) {
      return mockUpdateAddress(franchiseeId, addressId, request);
    }

    return apiRequest<UpdateAddressResponse>(`/admin/customers/${franchiseeId}/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  },

  /**
   * Delete address
   * DELETE /admin/customers/:id/addresses/:addressId
   */
  async deleteAddress(franchiseeId: string, addressId: string): Promise<ApiResponse<AddAddressResponse>> {
    if (isMockMode) {
      return mockDeleteAddress(franchiseeId, addressId);
    }

    return apiRequest<AddAddressResponse>(`/admin/customers/${franchiseeId}/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get franchisee orders
   * GET /admin/orders?customer_id=:id
   */
  async getFranchiseeOrders(request: GetFranchiseeOrdersRequest): Promise<ApiResponse<GetFranchiseeOrdersResponse>> {
    if (isMockMode) {
      return mockGetFranchiseeOrders(request);
    }

    const params = new URLSearchParams();
    params.append('customer_id', request.customer_id);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());
    if (request.status) params.append('status', request.status.join(','));

    const queryString = params.toString();
    const endpoint = `/admin/orders?${queryString}`;

    return apiRequest<GetFranchiseeOrdersResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get franchisee statistics
   * Custom endpoint (may need backend implementation)
   */
  async getFranchiseeStats(franchiseeId: string): Promise<ApiResponse<GetFranchiseeStatsResponse>> {
    if (isMockMode) {
      return mockGetFranchiseeStats(franchiseeId);
    }

    return apiRequest<GetFranchiseeStatsResponse>(`/admin/customers/${franchiseeId}/stats`, {
      method: 'GET',
    });
  },

  /**
   * Bulk update franchisees
   * Custom endpoint (may need backend implementation)
   */
  async bulkUpdateFranchisees(request: BulkUpdateFranchiseesRequest): Promise<ApiResponse<BulkUpdateFranchiseesResponse>> {
    if (isMockMode) {
      return mockBulkUpdateFranchisees(request);
    }

    return apiRequest<BulkUpdateFranchiseesResponse>('/admin/customers/bulk', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

/**
 * Export for use in components
 */
export default franchiseesApi;
