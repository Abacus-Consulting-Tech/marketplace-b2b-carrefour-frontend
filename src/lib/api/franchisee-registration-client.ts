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
const isMockMode = !BACKEND_ENDPOINT_READY;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

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
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeMockFranchiseesStorage();
      const now = new Date();
      const currentPeriodEnd = new Date(now);
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

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
          subscription_status: 'active',
          stripe_customer_id: `cus_mock_${now.getTime()}`,
          stripe_subscription_id: `sub_mock_${now.getTime()}`,
          current_period_end: currentPeriodEnd.toISOString(),
          onboarding_status: 'pending_approval',
          is_active: false,
          notes: `Alta autoservicio · IBAN: ${request.iban} · Titular: ${request.bankHolderName} · Cuota de alta pagada (Stripe payment_method: ${request.stripePaymentMethodId})`,
        },
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      mockFranchisees.push(franchisee);
      persistMockFranchisees();

      resolve({ franchisee });
    }, 1200); // Simulates waiting for the payment confirmation
  });
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

    return apiRequest<RegisterFranchiseeResponse>('/franchisee/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

export default franchiseeRegistrationApi;
