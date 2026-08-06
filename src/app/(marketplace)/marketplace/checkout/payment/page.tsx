'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useCheckoutStore } from '@/lib/store/checkout';
import { useAuthStore } from '@/lib/store/auth';
import { CheckoutStepIndicator } from '@/components/checkout/CheckoutStepIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, clearCart } = useCartStore();
  const { deliveryAddress, paymentMethod, resetCheckout, setCurrentStep } = useCheckoutStore();
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Campos del formulario de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCurrentStep(3);

    // Redirigir si falta información
    if (!deliveryAddress || !paymentMethod) {
      router.push('/marketplace/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/marketplace/cart');
    }
  }, [deliveryAddress, paymentMethod, items.length, router, setCurrentStep]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 dígitos + 3 espacios
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleProcessPayment = async () => {
    // Validar campos si es pago con tarjeta
    if (paymentMethod === 'tarjeta') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          title: 'Campos incompletos',
          description: 'Por favor, completa todos los campos de la tarjeta',
          variant: 'destructive',
        });
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          title: 'Número de tarjeta inválido',
          description: 'El número de tarjeta debe tener 16 dígitos',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simular procesamiento de pago (2 segundos)
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Crear pedido mock y limpiar carrito
      setTimeout(() => {
        clearCart();
        resetCheckout();
        router.push('/marketplace/checkout/success');
      }, 1500);
    }, 2000);
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!deliveryAddress || !paymentMethod || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pago</h1>
        <p className="text-gray-600 mt-1">Último paso para completar tu pedido</p>
      </div>

      {/* Step Indicator */}
      <CheckoutStepIndicator currentStep={3} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {paymentMethod === 'tarjeta' ? 'Pago con Tarjeta' : 'Transferencia Bancaria'}
              </CardTitle>
              <CardDescription>
                {paymentMethod === 'tarjeta'
                  ? 'Introduce los datos de tu tarjeta de forma segura'
                  : 'Recibirás las instrucciones de pago por email'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethod === 'tarjeta' ? (
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      disabled={isProcessing || paymentSuccess}
                    />
                  </div>

                  {/* Card Name */}
                  <div>
                    <Label htmlFor="cardName">Nombre del Titular</Label>
                    <Input
                      id="cardName"
                      placeholder="JUAN PÉREZ"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      disabled={isProcessing || paymentSuccess}
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        disabled={isProcessing || paymentSuccess}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        maxLength={3}
                        type="password"
                        disabled={isProcessing || paymentSuccess}
                      />
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      🔒 Tu información está protegida con cifrado SSL de 256 bits
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Instrucciones de Pago</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Beneficiario:</span> Marketplace B2B Carrefour
                      </p>
                      <p>
                        <span className="font-medium">IBAN:</span> ES12 1234 5678 9012 3456 7890
                      </p>
                      <p>
                        <span className="font-medium">Concepto:</span> Pedido #{Date.now().toString().slice(-8)}
                      </p>
                      <p>
                        <span className="font-medium">Importe:</span> {total.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tu pedido se confirmará cuando recibamos el pago. Recibirás un email con todos los
                    detalles.
                  </p>
                </div>
              )}

              {/* Payment Success Animation */}
              {paymentSuccess && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-900">¡Pago Procesado!</h3>
                  <p className="text-sm text-green-700 mt-1">Redirigiendo a la confirmación...</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 pt-6 border-t">
                <Button
                  onClick={handleProcessPayment}
                  className="w-full"
                  disabled={isProcessing || paymentSuccess}
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando Pago...
                    </>
                  ) : paymentSuccess ? (
                    'Pago Completado'
                  ) : (
                    `Pagar ${total.toFixed(2)} €`
                  )}
                </Button>
                {!paymentSuccess && (
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => router.push('/marketplace/checkout/review')}
                    disabled={isProcessing}
                  >
                    Volver
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos ({items.length})</span>
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

              {/* Delivery Address */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Envío a:</h4>
                <p className="text-sm text-gray-600">{deliveryAddress.fullName}</p>
                <p className="text-sm text-gray-600">{deliveryAddress.address}</p>
                <p className="text-sm text-gray-600">
                  {deliveryAddress.postalCode} {deliveryAddress.city}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
