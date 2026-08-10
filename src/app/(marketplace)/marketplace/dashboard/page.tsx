'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuthStore } from '@/lib/store/auth';
import { mockApi } from '@/lib/api/mock';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

export default function FranchiseeDashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await mockApi.orders.list(user?.id);
        setOrders(response.data || []);
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
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      itemCount: order.items?.length || 0,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">
          Aquí está el resumen de tu actividad en el marketplace
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pedidos"
          value={totalOrders}
          description="Pedidos realizados"
          icon={Package}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={pendingOrders}
          description="En proceso"
          icon={ShoppingCart}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Total Gastado"
          value={`${totalSpent.toFixed(2)} €`}
          description="Este mes"
          icon={CreditCard}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend={
            totalOrders > 0
              ? { value: 12, isPositive: true }
              : undefined
          }
        />
        <StatCard
          title="Ticket Medio"
          value={`${averageOrderValue.toFixed(2)} €`}
          description="Por pedido"
          icon={TrendingUp}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
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
            <RecentOrders orders={recentOrders} />
          )}
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              ¿Necesitas hacer un pedido?
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Explora nuestro catálogo de productos de proveedores verificados.
              Envío gratuito en pedidos superiores a 500€.
            </p>
            <a href="/marketplace" className="text-sm font-medium text-blue-600 hover:underline">
              Ir al Catálogo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
