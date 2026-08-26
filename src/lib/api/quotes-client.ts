/**
 * Quotes API Client - Dual Mode
 * 
 * Cliente API para quotes con soporte mock/real
 * Alineado con Medusa + Mercur framework
 */

import {
  Quote,
  QuoteStatus,
  SupplierInvitation,
  QuoteSignature,
  QuoteSearchParams,
  GetQuotesResponse,
  GetQuoteResponse,
  GetInvitationsResponse,
  GetQuoteStatsResponse,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  SubmitQuoteRequest,
  AwardQuoteRequest,
  RejectQuoteRequest,
  UpdateQuoteStatusRequest,
  SignQuoteRequest,
  DeclineInvitationRequest,
} from '@/types/quotes'

import {
  mockQuotes,
  mockInvitations,
  mockSignatures,
  getMockQuoteById,
  getMockQuotesByProject,
  getMockQuotesBySupplier,
  getMockQuotesByStatus,
  getMockInvitationById,
  getMockInvitationsBySupplier,
  getMockSignatureByQuote,
  getMockQuoteStats,
} from './quotes-mock'

import { featureFlags } from '@/config/feature-flags'

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'
const USE_MOCK = featureFlags.shouldUseMock('quotes')

// ============================================================================
// Utility Functions
// ============================================================================

function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat('es-ES').format(new Date(date))
}

function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// ============================================================================
// Mock API Functions - Franchisee
// ============================================================================

async function getMockQuotesForFranchisee(
  franchiseeId: string,
  params?: QuoteSearchParams
): Promise<GetQuotesResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = [...mockQuotes]
  
  // Filter by project (franchisee can only see their own projects)
  // En producción esto se haría en backend con JOIN a projects.franchisee_id
  if (params?.project_id) {
    filtered = filtered.filter(q => q.project_id === params.project_id)
  }
  
  if (params?.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    filtered = filtered.filter(q => statuses.includes(q.status))
  }
  
  if (params?.category_id) {
    filtered = filtered.filter(q => q.category_id === params.category_id)
  }
  
  if (params?.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(q =>
      q.project_name.toLowerCase().includes(search) ||
      q.category_name.toLowerCase().includes(search) ||
      q.supplier_name.toLowerCase().includes(search)
    )
  }
  
  // Sort
  const sortBy = params?.sort_by || 'created_at'
  const sortOrder = params?.sort_order || 'desc'
  filtered.sort((a, b) => {
    let aVal: any = a[sortBy as keyof Quote]
    let bVal: any = b[sortBy as keyof Quote]
    
    if (sortBy === 'amount') {
      aVal = a.amount || 0
      bVal = b.amount || 0
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })
  
  return {
    quotes: filtered,
    count: filtered.length,
    total: filtered.length,
  }
}

async function getMockQuoteByIdFranchisee(quoteId: string): Promise<GetQuoteResponse | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const quote = getMockQuoteById(quoteId)
  if (!quote) return null
  
  const invitation = mockInvitations.find(i => i.quote_id === quoteId)
  const signature = getMockSignatureByQuote(quoteId)
  
  return {
    quote,
    invitation,
    signature,
  }
}

async function mockAwardQuote(request: AwardQuoteRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const quote = getMockQuoteById(request.quote_id)
  if (!quote) throw new Error('Quote not found')
  const quoteIndex = mockQuotes.findIndex(q => q.id === request.quote_id)
  
  const updated: Quote = {
    ...quote,
    status: 'awarded',
    is_awarded: true,
    rejection_reason: undefined,
    rejected_at: undefined,
    internal_notes: request.internal_notes || quote.internal_notes,
    awarded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockQuotes[quoteIndex] = updated
  
  return updated
}

async function mockRejectQuote(request: RejectQuoteRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const quote = getMockQuoteById(request.quote_id)
  if (!quote) throw new Error('Quote not found')
  const quoteIndex = mockQuotes.findIndex(q => q.id === request.quote_id)
  
  const updated: Quote = {
    ...quote,
    status: 'rejected',
    is_awarded: false,
    rejection_reason: request.reason,
    awarded_at: undefined,
    rejected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockQuotes[quoteIndex] = updated
  
  return updated
}

async function mockUpdateQuoteStatus(request: UpdateQuoteStatusRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 400))

  const quoteIndex = mockQuotes.findIndex(q => q.id === request.quote_id)
  if (quoteIndex === -1) throw new Error('Quote not found')

  const quote = mockQuotes[quoteIndex]
  const now = new Date().toISOString()
  const updated: Quote = {
    ...quote,
    status: request.status,
    is_awarded: request.status === 'awarded',
    rejection_reason: request.status === 'rejected'
      ? request.reason || quote.rejection_reason || 'Cambio manual de estado'
      : undefined,
    submitted_at: request.status === 'draft' ? undefined : quote.submitted_at || now,
    awarded_at: request.status === 'awarded' ? quote.awarded_at || now : undefined,
    rejected_at: request.status === 'rejected' ? quote.rejected_at || now : undefined,
    updated_at: now,
  }

  mockQuotes[quoteIndex] = updated

  if (request.status !== 'awarded') {
    const signatureIndex = mockSignatures.findIndex(s => s.quote_id === request.quote_id)
    if (signatureIndex !== -1) {
      mockSignatures.splice(signatureIndex, 1)
    }
  }

  return updated
}

