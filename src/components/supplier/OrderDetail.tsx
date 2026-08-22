'use client'

import { useState } from 'react'
import {
  Package,
  Calendar,
  Euro,
  Building2,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { SupplierOrder } from '@/types/orders-supplier'
import { supplierOrdersApi } from '@/lib/api/orders-supplier-client'
import { useToast } from '@/hooks/use-toast'

interface OrderDetailProps {
  order: SupplierOrder
  onOrderUpdate?: (updatedOrder: SupplierOrder) => void
}

export function OrderDetail({ order, onOrderUpdate }: OrderDetailProps) {
  const { toast } = useToast()
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Accept form state
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [acceptNotes, setAcceptNotes] = useState('')

  // Reject form state
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')

  // Tracking form state
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')

  const handleAcceptOrder = async () => {
    setIsUpdating(true)
    try {
      const updated = await supplierOrdersApi.acceptOrder({
        orderId: order.id,
        estimatedDelivery: estimatedDelivery || undefined,
        notes: acceptNotes || undefined,
      })

      if (updated) {
        onOrderUpdate?.(updated)
        toast({
          title: 'Pedido aceptado',
          description: 'El pedido ha sido confirmado correctamente.',
        })
      }
      setIsAcceptDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo aceptar el pedido. Inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRejectOrder = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: 'Motivo requerido',
        description: 'Debes proporcionar un motivo para rechazar el pedido.',
        variant: 'destructive',
      })
      return
    }

    setIsUpdating(true)
    try {
      const updated = await supplierOrdersApi.rejectOrder({
        orderId: order.id,
        reason: rejectReason,
        notes: rejectNotes || undefined,
      })

      if (updated) {
        onOrderUpdate?.(updated)
        toast({
          title: 'Pedido rechazado',
          description: 'El pedido ha sido rechazado.',
        })
      }
      setIsRejectDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo rechazar el pedido. Inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStartPreparation = async () => {
    setIsUpdating(true)
    try {
      const updated = await supplierOrdersApi.updateOrderStatus({
        orderId: order.id,
        status: 'in_preparation',
        notes: 'Pedido en preparación',
      })

      if (updated) {
        onOrderUpdate?.(updated)
        toast({
          title: 'Estado actualizado',
          description: 'El pedido está ahora en preparación.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddTracking = async () => {
    if (!trackingNumber.trim() || !carrier.trim()) {
      toast({
        title: 'Datos incompletos',
        description: 'Debes proporcionar el número de seguimiento y la transportista.',
        variant: 'destructive',
      })
      return
    }

    setIsUpdating(true)
    try {
      const updated = await supplierOrdersApi.addTracking({
        orderId: order.id,
        trackingNumber,
        carrier,
        trackingUrl: trackingUrl || undefined,
      })

      if (updated) {
        onOrderUpdate?.(updated)
        toast({
          title: 'Seguimiento añadido',
          description: 'El pedido ha sido marcado como enviado.',
        })
      }
      setIsTrackingDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo añadir el seguimiento.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const totalQuantity = order.supplierItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.orderNumber}</h1>
          <div className="flex items-center gap-4">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm text-gray-600">
              Pedido el {new Date(order.created_at).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {order.status === 'pending' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Acción requerida</p>
                <p className="text-sm text-gray-600">Este pedido está esperando tu confirmación</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
              <Button
                onClick={() => setIsAcceptDialogOpen(true)}
                disabled={isUpdating}
                className="bg-[#0066CC] hover:bg-[#0052A3]"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aceptar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {order.status === 'confirmed' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Pedido confirmado</p>
                <p className="text-sm text-gray-600">Puedes comenzar a preparar el pedido</p>
              </div>
            </div>
            <Button
              onClick={handleStartPreparation}
              disabled={isUpdating}
              className="bg-[#0066CC] hover:bg-[#0052A3]"
            >
              <Package className="h-4 w-4 mr-2" />
              Iniciar Preparación
            </Button>
          </CardContent>
        </Card>
      )}

      {order.status === 'in_preparation' && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">En preparación</p>
                <p className="text-sm text-gray-600">Cuando esté listo, marca el pedido como enviado</p>
              </div>
            </div>
            <Button
              onClick={() => setIsTrackingDialogOpen(true)}
              disabled={isUpdating}
              className="bg-[#0066CC] hover:bg-[#0052A3]"
            >
              <Truck className="h-4 w-4 mr-2" />
              Marcar como Enviado
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Productos del Pedido</CardTitle>
              <CardDescription>
                {order.supplierItems.length} producto{order.supplierItems.length !== 1 ? 's' : ''} • {totalQuantity} unidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.supplierItems.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                      {item.variant_title && (
                        <p className="text-sm text-gray-600 mt-1">{item.variant_title}</p>
                      )}
                      {item.sku && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">SKU: {item.sku}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                        <span className="text-sm text-gray-600">
                          Precio: €{item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">€{item.subtotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">IVA: €{item.tax.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">€{order.supplierSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%):</span>
                  <span className="font-medium">€{order.supplierTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-[#0066CC]">€{order.supplierTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {(order.franchiseeNotes || order.supplierNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.franchiseeNotes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Cliente:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {order.franchiseeNotes}
                    </p>
                  </div>
                )}
                {order.supplierNotes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Proveedor (tú):</p>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      {order.supplierNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.franchiseeName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                  <p className="mt-1">{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.province}</p>
                </div>
              </div>
              {order.shippingAddress.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transportista</p>
                  <p className="text-sm font-medium">{order.carrier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Número de Seguimiento</p>
                  <p className="text-sm font-mono">{order.trackingNumber}</p>
                </div>
                {order.trackingUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      <Truck className="h-4 w-4 mr-2" />
                      Seguir Envío
                    </a>
                  </Button>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Entrega Estimada</p>
                    <p className="text-sm">
                      {new Date(order.estimatedDelivery).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Historial del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Pedido Creado</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {order.shipped_at && (
                  <div className="flex gap-3">
                    <Truck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Enviado</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.shipped_at).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Entregado</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.delivered_at).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {/* Accept Order Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aceptar Pedido</DialogTitle>
            <DialogDescription>
              Confirma que puedes procesar este pedido. Puedes añadir una fecha estimada de entrega.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery">Fecha estimada de entrega (opcional)</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={estimatedDelivery}
                onChange={e => setEstimatedDelivery(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptNotes">Notas (opcional)</Label>
              <Textarea
                id="acceptNotes"
                placeholder="Añade cualquier nota para el cliente..."
                value={acceptNotes}
                onChange={e => setAcceptNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAcceptOrder}
              disabled={isUpdating}
              className="bg-[#0066CC] hover:bg-[#0052A3]"
            >
              {isUpdating ? 'Procesando...' : 'Aceptar Pedido'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Pedido</DialogTitle>
            <DialogDescription>
              Por favor, indica el motivo del rechazo. Esta información será compartida con el cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Motivo del rechazo *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Ej: Stock insuficiente, producto descatalogado..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejectNotes">Notas adicionales (opcional)</Label>
              <Textarea
                id="rejectNotes"
                placeholder="Información adicional..."
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleRejectOrder}
              disabled={isUpdating || !rejectReason.trim()}
              variant="destructive"
            >
              {isUpdating ? 'Procesando...' : 'Rechazar Pedido'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Enviado</DialogTitle>
            <DialogDescription>
              Añade la información de seguimiento del envío para que el cliente pueda rastrearlo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Transportista *</Label>
              <Input
                id="carrier"
                placeholder="Ej: SEUR, Correos, MRW..."
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Número de Seguimiento *</Label>
              <Input
                id="trackingNumber"
                placeholder="Ej: ESP123456789"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingUrl">URL de Seguimiento (opcional)</Label>
              <Input
                id="trackingUrl"
                type="url"
                placeholder="https://tracking.example.com/..."
                value={trackingUrl}
                onChange={e => setTrackingUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddTracking}
              disabled={isUpdating || !trackingNumber.trim() || !carrier.trim()}
              className="bg-[#0066CC] hover:bg-[#0052A3]"
            >
              {isUpdating ? 'Procesando...' : 'Marcar como Enviado'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
