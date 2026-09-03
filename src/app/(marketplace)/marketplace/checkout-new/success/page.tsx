/**
 * Checkout Success Page - Marketplace B2B Carrefour
 * 
 * Página de confirmación de pedido exitoso
 * Muestra detalles del pedido y próximos pasos
 */

'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowRight, CheckCircle, Clock3, Package, Store } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice, getCheckoutOrderStatus, type CheckoutOrderStatus } from '@/lib/api/checkout-client'
import type { FranchiseeOrder } from '@/types/orders-franchisee'

interface SupplierOrderGroup {
  id: string
  name: string
  total: number
  status?: string
  itemCount: number
}

function getSupplierGroups(order: FranchiseeOrder | null): SupplierOrderGroup[] {
  if (!order) {
    return []
  }

  const metadata = order.metadata as Record<string, unknown> | undefined
  const supplierOrders = Array.isArray(metadata?.supplier_orders)
    ? metadata?.supplier_orders as Array<Record<string, unknown>>
    : []

  if (supplierOrders.length > 0) {
    return supplierOrders.map((supplierOrder, index) => ({
      id: typeof supplierOrder.id === 'string' ? supplierOrder.id : `supplier-order-${index}`,
      name:
        typeof supplierOrder.supplier_name === 'string'
          ? supplierOrder.supplier_name
          : `Proveedor ${index + 1}`,
      total: typeof supplierOrder.total === 'number' ? supplierOrder.total : 0,
      status: typeof supplierOrder.status === 'string' ? supplierOrder.status : undefined,
      itemCount: typeof supplierOrder.item_count === 'number' ? supplierOrder.item_count : 0,
    }))
  }

  return [
    {
      id: order.supplier_id || order.id,
      name: order.supplier_name || 'Proveedor asignado',
      total: order.total,
      status: order.status,
      itemCount: order.items.length,
    },
  ]
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const orderId = searchParams.get('orderId') || 'unknown'
  const displayId = searchParams.get('display_id') || `CF-${orderId.slice(-5).toUpperCase()}`
  const [status, setStatus] = useState<CheckoutOrderStatus | 'manual_review'>(orderId === 'unknown' ? 'manual_review' : 'processing')
  const [order, setOrder] = useState<FranchiseeOrder | null>(null)
  const [message, setMessage] = useState('Estamos validando el pago y confirmando el pedido con el backend.')

  const supplierGroups = useMemo(() => getSupplierGroups(order), [order])

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    if (orderId === 'unknown') {
      setStatus('manual_review')
      setMessage('No hemos recibido todavía el identificador final del pedido.')
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    const maxAttempts = 6

    const pollOrderStatus = async () => {
      const result = await getCheckoutOrderStatus(orderId)

      if (cancelled) {
        return
      }

      if (result.order) {
        setOrder(result.order)
      }

      setMessage(result.message || 'Estamos validando el pago y confirmando el pedido con el backend.')

      if (result.status === 'confirmed' || result.status === 'failed') {
        setStatus(result.status)
        return
      }

      attempts += 1

      if (attempts >= maxAttempts) {
        setStatus('manual_review')
        setMessage('El pago se ha enviado correctamente, pero la confirmación final está tardando más de lo habitual. Puedes revisar el pedido en unos minutos.')
        return
      }

      setStatus('processing')
      timer = setTimeout(pollOrderStatus, 3000)
    }

    void pollOrderStatus()

    return () => {
      cancelled = true
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [orderId])

  const title = status === 'confirmed'
    ? '¡Pedido confirmado!'
    : status === 'failed'
      ? 'No hemos podido confirmar el pedido'
      : status === 'manual_review'
        ? 'Estamos finalizando tu pedido'
        : 'Pago recibido, confirmando pedido'

  const subtitle = status === 'confirmed'
    ? 'Tu pedido ya está registrado y comenzará su preparación.'
    : status === 'failed'
      ? 'Revisa el estado del pago o contacta con soporte antes de volver a intentarlo.'
      : status === 'manual_review'
        ? 'El backend sigue procesando la confirmación. No repitas el pago.'
        : 'Stripe ha aceptado el cobro y ahora esperamos la confirmación definitiva del backend.'

  const HeaderIcon = status === 'confirmed' ? CheckCircle : status === 'failed' ? AlertCircle : Clock3
        const nextStepBulletClass = status === 'failed' ? 'bg-red-600' : 'bg-blue-600'

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${status === 'confirmed' ? 'bg-green-100' : status === 'failed' ? 'bg-red-100' : 'bg-amber-100'}`}>
            <HeaderIcon className={`h-10 w-10 ${status === 'confirmed' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Pedido #{displayId}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Realizado el {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Estado: {status === 'confirmed' ? 'Confirmado' : status === 'failed' ? 'Incidencia de pago' : 'En confirmación'}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <h3 className="text-base font-semibold text-gray-900">
              Detalles del pedido
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Número de pedido:</dt>
                <dd className="font-medium text-gray-900">{order?.display_id || displayId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">ID de transacción:</dt>
                <dd className="font-mono text-xs text-gray-500">{orderId}</dd>
              </div>
              {order && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Estado del pago:</dt>
                    <dd className="font-medium text-gray-900">{order.payment_status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Total:</dt>
                    <dd className="font-medium text-gray-900">{formatPrice(order.total)}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>

        {supplierGroups.length > 0 && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Store className="h-5 w-5 text-gray-500" />
              Gestión por proveedor
            </h3>
            <div className="mt-4 space-y-3">
              {supplierGroups.map(group => (
                <div key={group.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.itemCount} producto(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(group.total)}</p>
                    {group.status && <p className="text-sm text-gray-500">{group.status}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-8 rounded-lg border p-6 ${status === 'failed' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
          <h3 className={`text-base font-semibold ${status === 'failed' ? 'text-red-900' : 'text-blue-900'}`}>
            Próximos pasos
          </h3>
          <ul className={`mt-4 space-y-2 text-sm ${status === 'failed' ? 'text-red-700' : 'text-blue-700'}`}>
            {status === 'confirmed' && (
              <>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>El pedido ya está confirmado y pasará a preparación.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>Podrás seguir su evolución y las entregas por proveedor desde Mis pedidos.</span>
                </li>
              </>
            )}
            {status === 'processing' && (
              <>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>No cierres la compra ni repitas el pago. El backend está esperando la confirmación definitiva.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>Si el estado no cambia en unos minutos, revisa Mis pedidos o contacta con soporte.</span>
                </li>
              </>
            )}
            {status === 'manual_review' && (
              <>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>La sincronización está tardando más de lo habitual, pero eso no implica un fallo automático.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>Consulta Mis pedidos en unos minutos para validar si el pedido ya apareció.</span>
                </li>
              </>
            )}
            {status === 'failed' && (
              <>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>Verifica si el cargo llegó a completarse antes de intentar un nuevo pago.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${nextStepBulletClass}`}></span>
                  <span>Si el problema persiste, comparte el ID de transacción con soporte.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/marketplace/orders"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ver mis pedidos
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccessFallback() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center text-gray-600 sm:px-6 lg:px-8">
        Cargando confirmación del pedido...
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

