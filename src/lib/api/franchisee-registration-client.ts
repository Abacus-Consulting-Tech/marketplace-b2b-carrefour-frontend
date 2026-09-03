/**
 * Franchisee Self-Registration API Client
 *
 * Public endpoint for a franchisee to submit their own registration
 * (personal, company and financial data). Mirrors the dual mock/real
 * pattern used in src/lib/api/franchisees-client.ts.
 *
 * Proposed backend endpoint (not built yet):
 *   POST /franchisee/register -> creates the franchisee with status: pending_approval
 *
 * See docs/modules/12-franchisee-management/FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md
 * for the full flow and open questions with backend.
 */

import type {
  Franchisee,
  RegisterFranchiseeRequest,
  RegisterFranchiseeResponse,
} from '@/types/franchisees';
import { featureFlags } from '@/config/feature-flags';
import { isFranchiseeBillingEnabled } from '@/lib/config/franchisee-billing';
import { shouldUseMockFranchiseeRegistration } from '@/lib/config/franchisee-onboarding';
import {
  initializeMockFranchiseesStorage,
  mockFranchisees,
  persistMockFranchisees,
} from './franchisees-mock';

// The real endpoint (POST /franchisee/register) isn't built/agreed with backend yet
// (see the "Open questions" section of FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md).
// Flip this to true once backend confirms the contract — the shared 'franchisees'
// feature flag isn't reused here on purpose, since this endpoint doesn't exist at all.
const BACKEND_ENDPOINT_READY = false;
const isMockMode = shouldUseMockFranchiseeRegistration;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const billingEnabled = isFranchiseeBillingEnabled;

if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Franchisee Registration API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`
  );
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

/**
 * Mock: register a new franchisee (self-service)
 *
 * Simulates waiting for the payment to be confirmed after the Stripe
 * PaymentMethod was created client-side (see PaymentForm.tsx). The new
 * franchisee is pushed into the shared mock store so it immediately shows
 * up in the admin franchisee list/detail, pending approval.
 */
function mockRegisterFranchisee(
  request: RegisterFranchiseeRequest
): Promise<RegisterFranchiseeResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!request.invitationToken.trim()) {
        reject(new Error('Invitación inválida o caducada. Solicita un nuevo enlace de alta.'));
        return;
      }

      if (request.password.trim().length < 8) {
        reject(new Error('La contraseña debe tener al menos 8 caracteres.'));
        return;
      }

      if (!billingEnabled && request.stripePaymentMethodId) {
        reject(new Error('Billing deshabilitado: reintenta el alta sin método de pago.'));
        return;
      }

      if (billingEnabled && !request.stripePaymentMethodId) {
        reject(new Error('Se requiere un método de pago para completar el alta.'));
        return;
      }

      initializeMockFranchiseesStorage();
      const now = new Date();

      const franchisee: Franchisee = {
        id: `fran_${now.getTime()}`,
        email: request.email,
        first_name: request.firstName,
        last_name: request.lastName,
        phone: request.phone,
        has_account: false,
        metadata: {
          company_name: request.companyName,
          tax_id: request.taxId,
          city: request.municipality,
          country: request.country,
          status: 'pending_approval',
          subscription_status: billingEnabled ? 'pending' : undefined,
          stripe_customer_id: billingEnabled ? `cus_mock_${now.getTime()}` : undefined,
          stripe_subscription_id: billingEnabled ? `sub_mock_${now.getTime()}` : undefined,
          onboarding_status: 'pending_approval',
          is_active: false,
          notes: billingEnabled
            ? `Alta autoservicio con Stripe pendiente de confirmación · PaymentMethod: ${request.stripePaymentMethodId}`
            : 'Alta autoservicio sin billing activo',
        },
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      mockFranchisees.push(franchisee);
      persistMockFranchisees();

      resolve({
        franchisee,
        billing: billingEnabled
          ? { client_secret: `pi_mock_${now.getTime()}_secret_mock` }
          : undefined,
      });
    }, 1200);
  });
}

function syncFranchiseeIntoMockStore(franchisee: Franchisee) {
  if (!featureFlags.shouldUseMock('franchisees')) {
    return;
  }

  initializeMockFranchiseesStorage();

  const existingIndex = mockFranchisees.findIndex(
    (item) => item.id === franchisee.id || item.email === franchisee.email
  );

  if (existingIndex >= 0) {
    mockFranchisees[existingIndex] = franchisee;
  } else {
    mockFranchisees.unshift(franchisee);
  }

  persistMockFranchisees();
}

export const franchiseeRegistrationApi = {
  /**
   * Submit a new franchisee self-registration
   * POST /franchisee/register (mock until backend confirms this endpoint)
   */
  async register(request: RegisterFranchiseeRequest): Promise<RegisterFranchiseeResponse> {
    if (isMockMode) {
      return mockRegisterFranchisee(request);
    }

    const response = await apiRequest<RegisterFranchiseeResponse>('/franchisee/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    syncFranchiseeIntoMockStore(response.franchisee);

    return response;
  },
};

export default franchiseeRegistrationApi;
