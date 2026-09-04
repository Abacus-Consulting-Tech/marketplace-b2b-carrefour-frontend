/**
 * Franchisees API Client
 *
 * Canonical admin contract uses the custom B2B `/admin/franchisees*` family.
 * This client still returns a small set of compatibility fields so the admin UI
 * can be migrated incrementally without keeping the old `/admin/customers*`
 * endpoints alive.
 */

import { featureFlags } from '@/config/feature-flags';
import { shouldUseMockFranchiseeInvitations } from '@/lib/config/franchisee-onboarding';
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
import { getBackendBaseUrl } from './api-utils';

// ============================================================================
// Configuration
// ============================================================================

const isMockMode = featureFlags.shouldUseMock('franchisees');
const isMockInviteMode = shouldUseMockFranchiseeInvitations;
const API_BASE_URL = featureFlags.getApiBaseUrl('franchisees') || getBackendBaseUrl('/backend');

type BackendSubscriptionStatus = 'not_configured' | 'pending' | 'active' | 'past_due' | 'canceled';

interface BackendFranchiseeRecord {
  id: string;
  name?: string;
  email: string;
  tax_id?: string;
  contact_person?: string;
  phone?: string;
  company_name?: string;
  store_code?: string;
  region?: string;
  address?: string;
  municipality?: string;
  postal_code?: string;
  country?: string;
  status?: 'pending_approval' | 'active' | 'suspended' | 'inactive';
  subscription_status?: BackendSubscriptionStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  notes?: string;
  onboarding_status?: 'pending_payment' | 'pending_approval' | 'approved_pending_credentials' | 'credentials_sent' | 'active';
  current_period_end?: string;
  shipping_addresses?: Address[];
}

interface BackendListFranchiseesResponse {
  franchisees: BackendFranchiseeRecord[];
  total: number;
  skip?: number;
  take?: number;
  offset?: number;
  limit?: number;
}

interface BackendSingleFranchiseeResponse {
  franchisee: BackendFranchiseeRecord;
}

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
  return localStorage.getItem('auth-token') || localStorage.getItem('auth_token') || null;
}

