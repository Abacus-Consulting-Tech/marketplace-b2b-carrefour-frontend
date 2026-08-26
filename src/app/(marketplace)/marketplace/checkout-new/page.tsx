/**
 * Checkout Page - Marketplace B2B Carrefour
 * 
 * Flujo completo de checkout multi-paso con validación
 * Pasos: Dirección → Pago → Revisión → Confirmación
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { AddressForm } from '@/components/checkout/AddressForm'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { CheckoutReview } from '@/components/checkout/CheckoutReview'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { completeCart } from '@/lib/api/checkout-client'
import type { CheckoutStep, ShippingAddress, PaymentMethod } from '@/types/checkout'

export default function CheckoutNewPage() {
  const router = useRouter()
  const { items, cartId } = useCartStore()
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address')
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirectingToSuccess, setIsRedirectingToSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !isRedirectingToSuccess) {
      router.push('/marketplace')
    }
  }, [items, isSubmitting, isRedirectingToSuccess, router])

  // Convert cart items to checkout format
  const checkoutItems = items.map(item => ({
    productId: item.productId,
    variantId: item.variantId,
    title: item.name,
    description: item.description,
    thumbnail: item.image,
    quantity: item.quantity,
    price: item.price, // already in cents
  }))

  // Handle address form submission
  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setCompletedSteps(prev => [...new Set([...prev, 'address'])])
    setCurrentStep('payment')
    setError(null)
  }

  // Handle payment form submission
  const handlePaymentSubmit = (payment: PaymentMethod) => {
    setPaymentMethod(payment)
    setCompletedSteps(prev => [...new Set([...prev, 'payment'])])
    setCurrentStep('review')
    setError(null)
  }

  // Handle order confirmation
  const handleOrderConfirm = async () => {
    if (!shippingAddress || !paymentMethod) {
      setError('Faltan datos de dirección o pago')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Complete the cart and create order (pass cartId for Medusa integration)
      const order = await completeCart(
        {
          shippingAddress,
          paymentMethod,
        },
        checkoutItems,
        cartId // 🌐 Medusa cart ID from Zustand store
      )

      // Mark review as completed
      setCompletedSteps(prev => [...new Set([...prev, 'review'])])

      // Debug: Log order details
      console.log('✅ Order created:', order)
      console.log('📍 Redirecting to success page with:', {
        orderId: order.id,
        display_id: order.display_id,
        fullUrl: `/marketplace/checkout-new/success?orderId=${order.id}&display_id=${order.display_id}`
      })

      setIsRedirectingToSuccess(true)
      router.replace(`/marketplace/checkout-new/success?orderId=${order.id}&display_id=${order.display_id}`)
    } catch (err) {
      console.error('Error completing order:', err)
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido. Por favor, intenta de nuevo.')
      setIsRedirectingToSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const handleStepClick = (step: CheckoutStep) => {
    // Only allow navigation to completed steps or current step
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step)
      setError(null)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address')
    } else if (currentStep === 'review') {
      setCurrentStep('payment')
    }
    setError(null)
  }

  // Handle edit actions from review
  const handleEditAddress = () => {
    setCurrentStep('address')
  }

  const handleEditPayment = () => {
    setCurrentStep('payment')
  }

  if (items.length === 0 && !isSubmitting && !isRedirectingToSuccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa tu pedido en 3 sencillos pasos
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <CheckoutSteps
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Forms */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {currentStep === 'address' && (
                <AddressForm
                  initialAddress={shippingAddress || undefined}
                  onSubmit={handleAddressSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 'payment' && (
                <PaymentForm
                  initialPayment={paymentMethod || undefined}
                  onSubmit={handlePaymentSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 'review' && shippingAddress && paymentMethod && (
                <CheckoutReview
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  items={checkoutItems}
                  onConfirm={handleOrderConfirm}
                  onBack={handleBack}
                  onEditAddress={handleEditAddress}
                  onEditPayment={handleEditPayment}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary items={checkoutItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
