/**
 * Checkout Success Page - Marketplace B2B Carrefour
 * 
 * Página de confirmación de pedido exitoso
 * Muestra detalles del pedido y próximos pasos
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const orderId = searchParams.get('orderId') || 'unknown'
  const displayId = searchParams.get('display_id') || `CF-${orderId.slice(-5).toUpperCase()}`

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Tu pedido ha sido procesado correctamente
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Order Header */}
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

          {/* Order Status */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Estado: Confirmado
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Tu pedido está siendo procesado
                </p>
              </div>
            </div>
          </div>

          {/* Order ID Info */}
          <div className="px-6 py-6">
            <h3 className="text-base font-semibold text-gray-900">
              Detalles del pedido
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Número de pedido:</dt>
                <dd className="font-medium text-gray-900">{displayId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">ID de transacción:</dt>
                <dd className="font-mono text-xs text-gray-500">{orderId}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-base font-semibold text-blue-900">
            Próximos pasos
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              <span>Recibirás un email de confirmación con los detalles del pedido</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              <span>Prepararemos tu pedido y te notificaremos cuando esté listo para envío</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              <span>Puedes hacer seguimiento en la sección &ldquo;Mis Pedidos&rdquo;</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
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

