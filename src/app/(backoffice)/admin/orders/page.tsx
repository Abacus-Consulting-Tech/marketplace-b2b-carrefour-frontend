/**
 * Admin Orders Page
 * 
 * Vista global de todos los pedidos de la plataforma para administradores
 * Route: /admin/orders
 */

import { AdminOrdersList } from '@/components/admin/AdminOrdersList'
import { AdminOrdersStats } from '@/components/admin/AdminOrdersStats'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Download, BarChart3 } from 'lucide-react'

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8" />
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600 mt-2">
            Vista completa de todos los pedidos de la plataforma
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">
            <Package className="h-4 w-4 mr-2" />
            Lista de Pedidos
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <AdminOrdersList />
        </TabsContent>

        <TabsContent value="stats">
          <AdminOrdersStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}
