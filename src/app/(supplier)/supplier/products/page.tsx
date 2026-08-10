'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SupplierProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Producto
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Gestión de Productos - Próximamente</CardTitle>
              <CardDescription className="text-blue-700">
                Esta funcionalidad estará disponible en la próxima versión
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-blue-800">
              Aquí podrás:
            </p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Añadir nuevos productos a tu catálogo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Editar precios, descripciones e imágenes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Gestionar stock y disponibilidad
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Configurar MOQ (Cantidad Mínima de Pedido)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Activar/desactivar productos temporalmente
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ver estadísticas de ventas por producto
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa - Tu Catálogo</CardTitle>
          <CardDescription>Ejemplo de cómo se verá tu gestión de productos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-10"
                  disabled
                />
              </div>
              <Button variant="outline" disabled>
                Filtros
              </Button>
            </div>

            {/* Sample Products */}
            <div className="space-y-3">
              {/* Product 1 */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Aceite de Oliva Virgen Extra</p>
                  <p className="text-sm text-gray-600">SKU: AO-001 • Stock: 245 unidades</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">€12.50</p>
                  <p className="text-xs text-green-600 font-medium">Activo</p>
                </div>
              </div>

              {/* Product 2 */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Jamón Ibérico de Bellota</p>
                  <p className="text-sm text-gray-600">SKU: JI-002 • Stock: 87 unidades</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">€89.00</p>
                  <p className="text-xs text-green-600 font-medium">Activo</p>
                </div>
              </div>

              {/* Product 3 */}
              <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Vino Tinto Reserva</p>
                  <p className="text-sm text-gray-600">SKU: VT-003 • Stock: 0 unidades</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">€24.90</p>
                  <p className="text-xs text-red-600 font-medium">Agotado</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Funcionalidad en Desarrollo
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              La gestión completa de productos estará disponible próximamente. Actualmente 
              tienes 8 productos activos en el marketplace.
            </p>
            <a href="/supplier/dashboard" className="text-sm font-medium text-amber-700 hover:underline">
              ← Volver al Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
