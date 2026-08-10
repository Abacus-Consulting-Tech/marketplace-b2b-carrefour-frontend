'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminOrdersPage() {
  // Mock data for preview
  const mockOrders = [
    { id: '1', orderNumber: 'CF-10001', franchisee: 'Tienda Centro', date: '2026-08-10', total: 456.89, status: 'delivered' },
    { id: '2', orderNumber: 'CF-10002', franchisee: 'Tienda Norte', date: '2026-08-09', total: 789.50, status: 'shipped' },
    { id: '3', orderNumber: 'CF-10003', franchisee: 'Tienda Sur', date: '2026-08-08', total: 234.00, status: 'pending' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">
            Vista completa de todos los pedidos de la plataforma
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Package className="h-5 w-5" />
            Funcionalidad en Desarrollo
          </CardTitle>
          <CardDescription className="text-blue-700">
            La gestión completa de pedidos estará disponible próximamente. Incluirá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Filtros avanzados por estado, franquiciado, proveedor y fechas
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Exportación de pedidos a CSV/Excel
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Vista detallada con trazabilidad completa
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Gestión de estados y resolución de incidencias
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Análisis y reportes de pedidos
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por número de pedido, franquiciado..."
            className="pl-10"
            disabled
          />
        </div>
        <Button variant="outline" disabled>
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Orders Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes (Vista Previa)</CardTitle>
          <CardDescription>
            Muestra de pedidos - La tabla completa incluirá paginación y más filtros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {order.franchisee} • {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status as keyof typeof statusColors]}
                  >
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                  <p className="font-semibold text-gray-900 min-w-[100px] text-right">
                    {order.total.toFixed(2)} €
                  </p>
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
              <p className="text-xs text-gray-500 mt-1">Total Pedidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">-</p>
              <p className="text-xs text-gray-500 mt-1">En Tránsito</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Entregados</p>
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
