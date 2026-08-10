'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuthStore } from '@/lib/store/auth';
import { mockApi } from '@/lib/api/mock';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  Package,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await mockApi.orders.list();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeSuppliers = 3; // Mock data - would come from API
  const pendingApprovals = 1; // Mock data - would come from API

  // Recent activity
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-1">
          Vista general de la plataforma Marketplace B2B
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`${totalRevenue.toFixed(2)} €`}
          description="Facturación del mes"
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Pedidos"
          value={totalOrders}
          description="Pedidos procesados"
          icon={ShoppingBag}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Proveedores Activos"
          value={activeSuppliers}
          description="Proveedores verificados"
          icon={Users}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Pendientes Aprobación"
          value={pendingApprovals}
          description="Requieren revisión"
          icon={AlertCircle}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  Ver Todo
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">
                            {order.franchiseeName} • {new Date(order.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {order.status === 'delivered' && 'Entregado'}
                          {order.status === 'shipped' && 'Enviado'}
                          {order.status === 'pending' && 'Pendiente'}
                          {!['delivered', 'shipped', 'pending'].includes(order.status) && order.status}
                        </Badge>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.total.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Sistema</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Pagos</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Activo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">API</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Mock Mode
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/suppliers">
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm">Aprobar Proveedores</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {pendingApprovals}
                  </Badge>
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm">Pedidos Pendientes</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {orders.filter(o => o.status === 'pending').length}
                  </Badge>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
