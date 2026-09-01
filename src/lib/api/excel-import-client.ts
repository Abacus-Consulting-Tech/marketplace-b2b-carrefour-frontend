/**
 * Excel Import API Client
 * 
 * Bulk product import via Excel for admin and vendor users
 * Mode controlled by feature flags in @/config/feature-flags
 * 
 * Backend Integration (Render DEV):
 * - GET /admin/custom/products/import/template - Download Excel template (admin)
 * - POST /admin/custom/products/import - Upload Excel with seller_id (admin)
 * - GET /admin/custom/products/import - List import jobs (admin)
 * - GET /admin/custom/products/import/:id - Get job details (admin)
 * - GET /vendor/custom/products/import/template - Download Excel template (vendor)
 * - POST /vendor/custom/products/import - Upload Excel (vendor)
 * - GET /vendor/custom/products/import - List import jobs (vendor)
 * - GET /vendor/custom/products/import/:id - Get job details (vendor)
 * 
 * All vendor endpoints require:
 * - Authorization: Bearer {token}
 * - x-seller-id: {seller_id}
 * 
 * Job Flow:
 * 1. Download template
 * 2. Fill with products/variants
 * 3. Upload file → returns job_id with status 'queued'
 * 4. Poll job status every 1-2s until 'success' or 'failed'
 * 5. Show errors table or link to pricing approval
 */

import { featureFlags } from '@/config/feature-flags';
import {
  buildQueryString,
  getAuthToken,
  getSellerIdFromStorage,
  logApiMode,
} from './api-utils';
import type {
  ImportJob,
  UploadExcelAdminRequest,
  UploadExcelVendorRequest,
  UploadExcelResponse,
  ListImportJobsFilters,
  ListImportJobsResponse,
  GetImportJobResponse,
} from '@/types/excel-import';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com';

function getExcelImportUrl(path: string): string {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return `/backend${path}`;
  }

  return `${BACKEND_API_URL}${path}`;
}

function createExcelHeaders(options?: { isVendor?: boolean }): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options?.isVendor) {
    const sellerId = getSellerIdFromStorage();
    if (sellerId) {
      headers['x-seller-id'] = sellerId;
    }
  }

  return headers;
}

