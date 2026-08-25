/**
 * Admin Order Detail Page
 * 
 * Página de detalle de un pedido específico con acciones de administrador
 * Route: /admin/orders/[id]
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminOrderById, updateOrderStatus, updateOrderPriority, formatPrice } from '@/lib/api/orders-admin-client'
import { AdminOrder, PRIORITY_CONFIG } from '@/types/orders-admin'
import { OrderDetail } from '@/components/franchisee/OrderDetail'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft, Loader2, Package, AlertCircle, Euro, User, Building2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface AdminOrderDetailPageProps {
  params: {
    id: string
  }
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const router = useRouter()
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await getAdminOrderById(params.id)
      setOrder(response.order)
      setNewStatus(response.order.status)
      setNewPriority(response.order.priority)
      setAdminNotes(response.order.admin_notes || '')
    } catch (error) {
      console.error('Error al cargar pedido:', error)
      toast.error('Error al cargar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!order) return

    try {
      setUpdating(true)
      const response = await updateOrderStatus({
        order_id: order.id,
        new_status: newStatus as any,
        reason: 'Actualizado por administrador',
        admin_notes: adminNotes
      })
      
      setOrder(response.order)
      setEditMode(false)
      toast.success('Estado actualizado correctamente')
    } catch (error: any) {
      console.error('Error al actualizar estado:', error)
      toast.error(error.message || 'Error al actualizar el estado')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdatePriority = async () => {
    if (!order) return

    try {
      setUpdating(true)
      const response = await updateOrderPriority({
        order_id: order.id,
        priority: newPriority as any,
        reason: 'Actualizado por administrador'
      })
      
      setOrder(response.order)
      toast.success('Prioridad actualizada')
    } catch (error: any) {
      console.error('Error al actualizar prioridad:', error)
      toast.error(error.message || 'Error al actualizar la prioridad')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pedido no encontrado</h3>
                <p className="text-gray-600 mt-2">No se pudo encontrar el pedido solicitado</p>
              </div>
              <Button asChild>
                <Link href="/admin/orders">Volver a Pedidos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Pedidos
          </Link>
        </Button>
      </div>

      {/* Admin Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
            {order.franchisee_company && (
              <p className="text-sm text-gray-500 mt-1">{order.franchisee_company}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Proveedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.supplier_name}</p>
            {order.supplier_email && (
              <p className="text-sm text-gray-600">{order.supplier_email}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Financials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{formatPrice(order.total)}</p>
            {order.commission_amount && (
              <>
                <p className="text-sm text-gray-600">
                  Comisión ({order.commission_rate}%): {formatPrice(order.commission_amount)}
                </p>
                <p className="text-sm text-green-600">
                  Neto: {formatPrice(order.net_amount || 0)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Acciones de Administrador
            </CardTitle>
            <Button
              variant={editMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancelar' : 'Editar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="processing">En Preparación</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prioridad</label>
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notas de Administrador</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notas internas del pedido..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateStatus} disabled={updating}>
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Actualizar
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prioridad</p>
                <Badge className={PRIORITY_CONFIG[order.priority].className}>
                  {PRIORITY_CONFIG[order.priority].label}
                </Badge>
              </div>
              {order.admin_notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Notas</p>
                  <p className="text-sm p-3 bg-orange-50 rounded-lg">{order.admin_notes}</p>
                </div>
              )}
              {order.has_incidents && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {order.incident_count} incidencia{order.incident_count > 1 ? 's' : ''} reportada{order.incident_count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail */}
      <OrderDetail order={order} />
    </div>
  )
}
