'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockApi } from '@/lib/api/mock';
import { Order, OrderStatus } from '@/types';
import Image from 'next/image';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-4 h-4" />,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  in_preparation: {
    label: 'En Preparación',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="w-4 h-4" />,
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <Clock className="w-4 h-4" />,
  },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.orders.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pedido no encontrado
            </h3>
            <Button onClick={() => router.push('/marketplace/orders')} className="mt-4">
              Volver a Mis Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agrupar items por proveedor
  const itemsBySupplier = order.items.reduce((acc, item) => {
    if (!acc[item.supplierName]) {
      acc[item.supplierName] = [];
    }
    acc[item.supplierName].push(item);
    return acc;
  }, {} as Record<string, typeof order.items>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/marketplace/orders')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Pedidos
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedido {order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Realizado el {formatDate(order.createdAt)}</p>
          </div>
          <Badge className={`${STATUS_CONFIG[order.status].color} flex items-center gap-1 w-fit`}>
            {STATUS_CONFIG[order.status].icon}
            {STATUS_CONFIG[order.status].label}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos
              </CardTitle>
              <CardDescription>
                {order.items.length} producto(s) en {Object.keys(itemsBySupplier).length} paquete(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(itemsBySupplier).map(([supplierName, supplierItems]) => (
                  <div key={supplierName} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-sm">Paquete de {supplierName}</h3>
                    </div>
                    <div className="space-y-4">
                      {supplierItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            {item.productImage && (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                            <p className="text-sm text-gray-500">
                              Precio unitario: {item.unitPrice.toFixed(2)} €
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.subtotal.toFixed(2)} €</p>
                            <p className="text-xs text-gray-500">
                              + {item.tax.toFixed(2)} € IVA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.postalCode} {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-gray-600">Tel: {order.shippingAddress.phone}</p>
                {order.shippingAddress.additionalInfo && (
                  <p className="text-sm text-gray-500 mt-2">
                    Nota: {order.shippingAddress.additionalInfo}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Número de Seguimiento</p>
                    <p className="font-mono font-medium">{order.trackingNumber}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha Estimada de Entrega</p>
                      <p className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          {/* Order Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{order.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">{order.tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">
                    {order.shippingCost === 0 ? 'Gratis' : `${order.shippingCost.toFixed(2)} €`}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {order.total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-sm">Método de Pago</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {order.paymentMethod === 'tarjeta'
                    ? 'Tarjeta de Crédito/Débito'
                    : 'Transferencia Bancaria'}
                </p>
                <Badge
                  className={`mt-2 ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                </Badge>
              </div>

              {/* Order Dates */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Pedido realizado</p>
                    <p className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                {order.deliveredAt && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Entregado</p>
                      <p className="text-sm font-medium">
                        {new Date(order.deliveredAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  <FileText className="w-4 h-4 mr-2" />
                  Descargar Factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
