/**
 * Admin Orders List Component
 * 
 * Lista global de todos los pedidos con filtros avanzados para administradores
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminOrder, OrderStatus, PRIORITY_CONFIG } from '@/types/orders-admin'
import { getAdminOrders, formatPrice, formatShortDate } from '@/lib/api/orders-admin-client'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/franchisee/OrderStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Package, ChevronRight, Filter, Loader2, ShoppingBag, 
  AlertCircle, Building2, User
} from 'lucide-react'

export function AdminOrdersList() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [incidentsOnly, setIncidentsOnly] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [statusFilter, priorityFilter, incidentsOnly])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params: any = {}
      
      if (statusFilter !== 'all') params.status = statusFilter
      if (priorityFilter !== 'all') params.priority = priorityFilter
      if (incidentsOnly) params.has_incidents = true
      
      const response = await getAdminOrders(params)
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
      if (statusFilter !== 'all') params.status = statusFilter
      if (priorityFilter !== 'all') params.priority = priorityFilter
      if (incidentsOnly) params.has_incidents = true
      
      const response = await getAdminOrders(params)
      setOrders(response.orders)
    } catch (error) {
      console.error('Error al buscar pedidos:', error)
    } finally {
      setLoading(false)
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar pedido, cliente, proveedor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
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

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>

            {/* Incidents Toggle */}
            <Button
              variant={incidentsOnly ? 'default' : 'outline'}
              onClick={() => setIncidentsOnly(!incidentsOnly)}
              className="w-full"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {incidentsOnly ? 'Con incidencias' : 'Todos'}
            </Button>
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
                    : 'Aún no hay pedidos en el sistema'}
                </p>
              </div>
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
                      <Package className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {order.display_id}
                          </h3>
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.payment_status} />
                          <Badge className={PRIORITY_CONFIG[order.priority].className}>
                            {PRIORITY_CONFIG[order.priority].label}
                          </Badge>
                          {order.has_incidents && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {order.incident_count} incidencia{order.incident_count > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatShortDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Customer & Supplier */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="text-gray-600">Cliente: </span>
                          <span className="font-medium">{order.customer_name}</span>
                          {order.franchisee_company && (
                            <span className="text-gray-500"> - {order.franchisee_company}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="text-gray-600">Proveedor: </span>
                          <span className="font-medium">{order.supplier_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 2).map((item) => (
                        <Badge key={item.id} variant="secondary" className="text-xs">
                          {item.title} (x{item.quantity})
                        </Badge>
                      ))}
                      {order.items.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{order.items.length - 2} más
                        </Badge>
                      )}
                    </div>

                    {/* Admin Notes */}
                    {order.admin_notes && (
                      <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        📝 {order.admin_notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Totals & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
                      {order.commission_amount && (
                        <p className="text-xs text-gray-500">
                          Com.: {formatPrice(order.commission_amount)}
                        </p>
                      )}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>
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
