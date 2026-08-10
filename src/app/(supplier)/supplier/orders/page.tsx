'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SupplierOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos Recibidos</h1>
        <p className="text-gray-600 mt-1">
          Gestiona los pedidos de tus productos
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Gestión de Pedidos - Próximamente</CardTitle>
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
                Ver todos los pedidos que contienen tus productos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aceptar o rechazar pedidos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Actualizar el estado de preparación
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Agregar información de seguimiento
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Gestionar incidencias y devoluciones
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa - Pedidos Pendientes</CardTitle>
          <CardDescription>Ejemplo de cómo se verán tus pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample Order 1 */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #CF-10001</p>
                  <p className="text-sm text-gray-600">Franquiciado Norte - 3 productos tuyos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€145.50</p>
                <p className="text-xs text-yellow-600 font-medium">Pendiente de Aceptar</p>
              </div>
            </div>

            {/* Sample Order 2 */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50 border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #CF-10002</p>
                  <p className="text-sm text-gray-600">Franquiciado Sur - 5 productos tuyos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€289.00</p>
                <p className="text-xs text-purple-600 font-medium">En Preparación</p>
              </div>
            </div>

            {/* Sample Order 3 */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Pedido #CF-09998</p>
                  <p className="text-sm text-gray-600">Franquiciado Centro - 2 productos tuyos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€95.00</p>
                <p className="text-xs text-green-600 font-medium">Entregado</p>
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
              Esta página está en desarrollo activo. Mientras tanto, puedes ver un resumen 
              de tus pedidos en el Dashboard.
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
