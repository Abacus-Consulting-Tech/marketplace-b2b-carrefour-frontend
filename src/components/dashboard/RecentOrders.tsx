'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
}

interface RecentOrdersProps {
  orders: Order[];
  basePath?: string; // e.g., '/marketplace/orders' or '/supplier/orders'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_preparation: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_preparation: 'En Preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export function RecentOrders({ orders, basePath = '/marketplace/orders' }: RecentOrdersProps) {
  const router = useRouter();
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedidos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No hay pedidos recientes</p>
            <Link href="/marketplace">
              <Button className="mt-4" size="sm">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Pedidos Recientes
        </CardTitle>
        <Link href={basePath} prefetch={false}>
          <Button variant="ghost" size="sm">
            Ver Todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => router.push(`${basePath}/${order.id}`)}
              className="block hover:no-underline cursor-pointer"
            >
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[order.status as keyof typeof statusColors]
                      }
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {order.itemCount} producto{order.itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {order.total.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
