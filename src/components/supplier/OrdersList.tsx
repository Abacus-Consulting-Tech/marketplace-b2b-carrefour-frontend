'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Calendar,
  Euro,
  Building2,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { SupplierOrder, SupplierOrderStatus } from '@/types/orders-supplier'

interface OrdersListProps {
  orders: SupplierOrder[]
  isLoading?: boolean
  onFilterChange?: (filters: { status?: SupplierOrderStatus; search?: string }) => void
}

export function OrdersList({ orders, isLoading, onFilterChange }: OrdersListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SupplierOrderStatus | 'all'>('all')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange?.({ 
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: value || undefined 
    })
  }

  const handleStatusChange = (value: string) => {
    const status = value as SupplierOrderStatus | 'all'
    setStatusFilter(status)
    onFilterChange?.({ 
      status: status === 'all' ? undefined : status,
      search: search || undefined 
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número de pedido o cliente..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="in_preparation">En Preparación</SelectItem>
                  <SelectItem value="shipped">Enviados</SelectItem>
                  <SelectItem value="delivered">Entregados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' || search
                ? 'No se encontraron pedidos con los filtros seleccionados.'
                : 'Todavía no has recibido ningún pedido.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/supplier/orders/${order.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{order.franchiseeName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(order.created_at).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Productos</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.supplierItems.length} artículo{order.supplierItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cantidad</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.supplierItems.reduce((sum, item) => sum + item.quantity, 0)} unidades
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-lg font-bold text-[#0066CC] flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        {order.supplierTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500">Seguimiento</p>
                      <p className="text-sm font-mono text-gray-900 mt-1">
                        {order.carrier}: {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
