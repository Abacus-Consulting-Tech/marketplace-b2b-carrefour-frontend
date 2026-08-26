/**
 * Payment Form Component - Marketplace B2B Carrefour
 * 
 * Formulario de método de pago para checkout
 * Soporta tarjeta de crédito y transferencia bancaria (B2B)
 */

'use client'

import { useState } from 'react'
import { CreditCard, Building2 } from 'lucide-react'
import { validatePaymentDetails } from '@/lib/api/checkout-client'
import type { PaymentMethod, PaymentValidationErrors } from '@/types/checkout'

interface PaymentFormProps {
  initialPayment?: PaymentMethod
  onSubmit: (payment: PaymentMethod) => void
  onBack?: () => void
  isSubmitting?: boolean
}

type PaymentType = 'card' | 'bank_transfer'

export function PaymentForm({
  initialPayment,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>(
    initialPayment?.type === 'bank_transfer' ? 'bank_transfer' : 'card'
  )

  const [formData, setFormData] = useState<PaymentMethod>(
    initialPayment || {
      type: 'card',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    }
  )

  const [errors, setErrors] = useState<PaymentValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type)
    
    // Reset form data when changing payment type
    if (type === 'card') {
      setFormData({
        type: 'card',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      })
    } else {
      setFormData({
        type: 'bank_transfer',
      })
    }
    
    setErrors({})
    setTouched({})
  }

  const handleChange = (field: keyof PaymentMethod, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: keyof PaymentMethod) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')
    // Add slash after MM
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    handleChange('cardNumber', formatted)
  }

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    handleChange('expiryDate', formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For bank transfer, no validation needed
    if (paymentType === 'bank_transfer') {
      onSubmit(formData)
      return
    }

    // Validate card details
    const validationErrors = validatePaymentDetails(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Mark all fields as touched
      const allTouched = Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
      setTouched(allTouched)
      return
    }

    onSubmit(formData)
  }

  const showError = (field: keyof PaymentMethod) => {
    return touched[field] && errors[field]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Método de pago</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Credit Card */}
          <button
            type="button"
            onClick={() => handlePaymentTypeChange('card')}
            className={`relative flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
              paymentType === 'card'
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <CreditCard className={`h-6 w-6 ${paymentType === 'card' ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <p className={`text-sm font-medium ${paymentType === 'card' ? 'text-blue-900' : 'text-gray-900'}`}>
                Tarjeta de crédito
              </p>
              <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
            </div>
            {paymentType === 'card' && (
              <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-blue-600">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                </svg>
              </div>
            )}
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => handlePaymentTypeChange('bank_transfer')}
            className={`relative flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
              paymentType === 'bank_transfer'
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Building2 className={`h-6 w-6 ${paymentType === 'bank_transfer' ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <p className={`text-sm font-medium ${paymentType === 'bank_transfer' ? 'text-blue-900' : 'text-gray-900'}`}>
                Transferencia bancaria
              </p>
              <p className="text-xs text-gray-500">Pago B2B a crédito</p>
            </div>
            {paymentType === 'bank_transfer' && (
              <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-blue-600">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Payment Details */}
      {paymentType === 'card' ? (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Detalles de la tarjeta</h4>

          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Número de tarjeta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber || ''}
              onChange={e => handleCardNumberChange(e.target.value)}
              onBlur={() => handleBlur('cardNumber')}
              placeholder="1234 5678 9012 3456"
              className={`mt-1 block w-full rounded-md border ${
                showError('cardNumber') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('cardNumber') && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          {/* Card Holder */}
          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
              Titular de la tarjeta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardHolder"
              value={formData.cardHolder || ''}
              onChange={e => handleChange('cardHolder', e.target.value)}
              onBlur={() => handleBlur('cardHolder')}
              placeholder="NOMBRE APELLIDO"
              className={`mt-1 block w-full rounded-md border ${
                showError('cardHolder') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 uppercase shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('cardHolder') && (
              <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Fecha de caducidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate || ''}
                onChange={e => handleExpiryDateChange(e.target.value)}
                onBlur={() => handleBlur('expiryDate')}
                placeholder="MM/AA"
                maxLength={5}
                className={`mt-1 block w-full rounded-md border ${
                  showError('expiryDate') ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                disabled={isSubmitting}
              />
              {showError('expiryDate') && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            {/* CVV */}
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv || ''}
                onChange={e => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                onBlur={() => handleBlur('cvv')}
                placeholder="123"
                maxLength={4}
                className={`mt-1 block w-full rounded-md border ${
                  showError('cvv') ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                disabled={isSubmitting}
              />
              {showError('cvv') && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-900">Instrucciones de transferencia</h4>
          <p className="mt-2 text-sm text-blue-700">
            Una vez confirmado el pedido, recibirás las instrucciones de transferencia por email.
            El pedido será procesado tras recibir el pago (plazo habitual: 24-48h).
          </p>
          <div className="mt-3 space-y-1 text-xs text-blue-600">
            <p>• Condiciones de pago B2B: 30 días</p>
            <p>• Descuento por pronto pago: 2% en 7 días</p>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Volver a dirección
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Procesando...' : 'Continuar a revisión'}
        </button>
      </div>
    </form>
  )
}
