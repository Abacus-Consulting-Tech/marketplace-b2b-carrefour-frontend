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

function getMockFlag(envVarName: string, defaultValue = false): boolean {
  const envValue = process.env[envVarName];

  if (envValue === 'true') {
    return true;
  }

  if (envValue === 'false') {
    return false;
  }

  return defaultValue;
}

export const featureFlags = {
  /**
   * Module configurations
   * 
   * Each module can be independently configured to use mock or real data.
   * Environment variables take precedence over default values.
   */
  modules: {
    auth: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_AUTH'),
      backendReady: true, // ✅ Medusa backend live
      apiBaseUrl: '/api/auth',
      notes: 'Auth proxy aligned with /auth/login and legacy fallback endpoints for DEV backend compatibility',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,
    
    pricing: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_PRICING'),
      backendReady: true, // ✅ Render DEV validated 2026-08-24
      apiBaseUrl: '/admin/custom',
      notes: 'Pricing API validated - admin custom pricing routes plus seller catalog product proposal flow',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,
    
    openings: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_OPENINGS'),
      backendReady: false,
      apiBaseUrl: '/api/openings',
      notes: 'Openings client can target backend routes when enabled; DEV readiness still depends on backend availability',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,
    
    products: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_PRODUCTS'),
      backendReady: true,
      apiBaseUrl: '/api/products',
      notes: 'Admin catalog products and marketplace store products aligned to backend routes',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    suppliers: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_SUPPLIERS'),
      backendReady: true, // ✅ Render DEV validated 2026-08-24
      apiBaseUrl: '/admin',
      notes: 'Sellers API validated - GET /admin/sellers, GET /admin/custom/sellers, GET /vendor/sellers/me',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    categories: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_CATEGORIES'),
      backendReady: false,
      apiBaseUrl: '/api/categories',
      notes: 'Categories remain configurable by env even though no dedicated validated backend flow is active yet',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    quotes: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_QUOTES'),
      backendReady: true, // ✅ Render DEV validated 2026-08-26
      apiBaseUrl: '/quotes',
      notes: 'Quotes API validated - store quote reads and seller responses aligned to current contract',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    orders: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_ORDERS'),
      backendReady: true, // ✅ Render DEV validated 2026-08-26
      apiBaseUrl: '/admin/orders',
      notes: 'Orders API validated - GET /admin/orders, /admin/custom/orders/stats, /franchisee/orders, /vendor/orders (all integrated)',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    franchisees: {
      // Defaults to mock: /admin/customers has a known RBAC 401/403 issue (see
      // PROJECT_STATUS_AND_ROADMAP.md). apiBaseUrl intentionally left undefined —
      // franchisees-client.ts already includes the full "/admin/customers" path
      // in each call, so setting it here caused a doubled "/admin/customers/admin/customers" URL.
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_FRANCHISEES', true),
      backendReady: false,
      apiBaseUrl: undefined,
      notes: 'Franchisee management defaults to mock due to known RBAC issue on /admin/customers; override via env once backend confirms auth',
      lastUpdated: '2026-09-02',
    } satisfies ModuleConfig,

    catalog: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_CATALOG'),
      backendReady: true,
      apiBaseUrl: '/store/products',
      notes: 'Franchisee marketplace catalog aligned to store product routes',
      lastUpdated: '2026-08-31',
    } satisfies ModuleConfig,

    checkout: {
      useMock: getMockFlag('NEXT_PUBLIC_MOCK_CHECKOUT'),
      backendReady: true,
      apiBaseUrl: '/store',
      notes: 'Checkout uses the real Mercur/Medusa store flow when enabled',
      lastUpdated: '2026-08-31',
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