function splitNameParts(name?: string): { firstName?: string; lastName?: string } {
  if (!name?.trim()) {
    return {};
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function normalizeFranchisee(record: BackendFranchiseeRecord): Franchisee {
  const nameSource = record.contact_person || record.name;
  const { firstName, lastName } = splitNameParts(nameSource);
  const status = record.status || 'pending_approval';
  const companyName = record.company_name || record.name;

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    tax_id: record.tax_id,
    contact_person: record.contact_person,
    phone: record.phone,
    company_name: companyName,
    store_code: record.store_code,
    region: record.region,
    address: record.address,
    municipality: record.municipality,
    postal_code: record.postal_code,
    country: record.country,
    status,
    subscription_status: record.subscription_status,
    first_name: firstName,
    last_name: lastName,
    has_account: status !== 'pending_approval',
    shipping_addresses: record.shipping_addresses || [],
    metadata: {
      company_name: companyName,
      tax_id: record.tax_id,
      store_code: record.store_code,
      address: record.address,
      municipality: record.municipality,
      postal_code: record.postal_code,
      region: record.region,
      country: record.country,
      status,
      subscription_status: record.subscription_status,
      onboarding_status: record.onboarding_status,
      current_period_end: record.current_period_end,
      notes: record.notes,
      is_active: status === 'active',
    },
    created_at: record.created_at,
    updated_at: record.updated_at,
    deleted_at: record.deleted_at,
  };
}

function toLegacySingleResponse(franchisee: Franchisee) {
  return {
    franchisee,
    customer: franchisee,
  };
}

function normalizeListResponse(response: BackendListFranchiseesResponse): ListFranchiseesResponse {
  const franchisees = response.franchisees.map(normalizeFranchisee);
  const skip = response.skip ?? response.offset ?? 0;
  const take = response.take ?? response.limit ?? franchisees.length;

  return {
    franchisees,
    total: response.total,
    skip,
    take,
    customers: franchisees,
    count: response.total,
    offset: skip,
    limit: take,
  };
}

function mapCreateRequest(request: CreateFranchiseeRequest) {
  return {
    name: request.name,
    email: request.email,
    tax_id: request.tax_id,
    contact_person: request.contact_person,
    company_name: request.company_name,
    phone: request.phone,
    store_code: request.store_code,
    region: request.region,
    address: request.address,
    municipality: request.municipality,
    postal_code: request.postal_code,
    country: request.country,
  };
}

function mapUpdateRequest(request: UpdateFranchiseeRequest) {
  return {
    name: request.name,
    email: request.email,
    tax_id: request.tax_id,
    contact_person: request.contact_person,
    company_name: request.company_name,
    phone: request.phone,
    store_code: request.store_code,
    region: request.region,
    address: request.address,
    municipality: request.municipality,
    postal_code: request.postal_code,
    country: request.country,
  };
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
      const franchisees = paginated.map((item) => ({
        ...item,
        name: item.name || item.metadata?.company_name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
        tax_id: item.tax_id || item.metadata?.tax_id,
        company_name: item.company_name || item.metadata?.company_name,
        contact_person: item.contact_person || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
        region: item.region || item.metadata?.region,
        municipality: item.municipality || item.metadata?.city,
        country: item.country || item.metadata?.country,
        status: item.status || item.metadata?.status,
        subscription_status: item.subscription_status || item.metadata?.subscription_status,
      }));

      resolve({
        data: {
          franchisees,
          total: results.length,
          skip: offset,
          take: limit,
          customers: franchisees,
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
      const normalized = {
        ...franchisee,
        name: franchisee.name || franchisee.metadata?.company_name || `${franchisee.first_name || ''} ${franchisee.last_name || ''}`.trim(),
        tax_id: franchisee.tax_id || franchisee.metadata?.tax_id,
        company_name: franchisee.company_name || franchisee.metadata?.company_name,
        contact_person: franchisee.contact_person || `${franchisee.first_name || ''} ${franchisee.last_name || ''}`.trim(),
        region: franchisee.region || franchisee.metadata?.region,
        municipality: franchisee.municipality || franchisee.metadata?.city,
        country: franchisee.country || franchisee.metadata?.country,
        status: franchisee.status || franchisee.metadata?.status,
        subscription_status: franchisee.subscription_status || franchisee.metadata?.subscription_status,
      };
      resolve({ data: toLegacySingleResponse(normalized) });
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
        id: `franchisee_${Date.now()}`,
        name: request.name,
        email: request.email,
        tax_id: request.tax_id,
        contact_person: request.contact_person,
        phone: request.phone,
        company_name: request.company_name || request.name,
        store_code: request.store_code,
        region: request.region,
        address: request.address,
        municipality: request.municipality,
        postal_code: request.postal_code,
        country: request.country,
        has_account: false,
        groups: [mockB2BGroup],
        status: 'pending_approval',
        metadata: {
          company_name: request.company_name || request.name,
          tax_id: request.tax_id,
          store_code: request.store_code,
          region: request.region,
          address: request.address,
          municipality: request.municipality,
          postal_code: request.postal_code,
          country: request.country,
          status: 'pending_approval',
          is_active: false,
          total_orders: 0,
          total_spent: 0,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFranchisees.push(newFranchisee);
  persistMockFranchisees();

      resolve({
        data: {
          franchisee: newFranchisee,
          customer: newFranchisee,
        },
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
          company_name: request.company_name ?? mockFranchisees[index].metadata.company_name,
          tax_id: request.tax_id ?? mockFranchisees[index].metadata.tax_id,
          store_code: request.store_code ?? mockFranchisees[index].metadata.store_code,
          region: request.region ?? mockFranchisees[index].metadata.region,
          address: request.address ?? mockFranchisees[index].metadata.address,
          municipality: request.municipality ?? mockFranchisees[index].metadata.municipality,
          postal_code: request.postal_code ?? mockFranchisees[index].metadata.postal_code,
          country: request.country ?? mockFranchisees[index].metadata.country,
        },
        updated_at: new Date().toISOString(),
      } as Franchisee;

      mockFranchisees[index] = updated;
  persistMockFranchisees();

      resolve({
        data: {
          franchisee: updated,
          customer: updated,
        },
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
        data: {
          franchisee: updated,
          customer: updated,
        },
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
      const invitationToken = `inv_${Date.now()}`;
      const registrationUrl = `${origin}/franchisee/register?token=${encodeURIComponent(invitationToken)}&invited_name=${encodeURIComponent(request.name)}&invited_email=${encodeURIComponent(request.email)}`;

      console.log(`📧 [mock email] Invitación de franquiciado enviada a ${request.email}: ${registrationUrl}`);

      resolve({
        data: {
          invitation: {
            id: invitationToken,
            name: request.name,
            email: request.email,
            registrationUrl,
            invitationToken,
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
          object: 'franchisee',
          deleted: true,
          deleted_at: new Date().toISOString(),
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
        data: { franchisee, customer: franchisee },
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
        data: { franchisee, customer: franchisee },
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
        data: { franchisee, customer: franchisee },
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
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters?.offset !== undefined) params.append('offset', filters.offset.toString());
    if (filters?.take !== undefined) params.append('take', filters.take.toString());
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/admin/franchisees${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<BackendListFranchiseesResponse>(endpoint, {
      method: 'GET',
    });

    return {
      ...response,
      data: normalizeListResponse(response.data),
    };
  },

  /**
   * Get franchisee by ID
   * GET /admin/customers/:id
   */
  async getFranchisee(request: GetFranchiseeRequest): Promise<ApiResponse<GetFranchiseeResponse>> {
    if (isMockMode) {
      return mockGetFranchisee(request.id);
    }

    const response = await apiRequest<BackendSingleFranchiseeResponse>(`/admin/franchisees/${request.id}`, {
      method: 'GET',
    });

    const franchisee = normalizeFranchisee(response.data.franchisee);

    return {
      ...response,
      data: toLegacySingleResponse(franchisee),
    };
  },

  /**
   * Create franchisee
   * POST /admin/customers
   */
  async createFranchisee(request: CreateFranchiseeRequest): Promise<ApiResponse<CreateFranchiseeResponse>> {
    if (isMockMode) {
      return mockCreateFranchisee(request);
    }

    const response = await apiRequest<BackendSingleFranchiseeResponse>('/admin/franchisees', {
      method: 'POST',
      body: JSON.stringify(mapCreateRequest(request)),
    });

    const franchisee = normalizeFranchisee(response.data.franchisee);

    return {
      ...response,
      data: {
        franchisee,
        customer: franchisee,
      },
    };
  },

  /**
   * Update franchisee
   * POST /admin/customers/:id
   */
  async updateFranchisee(id: string, request: UpdateFranchiseeRequest): Promise<ApiResponse<UpdateFranchiseeResponse>> {
    if (isMockMode) {
      return mockUpdateFranchisee(id, request);
    }

    const response = await apiRequest<BackendSingleFranchiseeResponse>(`/admin/franchisees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapUpdateRequest(request)),
    });

    const franchisee = normalizeFranchisee(response.data.franchisee);

    return {
      ...response,
      data: {
        franchisee,
        customer: franchisee,
      },
    };
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
   * POST /admin/franchisees/invitations
   */
  async inviteFranchisee(request: InviteFranchiseeRequest): Promise<ApiResponse<InviteFranchiseeResponse>> {
    if (isMockInviteMode) {
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

    return apiRequest<DeleteFranchiseeResponse>(`/admin/franchisees/${id}`, {
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

    return apiRequest<GetFranchiseeStatsResponse>(`/admin/franchisees/${franchiseeId}/stats`, {
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

    throw new Error('Bulk update no está definido en el contrato canónico de /admin/franchisees.');
  },
};

/**
 * Export for use in components
 */
export default franchiseesApi;
