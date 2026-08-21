'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle, Database, Cloud, Settings, Code } from 'lucide-react';
import { featureFlags } from '@/config/feature-flags';
import { useAuthStore } from '@/lib/store/auth';

interface EndpointInfo {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  module: string;
  description: string;
  usesRealAPI: boolean;
  status: 'working' | 'broken' | 'untested';
  requiresAuth: boolean;
  medusaEndpoint?: string;
}

export default function DevToolsPage() {
  const { user, token } = useAuthStore();
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    // Definir todos los endpoints de Medusa que usa la aplicación
    const allEndpoints: EndpointInfo[] = [
      // Auth Module
      {
        path: '/api/auth/login',
        method: 'POST',
        module: 'auth',
        description: 'Login de admin/franchisee',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/auth/user/emailpass'
      },
      {
        path: '/api/auth/login (vendor)',
        method: 'POST',
        module: 'auth',
        description: 'Login de proveedor/supplier',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'working',
        requiresAuth: false,
        medusaEndpoint: '/auth/member/emailpass'
      },
      {
        path: '/api/auth/session',
        method: 'GET',
        module: 'auth',
        description: 'Obtener sesión actual',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/auth/session'
      },
      {
        path: '/api/auth/logout',
        method: 'DELETE',
        module: 'auth',
        description: 'Cerrar sesión',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/auth/session'
      },
      
      // Admin Module
      {
        path: '/api/admin/orders',
        method: 'GET',
        module: 'admin',
        description: 'Listar órdenes (admin)',
        usesRealAPI: false, // Temporalmente forzado a mock
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/orders'
      },
      {
        path: '/api/admin/users/me',
        method: 'GET',
        module: 'admin',
        description: 'Obtener usuario actual (admin)',
        usesRealAPI: !featureFlags.shouldUseMock('auth'),
        status: 'broken',
        requiresAuth: true,
        medusaEndpoint: '/admin/users/me'
      },
      {
        path: '/api/admin/sellers',
        method: 'GET',
        module: 'sellers',
        description: 'Listar sellers (MercurJS)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/sellers'
      },
      
      // Pricing Module (Custom)
      {
        path: '/api/admin/custom/products/pending',
        method: 'GET',
        module: 'pricing',
        description: 'Productos pendientes de tarificación',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/pending'
      },
      {
        path: '/api/admin/custom/products/:id/pricing-approval',
        method: 'PATCH',
        module: 'pricing',
        description: 'Aprobar/rechazar tarificación',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/products/:id/pricing-approval'
      },
      {
        path: '/api/admin/custom/sellers',
        method: 'GET',
        module: 'pricing',
        description: 'Listar sellers con markup info',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers'
      },
      {
        path: '/api/admin/custom/sellers/:id/markup',
        method: 'GET',
        module: 'pricing',
        description: 'Obtener markup global de seller',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup'
      },
      {
        path: '/api/admin/custom/sellers/:id/markup',
        method: 'PATCH',
        module: 'pricing',
        description: 'Actualizar markup global de seller',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup'
      },
      {
        path: '/api/admin/custom/sellers/:id/markup/history',
        method: 'GET',
        module: 'pricing',
        description: 'Historial de cambios de markup',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/admin/custom/sellers/:id/markup/history'
      },
      
      // Store Module
      {
        path: '/api/store/regions',
        method: 'GET',
        module: 'store',
        description: 'Listar regiones disponibles',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/regions'
      },
      {
        path: '/api/store/products',
        method: 'GET',
        module: 'products',
        description: 'Listar productos del catálogo',
        usesRealAPI: !featureFlags.shouldUseMock('products'),
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/products'
      },
      {
        path: '/api/store/carts',
        method: 'POST',
        module: 'store',
        description: 'Crear carrito de compra',
        usesRealAPI: true,
        status: 'untested',
        requiresAuth: false,
        medusaEndpoint: '/store/carts'
      },
      
      // Vendor Module (MercurJS)
      {
        path: '/api/vendor/sellers/me',
        method: 'GET',
        module: 'suppliers',
        description: 'Obtener seller actual (vendor)',
        usesRealAPI: !featureFlags.shouldUseMock('suppliers'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/sellers/me'
      },
      {
        path: '/api/vendor/custom/products',
        method: 'GET',
        module: 'pricing',
        description: 'Mis productos propuestos (vendor) - Fase 8',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products'
      },
      {
        path: '/api/vendor/custom/products',
        method: 'POST',
        module: 'pricing',
        description: 'Proponer nuevo producto (vendor) - Fase 8',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/products'
      },
      {
        path: '/api/vendor/custom/sellers/me/markup',
        method: 'GET',
        module: 'pricing',
        description: 'Obtener mi markup global (vendor) - Fase 8',
        usesRealAPI: !featureFlags.shouldUseMock('pricing'),
        status: 'untested',
        requiresAuth: true,
        medusaEndpoint: '/vendor/custom/sellers/me/markup'
      },
    ];

    setEndpoints(allEndpoints);
  }, []);

  const modules = ['all', 'auth', 'admin', 'pricing', 'products', 'suppliers', 'store'];
  
  const filteredEndpoints = selectedModule === 'all' 
    ? endpoints 
    : endpoints.filter(e => e.module === selectedModule);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'broken':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'untested':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      working: 'default',
      broken: 'destructive',
      untested: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const stats = {
    total: endpoints.length,
    realAPI: endpoints.filter(e => e.usesRealAPI).length,
    mock: endpoints.filter(e => !e.usesRealAPI).length,
    working: endpoints.filter(e => e.status === 'working').length,
    broken: endpoints.filter(e => e.status === 'broken').length,
    untested: endpoints.filter(e => e.status === 'untested').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dev Tools</h1>
          <p className="text-muted-foreground">
            Documentación de endpoints de Medusa API y estado de feature flags
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {process.env.NEXT_PUBLIC_API_URL || 'localhost'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Endpoints</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Medusa + MercurJS</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Real API</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.realAPI}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Cloud className="h-4 w-4" />
              <span>Conectado al backend</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Mock Data</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.mock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Code className="h-4 w-4" />
              <span>Datos simulados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-xl flex gap-2">
              <span className="text-green-600">{stats.working}</span>
              <span className="text-red-600">{stats.broken}</span>
              <span className="text-yellow-600">{stats.untested}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>Work / Broken / Test</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="credentials">Credenciales</TabsTrigger>
          <TabsTrigger value="session">Sesión Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {/* Module Filter */}
          <div className="flex gap-2">
            {modules.map((module) => (
              <Button
                key={module}
                variant={selectedModule === module ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedModule(module)}
              >
                {module}
              </Button>
            ))}
          </div>

          {/* Endpoints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoints de Medusa API</CardTitle>
              <CardDescription>
                {filteredEndpoints.length} endpoints en el módulo &quot;{selectedModule}&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEndpoints.map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        {endpoint.requiresAuth && (
                          <Badge variant="secondary" className="text-xs">
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      {endpoint.medusaEndpoint && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Medusa: {endpoint.medusaEndpoint}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {endpoint.usesRealAPI ? (
                        <Badge className="bg-green-500">
                          <Cloud className="h-3 w-3 mr-1" />
                          Real API
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500">
                          <Code className="h-3 w-3 mr-1" />
                          Mock
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(endpoint.status)}
                        {getStatusBadge(endpoint.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags Configuration</CardTitle>
              <CardDescription>
                Estado actual de los módulos de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(featureFlags.modules).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold capitalize">{key}</h3>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          Backend: {config.backendReady ? '✅ Ready' : '⏳ Pending'}
                        </Badge>
                        <Badge variant="outline">
                          MOCK: {featureFlags.shouldUseMock(key as any) ? '✅ Enabled' : '❌ Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      {featureFlags.shouldUseMock(key as any) ? (
                        <Badge className="bg-blue-500">Mock Data</Badge>
                      ) : (
                        <Badge className="bg-green-500">Real API</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Variables de entorno NEXT_PUBLIC_*
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">API_URL:</span>
                  <span>{process.env.NEXT_PUBLIC_API_URL || 'Not set'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_AUTH:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_AUTH || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_PRICING:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_PRICING || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_PRODUCTS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_PRODUCTS || 'false'}</span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">MOCK_OPENINGS:</span>
                  <span>{process.env.NEXT_PUBLIC_MOCK_OPENINGS || 'false'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credenciales de Prueba (DEV)</CardTitle>
              <CardDescription>
                Usuarios de prueba para testing en desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Admin</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-blue-600">admin@carrefour.dev</span></div>
                    <div>Password: <span className="text-blue-600">supersecret</span></div>
                    <div>Role: <Badge>admin</Badge></div>
                    <div>Dashboard: <code>/admin/dashboard</code></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Franchisee</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-green-600">franchisee@carrefour.dev</span></div>
                    <div>Password: <span className="text-green-600">supersecret</span></div>
                    <div>Role: <Badge variant="secondary">franchisee</Badge></div>
                    <div>Dashboard: <code>/marketplace/dashboard</code></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Supplier (Seller)</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div>Email: <span className="text-purple-600">seller@mercur.dev</span></div>
                    <div>Password: <span className="text-purple-600">DevSeller123!</span></div>
                    <div>Role: <Badge variant="outline">supplier</Badge></div>
                    <div>Seller ID: <code>sel_01M0A89ET1F5NBDER95X09ZPES</code></div>
                    <div>Dashboard: <code>/supplier/dashboard</code></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sesión Actual</CardTitle>
              <CardDescription>
                Información de autenticación del usuario actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user ? (
                  <>
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Autenticado</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-mono">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          <Badge>{user.role}</Badge>
                        </div>
                        {user.name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">JWT Token</h3>
                      <div className="bg-muted p-3 rounded font-mono text-xs break-all">
                        {token ? (
                          <>{token.substring(0, 50)}...{token.substring(token.length - 20)}</>
                        ) : (
                          <span className="text-muted-foreground">No token</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">LocalStorage</h3>
                      <div className="bg-muted p-3 rounded font-mono text-xs">
                        <pre className="overflow-auto">
                          {JSON.stringify(
                            JSON.parse(localStorage.getItem('auth-storage') || '{}'),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold">No autenticado</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Por favor, inicia sesión para ver la información de la sesión.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
