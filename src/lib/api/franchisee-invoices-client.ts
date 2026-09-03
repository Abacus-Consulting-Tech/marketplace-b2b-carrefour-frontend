/**
 * Franchisee Invoices API Client
 *
 * Proposed backend endpoint (not built yet):
 *   GET /franchisee/:id/invoices
 *
 * Until backend/Odoo expose a real read endpoint, this client returns a mock
 * invoice list and allows local overrides via localStorage for demos.
 */

import type {
  FranchiseeInvoice,
  ListFranchiseeInvoicesResponse,
} from '@/types/franchisees';

function storageKey(franchiseeId: string): string {
  return `franchisee-invoices-${franchiseeId}`;
}

function seedInvoices(franchiseeId: string): FranchiseeInvoice[] {
  return [
    {
      id: `inv_${franchiseeId}_001`,
      franchiseeId,
      number: `FAC-${new Date().getFullYear()}-${franchiseeId.slice(-4).toUpperCase()}`,
      issueDate: '2026-09-02T10:00:00Z',
      amount: 299,
      currencyCode: 'EUR',
      status: 'paid',
      pdfUrl: '#',
    },
  ];
}

function readInvoices(franchiseeId: string): FranchiseeInvoice[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(storageKey(franchiseeId));
  if (!raw) {
    return seedInvoices(franchiseeId);
  }

  try {
    return JSON.parse(raw) as FranchiseeInvoice[];
  } catch {
    return seedInvoices(franchiseeId);
  }
}

export const franchiseeInvoicesApi = {
  async listInvoices(franchiseeId: string): Promise<ListFranchiseeInvoicesResponse> {
    return { invoices: readInvoices(franchiseeId) };
  },
};

export default franchiseeInvoicesApi;