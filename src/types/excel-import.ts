/**
 * Excel Import Types
 * 
 * Type definitions for bulk product import via Excel
 * Backend: POST /admin|vendor/custom/products/import
 */

export type ImportJobStatus = 'queued' | 'validating' | 'ingesting' | 'success' | 'failed';

export interface ImportJobError {
  line: number;
  column: string;
  reason: string;
  value: string;
}

export interface ImportJobResult {
  created_product_ids: string[];
}

export interface ImportJob {
  id: string;
  seller_id: string;
  file_name: string;
  status: ImportJobStatus;
  total_rows: number;
  processed_rows: number;
  errors: ImportJobError[];
  result?: ImportJobResult;
  created_at?: string;
  updated_at?: string;
}

export interface UploadExcelAdminRequest {
  seller_id: string;
  file: File;
}

export interface UploadExcelVendorRequest {
  file: File;
}

export interface UploadExcelResponse {
  job_id: string;
  status: ImportJobStatus;
  total_rows: number;
  status_url: string;
  message?: string;
}

export interface ListImportJobsFilters {
  seller_id?: string;
  status?: ImportJobStatus;
  limit?: number;
  offset?: number;
}

export interface ListImportJobsResponse {
  jobs: ImportJob[];
  count: number;
  limit: number;
  offset: number;
}

export interface GetImportJobResponse {
  job: ImportJob;
}
