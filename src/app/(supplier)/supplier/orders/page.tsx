'use client'

import { useEffect, useState } from 'react'
import { Package, TrendingUp, Clock, Truck, Euro } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrdersList } from '@/components/supplier/OrdersList'
import { supplierOrdersApi } from '@/lib/api/orders-supplier-client'
import type { SupplierOrder, SupplierOrderStats, SupplierOrderFilters } from '@/types/orders-supplier'

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [stats, setStats] = useState<SupplierOrderStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<SupplierOrderFilters>({})

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [ordersData, statsData] = await Promise.all([
        supplierOrdersApi.getOrders(filters),
        supplierOrdersApi.getOrderStats(),
      ])
      setOrders(ordersData.orders)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters: { status?: any; search?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos Recibidos</h1>
        <p className="text-gray-600 mt-1">
          Gestiona los pedidos que contienen tus productos
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-gray-600 mt-1">Requieren acción</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Preparación</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.confirmedCount + stats.inPreparationCount}
              </div>
              <p className="text-xs text-gray-600 mt-1">En proceso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              <Truck className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shippedCount}</div>
              <p className="text-xs text-gray-600 mt-1">Últimos 7 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Euro className="h-5 w-5 mr-1" />
                {stats.revenueThisMonth.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Este mes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders List */}
      <OrdersList
        orders={orders}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
