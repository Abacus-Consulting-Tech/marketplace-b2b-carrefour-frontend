/**
 * Checkout Summary Component - Marketplace B2B Carrefour
 * 
 * Sidebar con resumen del pedido (siempre visible durante checkout)
 * Muestra productos, cantidades y totales
 */

'use client'

import Image from 'next/image'
import { formatPrice } from '@/lib/api/checkout-client'

interface CartItem {
  productId: string
  variantId?: string
  title: string
  description?: string
  thumbnail?: string
  quantity: number
  price: number // in cents
}

interface CheckoutSummaryProps {
  items: CartItem[]
}

export function CheckoutSummary({ items }: CheckoutSummaryProps) {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.21 // 21% IVA
  const taxTotal = Math.round(subtotal * taxRate)
  const shippingTotal = 0 // Free shipping for B2B
  const total = subtotal + taxTotal + shippingTotal

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Resumen del pedido</h2>
        <p className="mt-4 text-sm text-gray-500">
          No hay productos en el carrito
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Resumen del pedido
      </h2>

      {/* Items */}
      <ul className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li key={`${item.productId}-${item.variantId || index}`} className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Cantidad: {item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">IVA (21%)</span>
          <span className="font-medium text-gray-900">{formatPrice(taxTotal)}</span>
        </div>

        {/* Shipping */}
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="font-medium text-green-600">
            {shippingTotal === 0 ? 'Gratis' : formatPrice(shippingTotal)}
          </span>
        </div>

        {/* Total */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            IVA incluido
          </p>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 rounded-md bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <strong>Envío gratuito</strong> para pedidos B2B
        </p>
      </div>
    </div>
  )
}
