'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SupplierDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Proveedor</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido a tu dashboard de proveedor
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-green-600 mt-1">+3 este mes</p>
              </div>
              <Package className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold">145</p>
                <p className="text-xs text-purple-600 mt-1">€23,450 total</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas</p>
                <p className="text-2xl font-bold">€23.4k</p>
                <p className="text-xs text-green-600 mt-1">+15% vs mes anterior</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valoración</p>
                <p className="text-2xl font-bold">4.8★</p>
                <p className="text-xs text-orange-600 mt-1">De 87 reseñas</p>
              </div>
              <CheckCircle className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Banner */}
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Cuenta Aprobada</p>
              <p className="text-sm text-green-700">
                Tu cuenta de proveedor está activa y puedes vender en el marketplace
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="bg-blue-500 p-3 rounded-lg w-fit">
              <Package className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="mt-4">Mis Productos</CardTitle>
            <CardDescription>Gestiona tu catálogo de productos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" size="sm">
              Ver Productos →
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-60">
          <CardHeader>
            <div className="bg-green-500 p-3 rounded-lg w-fit">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="mt-4">Pedidos</CardTitle>
            <CardDescription>Gestiona los pedidos recibidos</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Próximamente
            </span>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-60">
          <CardHeader>
            <div className="bg-purple-500 p-3 rounded-lg w-fit">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="mt-4">Reportes</CardTitle>
            <CardDescription>Analíticas de ventas y rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Próximamente
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>Últimos pedidos recibidos de franquiciados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #1234</p>
                  <p className="text-sm text-gray-600">Franquiciado Norte - 15 productos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€450.00</p>
                <p className="text-xs text-blue-600">Pendiente</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #1233</p>
                  <p className="text-sm text-gray-600">Franquiciado Sur - 8 productos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€280.00</p>
                <p className="text-xs text-green-600">Completado</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #1232</p>
                  <p className="text-sm text-gray-600">Franquiciado Centro - 23 productos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€890.00</p>
                <p className="text-xs text-green-600">Completado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
