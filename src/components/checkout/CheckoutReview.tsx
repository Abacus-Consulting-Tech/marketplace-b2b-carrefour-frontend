/**
 * Checkout Review Component - Marketplace B2B Carrefour
 * 
 * Paso final del checkout - revisión completa antes de confirmar
 * Muestra dirección, pago y productos para verificación final
 */

'use client'

import Image from 'next/image'
import { MapPin, CreditCard, Building2, Package } from 'lucide-react'
import { formatPrice } from '@/lib/api/checkout-client'
import type { ShippingAddress, PaymentMethod } from '@/types/checkout'

interface CartItem {
  productId: string
  variantId?: string
  title: string
  description?: string
  thumbnail?: string
  quantity: number
  price: number // in cents
}

interface CheckoutReviewProps {
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  items: CartItem[]
  onConfirm: () => void
  onBack?: () => void
  onEditAddress?: () => void
  onEditPayment?: () => void
  isSubmitting?: boolean
}

export function CheckoutReview({
  shippingAddress,
  paymentMethod,
  items,
  onConfirm,
  onBack,
  onEditAddress,
  onEditPayment,
  isSubmitting = false,
}: CheckoutReviewProps) {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.21 // 21% IVA
  const taxTotal = Math.round(subtotal * taxRate)
  const shippingTotal = 0 // Free shipping
  const total = subtotal + taxTotal + shippingTotal

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Revisa tu pedido</h2>
        <p className="mt-1 text-sm text-gray-500">
          Verifica que toda la información sea correcta antes de confirmar
        </p>
      </div>

      {/* Shipping Address */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <h3 className="text-base font-medium text-gray-900">Dirección de envío</h3>
          </div>
          {onEditAddress && (
            <button
              type="button"
              onClick={onEditAddress}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Editar
            </button>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          {shippingAddress.company && (
            <p className="mt-1">{shippingAddress.company}</p>
          )}
          <p className="mt-2">{shippingAddress.address1}</p>
          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
          <p>
            {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.province}
          </p>
          <p className="mt-2">{shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {paymentMethod.type === 'card' ? (
              <CreditCard className="h-5 w-5 text-gray-400" />
            ) : (
              <Building2 className="h-5 w-5 text-gray-400" />
            )}
            <h3 className="text-base font-medium text-gray-900">Método de pago</h3>
          </div>
          {onEditPayment && (
            <button
              type="button"
              onClick={onEditPayment}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Editar
            </button>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {paymentMethod.type === 'card' ? (
            <>
              <p className="font-medium text-gray-900">Tarjeta de crédito</p>
              {paymentMethod.cardNumber && (
                <p className="mt-1">
                  •••• •••• •••• {paymentMethod.cardNumber.slice(-4)}
                </p>
              )}
              {paymentMethod.cardHolder && (
                <p className="mt-1">{paymentMethod.cardHolder}</p>
              )}
            </>
          ) : (
            <>
              <p className="font-medium text-gray-900">Transferencia bancaria</p>
              <p className="mt-1">Condiciones B2B: 30 días</p>
              <p className="text-xs text-gray-500">
                Recibirás las instrucciones por email
              </p>
            </>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-gray-900">
            Productos ({items.length})
          </h3>
        </div>

        <ul className="mt-4 divide-y divide-gray-200">
          {items.map((item, index) => (
            <li
              key={`${item.productId}-${item.variantId || index}`}
              className="flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Thumbnail */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                  {item.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Order Total */}
        <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">IVA (21%)</span>
            <span className="font-medium text-gray-900">{formatPrice(taxTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="rounded-md bg-gray-50 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            He leído y acepto los{' '}
            <a href="/terminos" className="font-medium text-blue-600 hover:text-blue-700">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="/privacidad" className="font-medium text-blue-600 hover:text-blue-700">
              política de privacidad
            </a>
          </span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Volver al pago
          </button>
        )}
        
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="ml-auto rounded-md bg-green-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando pedido...
            </span>
          ) : (
            'Confirmar pedido'
          )}
        </button>
      </div>
    </div>
  )
}
