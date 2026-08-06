'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Package, ShoppingCart, Users, Settings, TrendingUp } from 'lucide-react';

const ADMIN_SECTIONS = [
  {
    title: 'Gestión de Proveedores',
    description: 'Aprobar, rechazar y gestionar proveedores del marketplace',
    icon: Building2,
    href: '/admin/suppliers',
    color: 'bg-blue-500',
    stats: 'Pendientes de aprobar: 1',
  },
  {
    title: 'Productos',
    description: 'Administrar el catálogo de productos',
    icon: Package,
    href: '/admin/products',
    color: 'bg-green-500',
    stats: 'Total: 62 productos',
    disabled: true,
  },
  {
    title: 'Pedidos',
    description: 'Supervisar todos los pedidos del marketplace',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'bg-purple-500',
    stats: 'Activos: 245',
    disabled: true,
  },
  {
    title: 'Franquiciados',
    description: 'Gestionar franquiciados y sus tiendas',
    icon: Users,
    href: '/admin/franchisees',
    color: 'bg-orange-500',
    stats: 'Registrados: 28',
    disabled: true,
  },
  {
    title: 'Reportes',
    description: 'Analíticas y estadísticas del marketplace',
    icon: TrendingUp,
    href: '/admin/reports',
    color: 'bg-pink-500',
    stats: 'Ver dashboard',
    disabled: true,
  },
  {
    title: 'Configuración',
    description: 'Ajustes generales del sistema',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500',
    stats: 'Sistema',
    disabled: true,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-1">
          Gestiona todos los aspectos del Marketplace B2B Carrefour
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proveedores</p>
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-yellow-600 mt-1">1 pendiente</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos</p>
                <p className="text-2xl font-bold">62</p>
                <p className="text-xs text-green-600 mt-1">+8 esta semana</p>
              </div>
              <Package className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold">245</p>
                <p className="text-xs text-purple-600 mt-1">€45,230 total</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Franquiciados</p>
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-orange-600 mt-1">89 tiendas</p>
              </div>
              <Users className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADMIN_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.href}
              className={`hover:shadow-lg transition-shadow ${
                section.disabled ? 'opacity-60' : 'cursor-pointer'
              }`}
              onClick={() => !section.disabled && router.push(section.href)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`${section.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {section.disabled && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Próximamente
                    </span>
                  )}
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{section.stats}</span>
                  {!section.disabled && (
                    <Button variant="ghost" size="sm">
                      Acceder →
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Tareas pendientes y notificaciones importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Building2 className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">1 proveedor pendiente de aprobación</p>
                  <p className="text-sm text-gray-600">Fresh Produce Andalucía requiere revisión</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/suppliers?status=pending')}
              >
                Revisar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 p-2 rounded-full">
                  <Package className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-600">No hay productos pendientes</p>
                  <p className="text-sm text-gray-500">Todos los productos están aprobados</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
