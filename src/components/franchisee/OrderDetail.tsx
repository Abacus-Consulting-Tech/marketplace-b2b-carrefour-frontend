/**
 * Order Detail Component
 * 
 * Vista detallada de un pedido con toda la información
 */

'use client'

import { FranchiseeOrder } from '@/types/orders-franchisee'
import { formatPrice, formatDate } from '@/lib/api/orders-franchisee-client'
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge'
import { OrderTracking } from './OrderTracking'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  MapPin, 
  CreditCard,
  FileText,
  Calendar,
  Building2,
  Phone,
  Mail
} from 'lucide-react'
import Image from 'next/image'

interface OrderDetailProps {
  order: FranchiseeOrder
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Pedido {order.display_id}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                Realizado el {formatDate(order.created_at)}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Proveedor</p>
              <p className="font-semibold">{order.supplier_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold text-xl">{formatPrice(order.total)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{order.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking (if available) */}
      {order.tracking && (
        <OrderTracking tracking={order.tracking} />
      )}

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex gap-4">
                  {/* Image */}
                  {item.thumbnail && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.metadata?.sku && (
                      <p className="text-xs text-gray-500 mt-1">SKU: {item.metadata.sku}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">Cantidad: {item.quantity}</span>
                      <span className="text-gray-600">Precio unitario: {formatPrice(item.unit_price)}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.total ?? item.subtotal)}</p>
                    <p className="text-sm text-gray-600">IVA incluido</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumen de Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (21%)</span>
              <span className="font-medium">{formatPrice(order.tax_total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium">
                {order.shipping_total === 0 ? 'Gratis' : formatPrice(order.shipping_total)}
              </span>
            </div>
            {order.discount_total > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Descuento</span>
                <span className="font-medium text-green-600">
                  -{formatPrice(order.discount_total)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dirección de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            {order.shipping_address.company && (
              <p className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-500" />
                {order.shipping_address.company}
              </p>
            )}
            <p className="text-sm text-gray-600">{order.shipping_address.address_1}</p>
            {order.shipping_address.address_2 && (
              <p className="text-sm text-gray-600">{order.shipping_address.address_2}</p>
            )}
            <p className="text-sm text-gray-600">
              {order.shipping_address.postal_code} {order.shipping_address.city}
            </p>
            {order.shipping_address.province && (
              <p className="text-sm text-gray-600">{order.shipping_address.province}</p>
            )}
            <p className="text-sm text-gray-600">{order.shipping_address.country_code.toUpperCase()}</p>
            <p className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <Phone className="h-4 w-4" />
              {order.shipping_address.phone}
            </p>
          </CardContent>
        </Card>

        {/* Payment & Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Información de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Estado del pago</p>
              <PaymentStatusBadge status={order.payment_status} />
            </div>
            
            {order.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Notas del pedido</p>
                <p className="text-sm p-3 bg-gray-50 rounded-lg">{order.notes}</p>
              </div>
            )}

            {order.metadata?.purchase_order && (
              <div>
                <p className="text-sm text-gray-600">Orden de compra</p>
                <p className="font-medium">{order.metadata.purchase_order}</p>
              </div>
            )}

            {order.completed_at && (
              <div>
                <p className="text-sm text-gray-600">Completado</p>
                <p className="font-medium">{formatDate(order.completed_at)}</p>
              </div>
            )}

            {order.cancelled_at && (
              <div>
                <p className="text-sm text-gray-600">Cancelado</p>
                <p className="font-medium">{formatDate(order.cancelled_at)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status History */}
      {order.status_history && order.status_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.status_history.map((change, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <OrderStatusBadge status={change.from_status} />
                      <span className="text-gray-400">→</span>
                      <OrderStatusBadge status={change.to_status} />
                    </div>
                    {change.reason && (
                      <p className="text-sm text-gray-600 mt-1">{change.reason}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(change.changed_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
