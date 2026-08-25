/**
 * Orders List Component
 * 
 * Lista de pedidos del franquiciado con filtros y búsqueda
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FranchiseeOrder, OrderStatus } from '@/types/orders-franchisee'
import { getOrders, formatPrice, formatShortDate } from '@/lib/api/orders-franchisee-client'
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Package, 
  ChevronRight, 
  Filter,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle2
} from 'lucide-react'

export function OrdersList() {
  const [orders, setOrders] = useState<FranchiseeOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params: any = {}
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      const response = await getOrders(params)
      setOrders(response.orders)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params: any = { search }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      const response = await getOrders(params)
      setOrders(response.orders)
    } catch (error) {
      console.error('Error al buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOrderIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'shipped':
      case 'processing':
        return <Truck className="h-5 w-5 text-blue-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por número de pedido o producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="processing">En Preparación</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No hay pedidos</h3>
                <p className="text-gray-600 mt-2">
                  {search || statusFilter !== 'all'
                    ? 'No se encontraron pedidos con los filtros seleccionados'
                    : 'Aún no has realizado ningún pedido'}
                </p>
              </div>
              {!search && statusFilter === 'all' && (
                <Button asChild>
                  <Link href="/marketplace">
                    Ir al catálogo
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      {getOrderIcon(order.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">
                            Pedido {order.display_id}
                          </h3>
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.payment_status} />
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatShortDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Supplier */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Proveedor:</span>
                      <span className="font-medium">{order.supplier_name}</span>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items.length} producto{order.items.length > 1 ? 's' : ''}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <Badge key={item.id} variant="secondary" className="text-xs">
                            {item.title} (x{item.quantity})
                          </Badge>
                        ))}
                        {order.items.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{order.items.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.tracking && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>{order.tracking.carrier}: {order.tracking.tracking_number}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Total & Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/marketplace/orders/${order.id}`}>
                        Ver detalle
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {orders.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Mostrando {orders.length} pedido{orders.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