async function mockSignQuote(request: SignQuoteRequest): Promise<QuoteSignature> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Simular creación de firma
  const signature: QuoteSignature = {
    id: `sig_${Date.now()}`,
    quote_id: request.quote_id,
    franchisee_id: 'mock_franchisee',
    franchisee_name: 'Mock Franchisee',
    franchisee_email: 'franchisee@example.com',
    signed_pdf_url: `https://storage.example.com/signatures/${request.quote_id}-signed.pdf`,
    signature_hash: Math.random().toString(36).substring(2),
    signature_method: request.signature_method,
    signed_at: new Date().toISOString(),
    ip_address: '127.0.0.1',
    user_agent: navigator.userAgent,
    terms_version: request.terms_version,
    consent_text: request.consent_text,
  }

  mockSignatures.push(signature)
  
  return signature
}

// ============================================================================
// Mock API Functions - Supplier
// ============================================================================

async function getMockInvitationsForSupplier(
  supplierId: string
): Promise<GetInvitationsResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const invitations = getMockInvitationsBySupplier(supplierId)
  
  return {
    invitations,
    count: invitations.length,
    total: invitations.length,
  }
}

async function getMockQuotesForSupplier(
  supplierId: string,
  params?: QuoteSearchParams
): Promise<GetQuotesResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = getMockQuotesBySupplier(supplierId)
  
  if (params?.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    filtered = filtered.filter(q => statuses.includes(q.status))
  }
  
  if (params?.project_id) {
    filtered = filtered.filter(q => q.project_id === params.project_id)
  }
  
  return {
    quotes: filtered,
    count: filtered.length,
    total: filtered.length,
  }
}

async function mockCreateQuote(request: CreateQuoteRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newQuote: Quote = {
    id: `quote_${Date.now()}`,
    ...request,
    items: request.items?.map((item, index) => ({
      ...item,
      id: `item_${Date.now()}_${index}`,
      quote_id: `quote_${Date.now()}`,
    })),
    supplier_id: 'mock_supplier',
    supplier_name: 'Mock Supplier',
    supplier_email: 'supplier@example.com',
    project_name: 'Mock Project',
    project_code: 'MOCK-001',
    category_name: 'Mock Category',
    currency: request.currency || 'EUR',
    status: 'draft',
    is_awarded: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  return newQuote
}

async function mockUpdateQuote(quoteId: string, request: UpdateQuoteRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const quote = getMockQuoteById(quoteId)
  if (!quote) throw new Error('Quote not found')
  
  const updated: Quote = {
    ...quote,
    ...request,
    items: request.items?.map((item, index) => ({
      ...item,
      id: `item_${quoteId}_${index}`,
      quote_id: quoteId,
    })) || quote.items,
    updated_at: new Date().toISOString(),
  }
  
  return updated
}

async function mockSubmitQuote(request: SubmitQuoteRequest): Promise<Quote> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const quote = getMockQuoteById(request.quote_id)
  if (!quote) throw new Error('Quote not found')
  
  const updated: Quote = {
    ...quote,
    pdf_url: request.pdf_url || quote.pdf_url,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
  }
  
  return updated
}

async function mockDeclineInvitation(request: DeclineInvitationRequest): Promise<SupplierInvitation> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const invitation = getMockInvitationById(request.invitation_id)
  if (!invitation) throw new Error('Invitation not found')
  
  const updated: SupplierInvitation = {
    ...invitation,
    status: 'declined',
    responded_at: new Date().toISOString(),
  }
  
  return updated
}

// ============================================================================
// Mock API Functions - Admin/Stats
// ============================================================================

