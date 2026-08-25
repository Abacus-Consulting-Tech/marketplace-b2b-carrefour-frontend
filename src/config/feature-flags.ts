/**
 * Feature Flags Configuration
 * 
 * Controls which modules use mock data vs real API calls.
 * 
 * Usage:
 * - Update `backendReady` when backend team confirms API is ready
 * - Flip `useMock` to false to switch to real API
 * - Use environment variables to override defaults
 * 
 * @example
 * // In your API client:
 * import { featureFlags } from '@/config/feature-flags';
 * 
 * const isMockMode = featureFlags.shouldUseMock('pricing');
 * if (isMockMode) {
 *   return mockData;
 * }
 * // ... real API call
 */

export interface ModuleConfig {
  /** Should this module use mock data? */
  useMock: boolean;
  /** Is the backend API ready for this module? */
  backendReady: boolean;
  /** Base URL for this module's API endpoints */
  apiBaseUrl?: string;
  /** Development notes about this module's status */
  notes?: string;
  /** Last updated timestamp */
  lastUpdated?: string;
}

type ModuleName = 'auth' | 'pricing' | 'openings' | 'products' | 'suppliers' | 'categories' | 'quotes' | 'orders' | 'franchisees' | 'catalog' | 'checkout';

export const featureFlags = {
  /**
   * Module configurations
   * 
   * Each module can be independently configured to use mock or real data.
   * Environment variables take precedence over default values.
   */
  modules: {
    auth: {
      useMock: process.env.NEXT_PUBLIC_MOCK_AUTH === 'true',
      backendReady: true, // ✅ Medusa backend live
      apiBaseUrl: '/api/auth',
      notes: 'Medusa auth integrated - POST /auth/user/emailpass, GET /auth/session, DELETE /auth/session',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,
    
    pricing: {
      useMock: process.env.NEXT_PUBLIC_MOCK_PRICING !== 'false', // Default to true
      backendReady: false,
      apiBaseUrl: '/api/products/pricing',
      notes: 'UI complete, backend API in progress',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,
    
    openings: {
      useMock: true, // Always mock for now
      backendReady: false,
      apiBaseUrl: '/api/openings',
      notes: 'Mock data ready, backend not started yet',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,
    
    products: {
      useMock: process.env.NEXT_PUBLIC_MOCK_PRODUCTS !== 'false', // Use env var, default to mock
      backendReady: false,
      apiBaseUrl: '/api/products',
      notes: 'Using mock mode until backend is ready',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,

    suppliers: {
      useMock: true,
      backendReady: false,
      apiBaseUrl: '/api/suppliers',
      notes: 'Planned for next sprint',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,

    categories: {
      useMock: true,
      backendReady: false,
      apiBaseUrl: '/api/categories',
      notes: 'Planned for next sprint',
      lastUpdated: '2026-08-21',
    } satisfies ModuleConfig,

    quotes: {
      useMock: true,
      backendReady: false,
      apiBaseUrl: '/api/quotes',
      notes: 'Quotes module for opening projects - UI complete with mock data, aligned with Medusa + Mercur framework, backend pending',
      lastUpdated: '2026-08-25',
    } satisfies ModuleConfig,

    orders: {
      useMock: true,
      backendReady: false,
      apiBaseUrl: '/api/supplier/orders',
      notes: 'Order management - Supplier orders (receive) and Franchisee orders (my orders) - UI ready with mock data, backend pending',
      lastUpdated: '2026-08-25',
    } satisfies ModuleConfig,

    franchisees: {
      useMock: true,
      backendReady: false,
      apiBaseUrl: '/api/admin/customers',
      notes: 'Franchisee management (Medusa Customers) - Full CRUD with mock data',
      lastUpdated: '2026-08-24',
    } satisfies ModuleConfig,

    catalog: {
      useMock: process.env.NEXT_PUBLIC_MOCK_CATALOG !== 'false', // Default to mock
      backendReady: false,
      apiBaseUrl: '/store/products',
      notes: 'Franchisee marketplace catalog - Uses Product Management mock data, aligned with Medusa Store API',
      lastUpdated: '2026-08-24',
    } satisfies ModuleConfig,

    checkout: {
      useMock: process.env.NEXT_PUBLIC_MOCK_CHECKOUT !== 'false', // Default to mock
      backendReady: false,
      apiBaseUrl: '/store',
      notes: 'Checkout and order creation - Mock mode until payment provider is configured',
      lastUpdated: '2026-08-25',
    } satisfies ModuleConfig,
  } as const,
  
  /**
   * Check if a module should use mock data
   * 
   * @param module - The module name to check
   * @returns true if module should use mock data, false for real API
   * 
   * @example
   * const useMock = featureFlags.shouldUseMock('pricing');
   * if (useMock) {
   *   return mockProposeProduct(data);
   * }
   */
  shouldUseMock(module: ModuleName): boolean {
    const config = this.modules[module];
    if (!config) {
      console.warn(`⚠️ Module '${module}' not configured in feature flags. Defaulting to mock mode.`);
      return true;
    }
    return config.useMock;
  },
  
  /**
   * Check if backend API is ready for a module
   * 
   * @param module - The module name to check
   * @returns true if backend is ready, false otherwise
   * 
   * @example
   * if (featureFlags.isBackendReady('pricing')) {
   *   console.log('Backend API is ready for testing');
   * }
   */
  isBackendReady(module: ModuleName): boolean {
    const config = this.modules[module];
    return config?.backendReady ?? false;
  },
  
  /**
   * Get the API base URL for a module
   * 
   * @param module - The module name
   * @returns The base URL or undefined if not configured
   * 
   * @example
   * const baseUrl = featureFlags.getApiBaseUrl('pricing');
   * fetch(`${baseUrl}/propose`, { method: 'POST', ... });
   */
  getApiBaseUrl(module: ModuleName): string | undefined {
    return this.modules[module]?.apiBaseUrl;
  },
  
  /**
   * Get module configuration
   * 
   * @param module - The module name
   * @returns The module configuration or undefined
   */
  getModuleConfig(module: ModuleName): ModuleConfig | undefined {
    return this.modules[module];
  },
  
  /**
   * Get status summary for all modules
   * Useful for dev tools dashboard
   * 
   * @returns Array of module status objects
   * 
   * @example
   * const status = featureFlags.getStatus();
   * status.forEach(s => console.log(`${s.module}: ${s.mode}`));
   */
  getStatus() {
    return Object.entries(this.modules).map(([name, config]) => ({
      module: name,
      mode: config.useMock ? 'Mock' : 'Real API',
      backendReady: config.backendReady ? 'Yes' : 'No',
      apiBaseUrl: config.apiBaseUrl || '-',
      notes: config.notes || '-',
      lastUpdated: config.lastUpdated || '-',
    }));
  },
  
  /**
   * Log current module status to console
   * Useful for debugging
   */
  logStatus() {
    console.group('🎛️ Feature Flags Status');
    this.getStatus().forEach(({ module, mode, backendReady, notes }) => {
      const icon = mode === 'Mock' ? '🎭' : '🌐';
      const readyIcon = backendReady === 'Yes' ? '✅' : '⏳';
      console.log(`${icon} ${module.padEnd(12)} | ${mode.padEnd(10)} | Backend: ${readyIcon} ${backendReady.padEnd(3)} | ${notes}`);
    });
    console.groupEnd();
  },

  /**
   * Get checkout source (mock or real)
   * Used by checkout-client.ts
   */
  getCheckoutSource(): 'mock' | 'real' {
    return this.shouldUseMock('checkout') ? 'mock' : 'real';
  },
};

// Log status in development mode
if (process.env.NODE_ENV === 'development') {
  featureFlags.logStatus();
}
