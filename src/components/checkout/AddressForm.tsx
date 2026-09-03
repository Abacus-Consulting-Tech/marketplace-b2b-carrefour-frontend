/**
 * Address Form Component - Marketplace B2B Carrefour
 * 
 * Formulario de dirección de envío para checkout
 * Incluye validación en tiempo real y formato español
 */

'use client'

import { useEffect, useState } from 'react'
import { getCustomer, type MercurCustomerAddress } from '@/lib/api/mercur-store-client'
import { validateShippingAddress } from '@/lib/api/checkout-client'
import type { ShippingAddress, AddressValidationErrors } from '@/types/checkout'
import { Loader2, MapPin } from 'lucide-react'

interface AddressFormProps {
  initialAddress?: ShippingAddress
  onSubmit: (address: ShippingAddress) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function AddressForm({
  initialAddress,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<MercurCustomerAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initialAddress?.id || null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [formData, setFormData] = useState<ShippingAddress>(
    initialAddress || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      postalCode: '',
      countryCode: 'ES',
      phone: '',
    }
  )

  const [errors, setErrors] = useState<AddressValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadSavedAddresses = async () => {
      try {
        const customer = await getCustomer()
        const addresses = customer.shipping_addresses || []

        setSavedAddresses(addresses)

        if (!initialAddress && addresses.length > 0) {
          setSelectedAddressId(addresses[0].id)
        }
      } catch (error) {
        console.error('Error loading franchisee addresses:', error)
      } finally {
        setLoadingAddresses(false)
      }
    }

    loadSavedAddresses()
  }, [initialAddress])

  const mapSavedAddressToShippingAddress = (address: MercurCustomerAddress): ShippingAddress => ({
    id: address.id,
    firstName: address.first_name || '',
    lastName: address.last_name || '',
    first_name: address.first_name || '',
    last_name: address.last_name || '',
    company: typeof address.metadata?.store_name === 'string' ? address.metadata.store_name : '',
    address1: address.address_1 || '',
    address2: address.address_2 || '',
    address_1: address.address_1 || '',
    address_2: address.address_2 || '',
    city: address.city || '',
    province: address.province || '',
    postalCode: address.postal_code || '',
    postal_code: address.postal_code || '',
    countryCode: (address.country_code || 'ES').toUpperCase(),
    country_code: (address.country_code || 'ES').toUpperCase(),
    phone: address.phone || '',
    metadata: address.metadata || undefined,
  })

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: keyof ShippingAddress) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (savedAddresses.length > 0 && selectedAddressId) {
      const selectedAddress = savedAddresses.find(address => address.id === selectedAddressId)

      if (selectedAddress) {
        onSubmit(mapSavedAddressToShippingAddress(selectedAddress))
        return
      }
    }

    // Validate all fields
    const validationErrors = validateShippingAddress(formData)
    
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

  const showError = (field: keyof ShippingAddress) => {
    return touched[field] && errors[field]
  }

  if (loadingAddresses) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando direcciones del franquiciado...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedAddresses.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Selecciona la dirección de entrega</h3>
            <p className="mt-1 text-sm text-gray-600">
              Mostramos las direcciones guardadas para esta franquicia en la base de datos.
            </p>
          </div>

          <div className="space-y-3">
            {savedAddresses.map((address) => {
              const isSelected = selectedAddressId === address.id

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => setSelectedAddressId(address.id)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-4 w-4 rounded-full border ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                      <div className={`m-[3px] h-2 w-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-transparent'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {address.metadata?.store_name || 'Dirección de tienda'}
                        </span>
                        {address.metadata?.store_code && (
                          <span className="text-sm text-gray-500">({address.metadata.store_code})</span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>{address.first_name} {address.last_name}</p>
                        <p>{address.address_1}</p>
                        {address.address_2 && <p>{address.address_2}</p>}
                        <p>
                          {address.postal_code} {address.city}
                          {address.province ? `, ${address.province}` : ''}
                        </p>
                        {address.phone && <p>{address.phone}</p>}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !selectedAddressId}
              className="ml-auto rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Continuar al pago'}
            </button>
          </div>
        </div>
      )}

      {savedAddresses.length === 0 && (
      <>
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Información de contacto</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              className={`mt-1 block w-full rounded-md border ${
                showError('firstName') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('firstName') && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              className={`mt-1 block w-full rounded-md border ${
                showError('lastName') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('lastName') && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Company */}
        <div className="mt-4">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
            placeholder="Nombre de tu franquicia Carrefour"
            className={`mt-1 block w-full rounded-md border ${
              showError('company') ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            disabled={isSubmitting}
          />
          {showError('company') && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mt-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="+34 600 123 456"
            className={`mt-1 block w-full rounded-md border ${
              showError('phone') ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            disabled={isSubmitting}
          />
          {showError('phone') && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Dirección de envío</h3>
        
        {/* Address Line 1 */}
        <div className="mt-4">
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address1"
            value={formData.address1}
            onChange={e => handleChange('address1', e.target.value)}
            onBlur={() => handleBlur('address1')}
            placeholder="Calle y número"
            className={`mt-1 block w-full rounded-md border ${
              showError('address1') ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            disabled={isSubmitting}
          />
          {showError('address1') && (
            <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="mt-4">
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
            Dirección adicional <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            id="address2"
            value={formData.address2 || ''}
            onChange={e => handleChange('address2', e.target.value)}
            placeholder="Piso, puerta, etc."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* City, Province, Postal Code */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={e => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={`mt-1 block w-full rounded-md border ${
                showError('city') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('city') && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
              Provincia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="province"
              value={formData.province}
              onChange={e => handleChange('province', e.target.value)}
              onBlur={() => handleBlur('province')}
              className={`mt-1 block w-full rounded-md border ${
                showError('province') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('province') && (
              <p className="mt-1 text-sm text-red-600">{errors.province}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Código Postal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              onBlur={() => handleBlur('postalCode')}
              placeholder="28001"
              maxLength={5}
              className={`mt-1 block w-full rounded-md border ${
                showError('postalCode') ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {showError('postalCode') && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country (fixed to Spain for B2B) */}
        <div className="mt-4">
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
            País
          </label>
          <input
            type="text"
            id="countryCode"
            value="España"
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Solo realizamos envíos dentro de España
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Continuar al pago'}
        </button>
      </div>
      </>
      )}
    </form>
  )
}
