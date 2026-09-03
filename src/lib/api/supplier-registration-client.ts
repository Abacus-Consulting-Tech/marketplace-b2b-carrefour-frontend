/**
 * Supplier Self-Registration API Client
 *
 * Public endpoint for a supplier to submit their own onboarding request.
 * Mirrors the franchisee public registration flow while keeping the final
 * approved seller/member lifecycle aligned with MercurJS.
 */

import type {
  ListSuppliersResponse,
  RegisterSupplierRequest,
  RegisterSupplierResponse,
  Supplier,
  SupplierInvitation,
  UpdateSupplierStatusRequest,
} from '@/types';

const BACKEND_ENDPOINT_READY = false;
const isMockMode = !BACKEND_ENDPOINT_READY;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const SUPPLIERS_STORAGE_KEY = 'mock-suppliers-storage';
const SUPPLIER_INVITATIONS_STORAGE_KEY = 'mock-supplier-invitations-storage';

if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Supplier Registration API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`
  );
}

function buildRegistrationUrl(email: string, name: string) {
  const params = new URLSearchParams({
    invited_email: email,
    invited_name: name,
  });

  return `${window.location.origin}/supplier/register?${params.toString()}`;
}

function loadJson<T>(storageKey: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(storageKey: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function getMockSuppliers(): Supplier[] {
  return loadJson<Supplier[]>(SUPPLIERS_STORAGE_KEY, []);
}

function persistMockSuppliers(suppliers: Supplier[]) {
  saveJson(SUPPLIERS_STORAGE_KEY, suppliers);
}

function getMockInvitations(): SupplierInvitation[] {
  return loadJson<SupplierInvitation[]>(SUPPLIER_INVITATIONS_STORAGE_KEY, []);
}

function persistMockInvitations(invitations: SupplierInvitation[]) {
  saveJson(SUPPLIER_INVITATIONS_STORAGE_KEY, invitations);
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

function mockRegisterSupplier(
  request: RegisterSupplierRequest
): Promise<RegisterSupplierResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const suppliers = getMockSuppliers();

      const supplier: Supplier = {
        id: `sup_${now.getTime()}`,
        userId: `pending_member_${now.getTime()}`,
        status: 'pending',
        businessName: request.businessName,
        legalName: request.legalName,
        nifCif: request.nifCif,
        fiscalAddress: request.fiscalAddress,
        municipality: request.municipality,
        postalCode: request.postalCode,
        country: request.country,
        iban: request.iban,
        email: request.email,
        phone: request.phone,
        website: request.website,
        contactName: request.contactName,
        contactSurname: request.contactSurname,
        contactPosition: request.contactPosition,
        contactEmail: request.contactEmail,
        contactPhone: request.contactPhone,
        metadata: {
          onboarding_status: 'pending_approval',
          approval_notes: '',
          odoo_sync_status: 'pending',
          invited_name: request.businessName,
          invited_email: request.email,
        },
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      persistMockSuppliers([supplier, ...suppliers]);
      resolve({ supplier });
    }, 900);
  });
}

export const supplierRegistrationApi = {
  async register(request: RegisterSupplierRequest): Promise<RegisterSupplierResponse> {
    if (isMockMode) {
      return mockRegisterSupplier(request);
    }

    return apiRequest<RegisterSupplierResponse>('/supplier/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async inviteSupplier(name: string, email: string) {
    if (!isMockMode) {
      return apiRequest<{ invitation: SupplierInvitation }>('/admin/suppliers/invitations', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
      });
    }

    const now = new Date();
    const invitation: SupplierInvitation = {
      id: `sup_inv_${now.getTime()}`,
      name,
      email,
      registrationUrl: buildRegistrationUrl(email, name),
      status: 'pending',
      createdAt: now.toISOString(),
    };

    const invitations = getMockInvitations();
    persistMockInvitations([invitation, ...invitations]);

    return { invitation };
  },

  async listSuppliers(): Promise<ListSuppliersResponse> {
    if (!isMockMode) {
      return apiRequest<ListSuppliersResponse>('/admin/suppliers');
    }

    const suppliers = getMockSuppliers();
    return {
      suppliers,
      count: suppliers.length,
    };
  },

  async updateSupplierStatus(
    supplierId: string,
    request: UpdateSupplierStatusRequest
  ): Promise<{ supplier: Supplier }> {
    if (!isMockMode) {
      return apiRequest<{ supplier: Supplier }>(`/admin/suppliers/${supplierId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(request),
      });
    }

    const suppliers = getMockSuppliers();
    const supplierIndex = suppliers.findIndex((supplier) => supplier.id === supplierId);

    if (supplierIndex === -1) {
      throw new Error('Proveedor no encontrado');
    }

    const previousSupplier = suppliers[supplierIndex];
    const now = new Date().toISOString();
    const onboardingStatus =
      request.status === 'active'
        ? 'approved_pending_credentials'
        : request.status === 'rejected'
        ? 'rejected'
        : previousSupplier.metadata?.onboarding_status || 'pending_approval';

    const updatedSupplier: Supplier = {
      ...previousSupplier,
      status: request.status,
      approvedAt: request.status === 'active' ? now : previousSupplier.approvedAt,
      rejectionReason:
        request.status === 'rejected' ? request.approvalNotes || previousSupplier.rejectionReason : undefined,
      metadata: {
        ...previousSupplier.metadata,
        onboarding_status: onboardingStatus,
        approval_notes: request.approvalNotes ?? previousSupplier.metadata?.approval_notes,
        reviewed_at: now,
        reviewed_by: 'admin_mock',
        credentials_sent_at:
          request.status === 'active' ? previousSupplier.metadata?.credentials_sent_at || undefined : previousSupplier.metadata?.credentials_sent_at,
      },
      updatedAt: now,
    };

    suppliers[supplierIndex] = updatedSupplier;
    persistMockSuppliers(suppliers);

    return { supplier: updatedSupplier };
  },
};

export default supplierRegistrationApi;