async function excelJsonRequest<T>(path: string, options?: { isVendor?: boolean }): Promise<T> {
  const response = await fetch(getExcelImportUrl(path), {
    method: 'GET',
    headers: createExcelHeaders(options),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Request failed: ${response.statusText}`);
  }

  return await response.json();
}

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Download Excel template (Admin)
 * GET /admin/custom/products/import/template
 * Returns: Excel file blob
 */
export async function downloadTemplateAdmin(): Promise<Blob> {
  logApiMode('Excel Import (Admin)', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    // Mock: return empty blob (in real UI, you'd provide a static template file)
    return new Blob([], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  const response = await fetch(getExcelImportUrl('/admin/custom/products/import/template'), {
    method: 'GET',
    headers: createExcelHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to download template: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Upload Excel file (Admin)
 * POST /admin/custom/products/import
 * Requires: seller_id + file in multipart/form-data
 */
export async function uploadExcelAdmin(request: UploadExcelAdminRequest): Promise<UploadExcelResponse> {
  logApiMode('Excel Import (Admin) - Upload', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    // Mock response
    return {
      job_id: `job_${Date.now()}`,
      status: 'queued',
      total_rows: 400,
      status_url: `/admin/custom/products/import/job_${Date.now()}`,
      message: 'Import queued (MOCK)',
    };
  }

  const formData = new FormData();
  formData.append('seller_id', request.seller_id);
  formData.append('file', request.file);

  const response = await fetch(getExcelImportUrl('/admin/custom/products/import'), {
    method: 'POST',
    headers: createExcelHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Upload failed');
  }

  return await response.json();
}

/**
 * List import jobs (Admin)
 * GET /admin/custom/products/import?seller_id=...&status=...
 */
export async function listImportJobsAdmin(filters?: ListImportJobsFilters): Promise<ListImportJobsResponse> {
  logApiMode('Excel Import (Admin) - List', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return {
      jobs: [],
      count: 0,
      limit: filters?.limit || 20,
      offset: filters?.offset || 0,
    };
  }

  const queryString = buildQueryString(filters || {});
  const data = await excelJsonRequest<ListImportJobsResponse>(`/admin/custom/products/import${queryString}`);
  return data;
}

/**
 * Get import job details (Admin)
 * GET /admin/custom/products/import/:id
 */
export async function getImportJobAdmin(jobId: string): Promise<ImportJob> {
  logApiMode('Excel Import (Admin) - Details', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return {
      id: jobId,
      seller_id: 'sel_mock',
      file_name: 'mock.xlsx',
      status: 'success',
      total_rows: 400,
      processed_rows: 400,
      errors: [],
      result: {
        created_product_ids: ['prod_01', 'prod_02'],
      },
    };
  }

  const response = await excelJsonRequest<GetImportJobResponse>(`/admin/custom/products/import/${jobId}`);
  return response.job;
}

// ============================================================================
// VENDOR ENDPOINTS
// ============================================================================

/**
 * Download Excel template (Vendor)
 * GET /vendor/custom/products/import/template
 * Requires: Authorization + x-seller-id
 */
export async function downloadTemplateVendor(): Promise<Blob> {
  logApiMode('Excel Import (Vendor)', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return new Blob([], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  const response = await fetch(getExcelImportUrl('/vendor/custom/products/import/template'), {
    method: 'GET',
    headers: createExcelHeaders({ isVendor: true }),
  });

  if (!response.ok) {
    throw new Error(`Failed to download template: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Upload Excel file (Vendor)
 * POST /vendor/custom/products/import
 * Requires: file (seller_id taken from x-seller-id header)
 */
export async function uploadExcelVendor(request: UploadExcelVendorRequest): Promise<UploadExcelResponse> {
  logApiMode('Excel Import (Vendor) - Upload', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return {
      job_id: `job_${Date.now()}`,
      status: 'queued',
      total_rows: 400,
      status_url: `/vendor/custom/products/import/job_${Date.now()}`,
      message: 'Import queued (MOCK)',
    };
  }

  const formData = new FormData();
  formData.append('file', request.file);

  const response = await fetch(getExcelImportUrl('/vendor/custom/products/import'), {
    method: 'POST',
    headers: createExcelHeaders({ isVendor: true }),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Upload failed');
  }

  return await response.json();
}

/**
 * List import jobs (Vendor)
 * GET /vendor/custom/products/import?status=...
 */
export async function listImportJobsVendor(filters?: Omit<ListImportJobsFilters, 'seller_id'>): Promise<ListImportJobsResponse> {
  logApiMode('Excel Import (Vendor) - List', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return {
      jobs: [],
      count: 0,
      limit: filters?.limit || 20,
      offset: filters?.offset || 0,
    };
  }

  const queryString = buildQueryString(filters || {});
  const data = await excelJsonRequest<ListImportJobsResponse>(`/vendor/custom/products/import${queryString}`, { isVendor: true });
  return data;
}

/**
 * Get import job details (Vendor)
 * GET /vendor/custom/products/import/:id
 */
export async function getImportJobVendor(jobId: string): Promise<ImportJob> {
  logApiMode('Excel Import (Vendor) - Details', featureFlags.shouldUseMock('pricing'));

  if (featureFlags.shouldUseMock('pricing')) {
    return {
      id: jobId,
      seller_id: 'sel_mock',
      file_name: 'mock.xlsx',
      status: 'success',
      total_rows: 400,
      processed_rows: 400,
      errors: [],
      result: {
        created_product_ids: ['prod_01', 'prod_02'],
      },
    };
  }

  const response = await excelJsonRequest<GetImportJobResponse>(`/vendor/custom/products/import/${jobId}`, { isVendor: true });
  return response.job;
}

// ============================================================================
// POLLING UTILITY
// ============================================================================

/**
 * Poll import job until completion
 * Useful for showing progress in UI
 */
export async function pollImportJob(
  jobId: string,
  isAdmin: boolean,
  onProgress?: (job: ImportJob) => void,
  intervalMs: number = 1500,
  maxAttempts: number = 120 // 3 minutes with 1.5s interval
): Promise<ImportJob> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const job = isAdmin ? await getImportJobAdmin(jobId) : await getImportJobVendor(jobId);

    if (onProgress) {
      onProgress(job);
    }

    if (job.status === 'success' || job.status === 'failed') {
      return job;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error('Import job polling timeout');
}

// ============================================================================
// EXPORT
// ============================================================================

export const excelImportApi = {
  // Admin
  downloadTemplateAdmin,
  uploadExcelAdmin,
  listImportJobsAdmin,
  getImportJobAdmin,
  
  // Vendor
  downloadTemplateVendor,
  uploadExcelVendor,
  listImportJobsVendor,
  getImportJobVendor,
  
  // Utilities
  pollImportJob,
};
