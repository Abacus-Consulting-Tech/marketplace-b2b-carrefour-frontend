'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Search, Filter, UserPlus, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminFranchiseesPage() {
  // Mock data for preview
  const mockFranchisees = [
    { id: '1', name: 'Juan Pérez', store: 'Carrefour Centro', city: 'Madrid', orders: 45, status: 'active' },
    { id: '2', name: 'María García', store: 'Carrefour Norte', city: 'Barcelona', orders: 32, status: 'active' },
    { id: '3', name: 'Carlos López', store: 'Carrefour Sur', city: 'Valencia', orders: 28, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Franquiciados</h1>
          <p className="text-gray-600 mt-1">
            Administración de franquiciados y sus tiendas
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Franquiciado
        </Button>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Store className="h-5 w-5" />
            Funcionalidad en Desarrollo
          </CardTitle>
          <CardDescription className="text-blue-700">
            El módulo completo de gestión de franquiciados incluirá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Alta y gestión de franquiciados
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Asignación de tiendas y ubicaciones
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Historial de pedidos por franquiciado
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Estadísticas de rendimiento
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Gestión de permisos y accesos
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, tienda, ciudad..."
            className="pl-10"
            disabled
          />
        </div>
        <Button variant="outline" disabled>
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Franchisees Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Franquiciados Activos (Vista Previa)</CardTitle>
          <CardDescription>
            Muestra de franquiciados - La tabla completa incluirá más detalles y funciones de gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockFranchisees.map((franchisee) => (
              <div
                key={franchisee.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded">
                    <Store className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{franchisee.name}</p>
                    <p className="text-xs text-gray-500">
                      {franchisee.store}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {franchisee.city}
                  </div>
                  <div className="text-xs text-gray-500">
                    {franchisee.orders} pedidos
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                  <Button size="sm" variant="ghost" disabled>
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500 mt-1">Total Franquiciados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Total Tiendas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Nuevos Este Mes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-center pt-4">
        <Link href="/admin/dashboard">
          <Button variant="outline">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
