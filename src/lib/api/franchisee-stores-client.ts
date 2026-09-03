/**
 * Franchisee Stores API Client
 *
 * A franchisee can own several physical stores. There is no backend endpoint
 * for this yet, so this is mock-only, persisted in localStorage (same pattern
 * already used by the profile page itself).
 *
 * Proposed backend endpoints (not built yet):
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

function storageKey(franchiseeId: string): string {
  return `franchisee-stores-${franchiseeId}`;
}

function readStores(franchiseeId: string): FranchiseeStore[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(storageKey(franchiseeId));
  return raw ? JSON.parse(raw) : [];
}

function writeStores(franchiseeId: string, stores: FranchiseeStore[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(franchiseeId), JSON.stringify(stores));
}

export const franchiseeStoresApi = {
  /**
   * List a franchisee's stores
   * GET /franchisee/stores (mock until backend confirms this endpoint)
   */
  async listStores(franchiseeId: string): Promise<ListFranchiseeStoresResponse> {
    return { stores: readStores(franchiseeId) };
  },

  /**
   * Add a new store
   * POST /franchisee/stores (mock until backend confirms this endpoint)
   */
  async createStore(
    franchiseeId: string,
    request: CreateFranchiseeStoreRequest
  ): Promise<CreateFranchiseeStoreResponse> {
    const store: FranchiseeStore = {
      id: `store_${Date.now()}`,
      franchiseeId,
      ...request,
      createdAt: new Date().toISOString(),
    };

    const stores = [...readStores(franchiseeId), store];
    writeStores(franchiseeId, stores);

    return { store };
  },

  /**
   * Remove a store
   * DELETE /franchisee/stores/:id (mock until backend confirms this endpoint)
   */
  async deleteStore(franchiseeId: string, storeId: string): Promise<DeleteFranchiseeStoreResponse> {
    const stores = readStores(franchiseeId).filter((s) => s.id !== storeId);
    writeStores(franchiseeId, stores);

    return { id: storeId, deleted: true };
  },
};

export default franchiseeStoresApi;
