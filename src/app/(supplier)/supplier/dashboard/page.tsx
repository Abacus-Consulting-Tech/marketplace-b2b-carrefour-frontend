'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { useAuthStore } from '@/lib/store/auth';
import { mockApi } from '@/lib/api/mock';
import { 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OrderItem {
  supplierId?: string;
  subtotal?: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function SupplierDashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get all orders and filter for items from this supplier
        const response = await mockApi.orders.list();
        const allOrders = response.data || [];
        
        // Filter orders that contain items from this supplier
        const supplierOrders = allOrders.filter(order => 
          order.items?.some((item: OrderItem) => item.supplierId === user?.id || item.supplierId === '3')
        );
        
        setOrders(supplierOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const inPreparationOrders = orders.filter(o => o.status === 'in_preparation').length;
  
  // Calculate revenue (sum of items from this supplier)
  const totalRevenue = orders.reduce((sum, order) => {
    const supplierItems = order.items?.filter((item: OrderItem) => 
      item.supplierId === user?.id || item.supplierId === '3'
    ) || [];
    const orderRevenue = supplierItems.reduce((itemSum: number, item: OrderItem) => 
      itemSum + (item.subtotal || 0), 0
    );
    return sum + orderRevenue;
  }, 0);

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.items
        ?.filter((item: OrderItem) => item.supplierId === user?.id || item.supplierId === '3')
        .reduce((sum: number, item: OrderItem) => sum + (item.subtotal || 0), 0) || 0,
      createdAt: order.createdAt,
      itemCount: order.items?.filter((item: OrderItem) => 
        item.supplierId === user?.id || item.supplierId === '3'
      ).length || 0,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Proveedor
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona tus pedidos entrantes y monitoriza tu rendimiento
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pedidos Totales"
          value={totalOrders}
          description="Pedidos recibidos"
          icon={ShoppingBag}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pendientes de Aceptar"
          value={pendingOrders}
          description="Requieren acción"
          icon={AlertCircle}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="En Preparación"
          value={inPreparationOrders}
          description="Procesando ahora"
          icon={Package}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Ingresos"
          value={`${totalRevenue.toFixed(2)} €`}
          description="Este mes"
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend={
            totalOrders > 0
              ? { value: 15, isPositive: true }
              : undefined
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ) : (
            <RecentOrders orders={recentOrders} basePath="/marketplace/orders" />
          )}
        </div>

        {/* Order Status Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Estado de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600">Pendientes</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {pendingOrders}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">En Preparación</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {inPreparationOrders}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm text-gray-600">Enviados</span>
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {orders.filter(o => o.status === 'shipped').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Entregados</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {orders.filter(o => o.status === 'delivered').length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/supplier/openings">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  <span className="text-sm">Invitaciones de Apertura</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Gestiona tus Pedidos Eficientemente
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Acepta pedidos rápidamente, actualiza el estado de preparación y proporciona 
              información de seguimiento para mantener a tus clientes informados.
            </p>
            <a href="/supplier/orders" className="text-sm font-medium text-blue-600 hover:underline">
              Ver Todos los Pedidos →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
