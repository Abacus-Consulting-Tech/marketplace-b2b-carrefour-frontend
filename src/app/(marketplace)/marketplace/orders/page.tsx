'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, Eye, Truck, CheckCircle2, XCircle, Clock, Box } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockApi } from '@/lib/api/mock';
import { Order, OrderStatus } from '@/types';

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
    icon: <Box className="w-4 h-4" />,
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
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.orders.list(user?.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        <p className="text-gray-600 mt-1">Revisa el estado de tus pedidos y su historial</p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes pedidos todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices un pedido, aparecerá aquí
            </p>
            <Button onClick={() => router.push('/marketplace')}>
              Explorar Productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Pedido {order.orderNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${STATUS_CONFIG[order.status].color} flex items-center gap-1`}>
                      {STATUS_CONFIG[order.status].icon}
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Productos</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.subtotal.toFixed(2)} €</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          + {order.items.length - 3} producto(s) más
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Dirección de Envío</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.address}, {order.shippingAddress.postalCode}{' '}
                      {order.shippingAddress.city}
                    </p>
                  </div>

                  {/* Tracking Number */}
                  {order.trackingNumber && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Número de Seguimiento
                      </h4>
                      <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{order.total.toFixed(2)} €</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/marketplace/orders/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
