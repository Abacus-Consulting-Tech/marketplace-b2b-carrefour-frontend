/**
 * Franchisee Stores API Client
 *
 * Canonical self-service contract:
 *   GET    /franchisee/stores
 *   POST   /franchisee/stores
 *   DELETE /franchisee/stores/:id
 */

import type {
  FranchiseeStore,
  CreateFranchiseeStoreRequest,
  CreateFranchiseeStoreResponse,
  ListFranchiseeStoresResponse,
  DeleteFranchiseeStoreResponse,
} from '@/types/franchisees';
import { apiRequest } from '@/lib/api/api-utils';

interface BackendListStoresResponse {
  stores: FranchiseeStore[];
  total?: number;
}

interface BackendCreateStoreResponse {
  store: FranchiseeStore;
}

function normalizeStore(store: FranchiseeStore): FranchiseeStore {
  return {
    ...store,
    createdAt: store.createdAt || new Date().toISOString(),
  };
}

export const franchiseeStoresApi = {
  /**
   * List a franchisee's stores
   * GET /franchisee/stores
   */
  async listStores(_franchiseeId: string): Promise<ListFranchiseeStoresResponse> {
    const response = await apiRequest<BackendListStoresResponse>('/franchisee/stores', {
      method: 'GET',
    });

    return {
      stores: response.stores.map(normalizeStore),
      total: response.total,
    };
  },

  /**
   * Add a new store
   * POST /franchisee/stores
   */
  async createStore(
    _franchiseeId: string,
    request: CreateFranchiseeStoreRequest
  ): Promise<CreateFranchiseeStoreResponse> {
    const response = await apiRequest<BackendCreateStoreResponse>('/franchisee/stores', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return { store: normalizeStore(response.store) };
  },

  /**
   * Remove a store
   * DELETE /franchisee/stores/:id
   */
  async deleteStore(_franchiseeId: string, storeId: string): Promise<DeleteFranchiseeStoreResponse> {
    const response = await apiRequest<DeleteFranchiseeStoreResponse>(`/franchisee/stores/${storeId}`, {
      method: 'DELETE',
    });

    return response;
  },
};

export default franchiseeStoresApi;
