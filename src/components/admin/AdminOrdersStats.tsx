/**
 * Admin Orders Stats Dashboard Component
 * 
 * Dashboard con estadísticas globales de pedidos para administradores
 */

'use client'

import { useState, useEffect } from 'react'
import { AdminOrderStats } from '@/types/orders-admin'
import { getAdminOrderStats, formatPrice } from '@/lib/api/orders-admin-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, Euro, TrendingUp, AlertCircle, Users, Building2,
  ShoppingCart, CheckCircle, XCircle, Clock, Loader2
} from 'lucide-react'

export function AdminOrdersStats() {
  const [stats, setStats] = useState<AdminOrderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await getAdminOrderStats()
      setStats(data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Pedidos',
      value: stats.total_orders,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Ingresos Totales',
      value: formatPrice(stats.total_revenue),
      icon: Euro,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Comisiones',
      value: formatPrice(stats.total_commission),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Ticket Promedio',
      value: formatPrice(stats.average_order_value),
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ]

  const periodStats = [
    { label: 'Hoy', value: stats.orders_today },
    { label: 'Esta semana', value: stats.orders_this_week },
    { label: 'Este mes', value: stats.orders_this_month }
  ]

  const statusStats = [
    { label: 'Pendientes', value: stats.pending_orders, icon: Clock, color: 'text-yellow-600' },
    { label: 'Confirmados', value: stats.confirmed_orders, icon: CheckCircle, color: 'text-blue-600' },
    { label: 'En proceso', value: stats.processing_orders, icon: Package, color: 'text-purple-600' },
    { label: 'Enviados', value: stats.shipped_orders, icon: Package, color: 'text-indigo-600' },
    { label: 'Entregados', value: stats.delivered_orders, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Cancelados', value: stats.cancelled_orders, icon: XCircle, color: 'text-red-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Period Stats & Issues */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {periodStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alta prioridad</span>
                  <span className="font-semibold text-orange-600">{stats.high_priority_orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Con incidencias</span>
                  <span className="font-semibold text-red-600">{stats.orders_with_incidents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Incidencias abiertas</span>
                  <span className="font-semibold text-red-600">{stats.open_incidents}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Proveedores
            </CardTitle>
            <CardDescription>Por ingresos generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.top_suppliers.map((supplier, index) => (
                <div key={supplier.supplier_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm">{supplier.supplier_name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(supplier.total_revenue)}</p>
                    <p className="text-xs text-gray-500">{supplier.total_orders} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Clientes
            </CardTitle>
            <CardDescription>Por gasto total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.top_customers.map((customer, index) => (
                <div key={customer.customer_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm">{customer.customer_name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(customer.total_spent)}</p>
                    <p className="text-xs text-gray-500">{customer.total_orders} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
