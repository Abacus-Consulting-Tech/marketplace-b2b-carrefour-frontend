'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, FranchiseeStats } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseeStatusBadge, DiscountTierBadge } from './FranchiseeStatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Euro,
  Clock,
  FileText,
  RefreshCw,
} from 'lucide-react';

interface FranchiseeDetailProps {
  franchiseeId: string;
}

export default function FranchiseeDetail({ franchiseeId }: FranchiseeDetailProps) {
  const router = useRouter();
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [stats, setStats] = useState<FranchiseeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadFranchisee = async () => {
    try {
      setLoading(true);
      setError(null);

      const [franchiseeResponse, statsResponse] = await Promise.all([
        franchiseesApi.getFranchisee({ id: franchiseeId, expand: 'groups,shipping_addresses' }),
        franchiseesApi.getFranchiseeStats(franchiseeId),
      ]);

      if (franchiseeResponse.data?.customer) {
        setFranchisee(franchiseeResponse.data.customer);
      }

      if (statsResponse.data?.stats) {
        setStats(statsResponse.data.stats);
      }
    } catch (err) {
      console.error('Error loading franchisee:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar franquiciado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFranchisee();
  }, [franchiseeId]);

  const handleDelete = async () => {
    if (!franchisee) return;
    
    const confirmed = confirm(
      `¿Estás seguro de que deseas eliminar a ${franchisee.metadata?.company_name}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await franchiseesApi.deleteFranchisee(franchisee.id);
      router.push('/admin/franchisees');
    } catch (err) {
      console.error('Error deleting franchisee:', err);
      alert('Error al eliminar franquiciado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !franchisee) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <FileText className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error al cargar franquiciado</h2>
        <p className="text-muted-foreground mb-4">{error || 'Franquiciado no encontrado'}</p>
        <Link href="/admin/franchisees">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Listado
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/franchisees">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{franchisee.metadata?.company_name}</h1>
            <p className="text-muted-foreground mt-1">
              {franchisee.first_name} {franchisee.last_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadFranchisee}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Link href={`/admin/franchisees/${franchisee.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      {/* Status & Tier */}
      <div className="flex gap-2">
        <FranchiseeStatusBadge isActive={franchisee.metadata?.is_active || false} />
        <DiscountTierBadge tier={franchisee.metadata?.discount_tier} />
        {franchisee.has_account && (
          <Badge variant="outline">
            <Mail className="h-3 w-3 mr-1" />
            Cuenta Activa
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pedidos</CardDescription>
              <CardTitle className="text-2xl">{stats.total_orders}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <ShoppingCart className="h-3 w-3 mr-1" />
                {stats.orders_by_status.pending} pendientes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Gastado</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.total_spent)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                Ticket medio: {formatCurrency(stats.average_order_value)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Crédito Disponible</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(
                  ((franchisee?.metadata?.credit_limit as number) || 0) - (stats?.total_spent || 0)
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Euro className="h-3 w-3 mr-1" />
                Límite: {formatCurrency((franchisee?.metadata?.credit_limit as number) || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Último Pedido</CardDescription>
              <CardTitle className="text-sm">
                {stats.last_order_date ? formatDate(stats.last_order_date) : 'Sin pedidos'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {stats.last_order_date
                  ? `Hace ${Math.floor((new Date().getTime() - new Date(stats.last_order_date).getTime()) / (1000 * 60 * 60 * 24))} días`
                  : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="addresses">Direcciones</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="config">Configuración B2B</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">
                      {franchisee.first_name} {franchisee.last_name}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${franchisee.email}`} className="font-medium hover:underline">
                      {franchisee.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{franchisee.phone || '-'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{franchisee.metadata?.company_name || '-'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CIF/NIF</p>
                  <p className="font-medium">{franchisee.metadata?.tax_id || '-'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiendas registradas</p>
                  <p className="font-medium">{franchisee.shipping_addresses?.length || 0}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Creado</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{formatDate(franchisee.created_at)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Actualizado</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{formatDate(franchisee.updated_at)}</p>
                  </div>
                </div>
              </div>

              {franchisee.metadata?.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Notas Internas</p>
                  <p className="text-sm">{franchisee.metadata.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tiendas</CardTitle>
                <Button size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Añadir Tienda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!franchisee.shipping_addresses || franchisee.shipping_addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay tiendas registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {franchisee.shipping_addresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{address.company || address.first_name}</p>
                          {address.phone && (
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>{address.address_1}</p>
                        {address.address_2 && <p>{address.address_2}</p>}
                        <p>
                          {address.postal_code} {address.city}
                        </p>
                        <p>{address.province}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>
                Total: {stats?.total_orders || 0} pedidos por {formatCurrency(stats?.total_spent || 0)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Historial de pedidos próximamente
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* B2B Config Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración B2B</CardTitle>
              <CardDescription>Condiciones comerciales y descuentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nivel de Descuento</p>
                  <DiscountTierBadge tier={franchisee.metadata?.discount_tier} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Límite de Crédito</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(franchisee.metadata?.credit_limit || 0)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Días de Pago</p>
                  <p className="font-medium text-lg">
                    {franchisee.metadata?.payment_terms || 30} días
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Crédito Disponible</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(
                      ((franchisee?.metadata?.credit_limit as number) || 0) - (stats?.total_spent || 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