async function getMockAllQuotes(params?: QuoteSearchParams): Promise<GetQuotesResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = [...mockQuotes]
  
  if (params?.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status]
    filtered = filtered.filter(q => statuses.includes(q.status))
  }
  
  if (params?.project_id) {
    filtered = filtered.filter(q => q.project_id === params.project_id)
  }
  
  if (params?.supplier_id) {
    filtered = filtered.filter(q => q.supplier_id === params.supplier_id)
  }
  
  return {
    quotes: filtered,
    count: filtered.length,
    total: filtered.length,
  }
}

async function getMockQuoteStatsAPI(): Promise<GetQuoteStatsResponse> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return getMockQuoteStats()
}

// ============================================================================
// Real API Functions - To be implemented
// ============================================================================

async function getRealQuotesForFranchisee(
  franchiseeId: string,
  params?: QuoteSearchParams
): Promise<GetQuotesResponse> {
  const response = await fetch(`${API_BASE_URL}/store/quotes?${new URLSearchParams(params as any)}`)
  if (!response.ok) throw new Error('Failed to fetch quotes')
  return response.json()
}

async function getRealQuotesForSupplier(
  supplierId: string,
  params?: QuoteSearchParams
): Promise<GetQuotesResponse> {
  const response = await fetch(`${API_BASE_URL}/seller/quotes?${new URLSearchParams(params as any)}`)
  if (!response.ok) throw new Error('Failed to fetch quotes')
  return response.json()
}

async function getRealAllQuotes(params?: QuoteSearchParams): Promise<GetQuotesResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/quotes?${new URLSearchParams(params as any)}`)
  if (!response.ok) throw new Error('Failed to fetch quotes')
  return response.json()
}

// ... other real API functions

// ============================================================================
// Exported API - Auto-switching based on feature flags
// ============================================================================

export const quotesApi = {
  // Franchisee endpoints
  getQuotesForFranchisee: USE_MOCK ? getMockQuotesForFranchisee : getRealQuotesForFranchisee,
  getQuoteById: USE_MOCK ? getMockQuoteByIdFranchisee : async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/store/quotes/${id}`)
    if (!response.ok) return null
    return response.json()
  },
  awardQuote: USE_MOCK ? mockAwardQuote : async (request: AwardQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/store/quotes/${request.quote_id}/award`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to award quote')
    return response.json()
  },
  rejectQuote: USE_MOCK ? mockRejectQuote : async (request: RejectQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/store/quotes/${request.quote_id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to reject quote')
    return response.json()
  },
  updateQuoteStatus: USE_MOCK ? mockUpdateQuoteStatus : async (request: UpdateQuoteStatusRequest) => {
    const response = await fetch(`${API_BASE_URL}/store/quotes/${request.quote_id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to update quote status')
    return response.json()
  },
  signQuote: USE_MOCK ? mockSignQuote : async (request: SignQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/store/quotes/${request.quote_id}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to sign quote')
    return response.json()
  },
  
  // Supplier endpoints
  getInvitationsForSupplier: USE_MOCK ? getMockInvitationsForSupplier : async (supplierId: string) => {
    const response = await fetch(`${API_BASE_URL}/seller/invitations`)
    if (!response.ok) throw new Error('Failed to fetch invitations')
    return response.json()
  },
  getQuotesForSupplier: USE_MOCK ? getMockQuotesForSupplier : getRealQuotesForSupplier,
  createQuote: USE_MOCK ? mockCreateQuote : async (request: CreateQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/seller/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to create quote')
    return response.json()
  },
  updateQuote: USE_MOCK ? mockUpdateQuote : async (quoteId: string, request: UpdateQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/seller/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to update quote')
    return response.json()
  },
  submitQuote: USE_MOCK ? mockSubmitQuote : async (request: SubmitQuoteRequest) => {
    const response = await fetch(`${API_BASE_URL}/seller/quotes/${request.quote_id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to submit quote')
    return response.json()
  },
  declineInvitation: USE_MOCK ? mockDeclineInvitation : async (request: DeclineInvitationRequest) => {
    const response = await fetch(`${API_BASE_URL}/seller/invitations/${request.invitation_id}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error('Failed to decline invitation')
    return response.json()
  },
  
  // Admin endpoints
  getAllQuotes: USE_MOCK ? getMockAllQuotes : getRealAllQuotes,
  getQuoteStats: USE_MOCK ? getMockQuoteStatsAPI : async () => {
    const response = await fetch(`${API_BASE_URL}/admin/quotes/stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },
  
  // Utility exports
  formatPrice,
  formatDate,
  formatShortDate,
  isExpired,
}
