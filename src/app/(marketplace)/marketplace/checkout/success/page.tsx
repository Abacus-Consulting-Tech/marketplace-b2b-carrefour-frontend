'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Package, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cart';
import { useCheckoutStore } from '@/lib/store/checkout';
import { useAuthStore } from '@/lib/store/auth';
import { mockApi } from '@/lib/api/mock';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { deliveryAddress, paymentMethod, resetCheckout } = useCheckoutStore();
  const { user } = useAuthStore();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const orderCreated = useRef(false);
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 días hábiles
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  useEffect(() => {
    // Scroll al inicio
    window.scrollTo(0, 0);
    
    // Solo crear el pedido una vez
    if (orderCreated.current) return;
    orderCreated.current = true;
    
    // Crear el pedido antes de limpiar el carrito
    const createOrder = async () => {
      // Verificar que tenemos todos los datos necesarios
      if (!items.length || !deliveryAddress || !paymentMethod || !user) {
        console.error('Missing data for order creation');
        return;
      }

      try {
        // Preparar los items del pedido
        const orderItems = items.map((item, index) => ({
          id: String(index + 1),
          productId: item.productId,
          productName: item.name,
          productImage: item.image || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
          supplierId: '3', // Mock supplier ID
          supplierName: 'Proveedor', // Mock supplier name
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
          tax: item.price * item.quantity * 0.21,
        }));

        // Calcular totales
        const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = orderItems.reduce((sum, item) => sum + item.tax, 0);
        const total = subtotal + tax;

        // Crear el pedido
        const orderData = {
          franchiseeId: user.id,
          franchiseeName: user.name,
          items: orderItems,
          subtotal,
          tax,
          shippingCost: 0,
          total,
          currency: 'EUR',
          shippingAddress: deliveryAddress,
          paymentMethod,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        const response = await mockApi.orders.create(orderData);
        
        if (response.data?.orderNumber) {
          setOrderNumber(response.data.orderNumber);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

    // Crear pedido y luego limpiar
    createOrder().then(() => {
      setTimeout(() => {
        clearCart();
        resetCheckout();
      }, 100);
    });
  }, [items, deliveryAddress, paymentMethod, user, clearCart, resetCheckout]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
        <p className="text-xl text-gray-600">
          Gracias por tu compra. Tu pedido se ha procesado correctamente.
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Número de Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {orderNumber || 'Procesando...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Guarda este número para hacer seguimiento de tu pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Entrega Estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900 capitalize">{estimatedDelivery}</p>
            <p className="text-sm text-gray-500 mt-1">
              Recibirás una notificación cuando se envíe tu pedido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>¿Qué Sigue Ahora?</CardTitle>
          <CardDescription>
            Hemos enviado un email de confirmación con todos los detalles de tu pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Confirmación por Email</h4>
                <p className="text-sm text-gray-600">
                  Revisa tu bandeja de entrada. Te hemos enviado el resumen completo de tu pedido.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Preparación del Pedido</h4>
                <p className="text-sm text-gray-600">
                  Los proveedores comenzarán a preparar tus productos. Recibirás actualizaciones en cada paso.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Envío y Entrega</h4>
                <p className="text-sm text-gray-600">
                  Cuando tu pedido sea enviado, recibirás el número de seguimiento para rastrear tu paquete.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pedidos Múltiples</h4>
              <p className="text-sm text-blue-800">
                Tu pedido contiene productos de diferentes proveedores y podría llegar en envíos
                separados. Recibirás un número de seguimiento para cada paquete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={() => router.push('/marketplace/orders')}>
          <FileText className="w-4 h-4 mr-2" />
          Ver Mis Pedidos
        </Button>
        <Button size="lg" variant="outline" onClick={() => router.push('/marketplace')}>
          <Home className="w-4 h-4 mr-2" />
          Volver al Marketplace
        </Button>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center border-t pt-8">
        <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas Ayuda?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Si tienes alguna pregunta sobre tu pedido, estamos aquí para ayudarte
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <a href="mailto:soporte@carrefour.com" className="text-blue-600 hover:underline">
            soporte@carrefour.com
          </a>
          <span className="hidden sm:inline text-gray-400">|</span>
          <a href="tel:900123456" className="text-blue-600 hover:underline">
            900 123 456
          </a>
        </div>
      </div>
    </div>
  );
}
