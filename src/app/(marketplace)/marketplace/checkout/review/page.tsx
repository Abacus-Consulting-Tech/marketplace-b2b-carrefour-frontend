'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Package, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useCheckoutStore } from '@/lib/store/checkout';
import { useAuthStore } from '@/lib/store/auth';
import { CheckoutStepIndicator } from '@/components/checkout/CheckoutStepIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items } = useCartStore();
  const { deliveryAddress, paymentMethod, setPaymentMethod, termsAccepted, setTermsAccepted, setCurrentStep } = useCheckoutStore();
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentStep(2);

    // Redirigir si no hay dirección
    if (!deliveryAddress) {
      router.push('/marketplace/checkout');
      return;
    }

    // Redirigir si no hay items
    if (items.length === 0) {
      router.push('/marketplace/cart');
    }
  }, [deliveryAddress, items.length, router, setCurrentStep]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.21;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  // Agrupar items por proveedor (usando el primer carácter del productId como mock)
  const itemsBySupplier = items.reduce((acc, item) => {
    // En producción esto vendría del producto
    const supplierName = item.productId.startsWith('p') ? 'Aceites del Sur' : 'Ibéricos Premium';
    if (!acc[supplierName]) {
      acc[supplierName] = [];
    }
    acc[supplierName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleProceedToPayment = async () => {
    if (!paymentMethod) {
      toast({
        title: 'Método de pago requerido',
        description: 'Por favor, selecciona un método de pago',
        variant: 'destructive',
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: 'Términos y condiciones',
        description: 'Debes aceptar los términos y condiciones para continuar',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento
    setTimeout(() => {
      router.push('/marketplace/checkout/payment');
    }, 500);
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!deliveryAddress || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revisar Pedido</h1>
        <p className="text-gray-600 mt-1">
          Verifica que todo esté correcto antes de proceder al pago
        </p>
      </div>

      {/* Step Indicator */}
      <CheckoutStepIndicator currentStep={2} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{deliveryAddress.fullName}</p>
                <p className="text-gray-600">{deliveryAddress.address}</p>
                <p className="text-gray-600">
                  {deliveryAddress.postalCode} {deliveryAddress.city}, {deliveryAddress.province}
                </p>
                <p className="text-gray-600">{deliveryAddress.country}</p>
                <p className="text-gray-600">Tel: {deliveryAddress.phone}</p>
                {deliveryAddress.additionalInfo && (
                  <p className="text-sm text-gray-500 mt-2">
                    Nota: {deliveryAddress.additionalInfo}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => router.push('/marketplace/checkout')}
              >
                Cambiar Dirección
              </Button>
            </CardContent>
          </Card>

          {/* Order Items by Supplier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos ({items.length})
              </CardTitle>
              <CardDescription>
                Tu pedido se enviará en {Object.keys(itemsBySupplier).length} paquete(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(itemsBySupplier).map(([supplierName, supplierItems]) => (
                  <div key={supplierName} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-sm">Paquete de {supplierName}</h3>
                    </div>
                    <div className="space-y-3">
                      {supplierItems.map((item) => (
                        <div key={item.productId} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod || ''} onValueChange={(value) => setPaymentMethod(value as 'tarjeta' | 'transferencia')}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Tarjeta de Crédito/Débito</p>
                      <p className="text-sm text-gray-500">Pago seguro con tarjeta</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Transferencia Bancaria</p>
                      <p className="text-sm text-gray-500">Recibirás las instrucciones por email</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  Acepto los{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    política de privacidad
                  </a>
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">{tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">{total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full"
                  disabled={isProcessing || !paymentMethod || !termsAccepted}
                >
                  {isProcessing ? (
                    'Procesando...'
                  ) : (
                    <>
                      Proceder al Pago
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/marketplace/checkout')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>

              {(!paymentMethod || !termsAccepted) && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">
                    {!paymentMethod && 'Selecciona un método de pago. '}
                    {!termsAccepted && 'Acepta los términos y condiciones.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
