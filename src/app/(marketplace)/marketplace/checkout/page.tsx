'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useCheckoutStore, DeliveryAddress } from '@/lib/store/checkout';
import { CheckoutStepIndicator } from '@/components/checkout/CheckoutStepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const addressSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es obligatoria'),
  province: z.string().min(2, 'La provincia es obligatoria'),
  postalCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  country: z.string().default('España'),
  additionalInfo: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { deliveryAddress, setDeliveryAddress, setCurrentStep } = useCheckoutStore();
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DeliveryAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues: deliveryAddress || {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'España',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
    setCurrentStep(1);

    // Si no hay items en el carrito, redirigir
    if (items.length === 0) {
      router.push('/marketplace/cart');
    }

    // Cargar dirección guardada si existe
    if (deliveryAddress) {
      Object.keys(deliveryAddress).forEach((key) => {
        setValue(key as keyof DeliveryAddress, deliveryAddress[key as keyof DeliveryAddress]);
      });
    }
  }, [items.length, router, setCurrentStep, deliveryAddress, setValue]);

  const onSubmit = (data: DeliveryAddress) => {
    setDeliveryAddress(data);
    router.push('/marketplace/checkout/review');
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        <p className="text-gray-600 mt-1">
          Completa tu pedido en 3 sencillos pasos
        </p>
      </div>

      {/* Step Indicator */}
      <CheckoutStepIndicator currentStep={1} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dirección de Entrega</CardTitle>
              <CardDescription>
                Introduce la dirección donde deseas recibir tu pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre Completo */}
                <div>
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Juan Pérez García"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <Label htmlFor="phone">Teléfono de Contacto *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="666 123 456"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Dirección */}
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Calle Principal, 123, 2º A"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Ciudad y Provincia */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Madrid"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="province">Provincia *</Label>
                    <Input
                      id="province"
                      {...register('province')}
                      placeholder="Madrid"
                    />
                    {errors.province && (
                      <p className="text-sm text-red-600 mt-1">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                {/* Código Postal y País */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Input
                      id="postalCode"
                      {...register('postalCode')}
                      placeholder="28001"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      defaultValue="España"
                      disabled
                    />
                  </div>
                </div>

                {/* Información Adicional */}
                <div>
                  <Label htmlFor="additionalInfo">Información Adicional (opcional)</Label>
                  <Input
                    id="additionalInfo"
                    {...register('additionalInfo')}
                    placeholder="Portal, timbre, instrucciones de entrega..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/marketplace/cart')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Carrito
                  </Button>
                  <Button type="submit">
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">
                    {(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.21).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.21).toFixed(2)} €
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Los productos se agruparán por proveedor y podrían llegar en envíos separados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
