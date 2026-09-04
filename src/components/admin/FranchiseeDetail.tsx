'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, FranchiseeStats } from '@/types/franchisees';
import { isFranchiseeBillingEnabled } from '@/lib/config/franchisee-billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseeStatusBadge } from './FranchiseeStatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Clock,
  FileText,
  RefreshCw,
} from 'lucide-react';

interface FranchiseeDetailProps {
  franchiseeId: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function FranchiseeDetail({ franchiseeId }: FranchiseeDetailProps) {
  const router = useRouter();
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [stats, setStats] = useState<FranchiseeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusDraft, setStatusDraft] = useState<NonNullable<Franchisee['metadata']['status']>>('active');

  const currentStatus = franchisee?.status || franchisee?.metadata?.status || 'inactive';
  const currentSubscription = franchisee?.subscription_status || franchisee?.metadata?.subscription_status || 'not_configured';
  const onboardingStatus = franchisee?.metadata?.onboarding_status || 'pending_approval';
  const approvalRequiresActiveSubscription = isFranchiseeBillingEnabled;
  const subscriptionActive = currentSubscription === 'active';
  const canApprove = currentStatus === 'pending_approval' && (!approvalRequiresActiveSubscription || subscriptionActive);

  const loadFranchisee = async () => {
    try {
      setLoading(true);
      setError(null);

      const [franchiseeResponse, statsResponse] = await Promise.all([
        franchiseesApi.getFranchisee({ id: franchiseeId }),
        franchiseesApi.getFranchiseeStats(franchiseeId),
      ]);

      const loaded = franchiseeResponse.data?.franchisee || franchiseeResponse.data?.customer;
      if (loaded) {
        setFranchisee(loaded);
        setStatusDraft(loaded.status || loaded.metadata?.status || 'inactive');
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
      `¿Estás seguro de que deseas eliminar a ${franchisee.name || franchisee.company_name || franchisee.email}?\n\nEsta acción no se puede deshacer.`
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

  const handleApprove = async () => {
    if (!franchisee) return;

    if (approvalRequiresActiveSubscription && !subscriptionActive) {
      alert('No se puede aprobar hasta que la suscripción esté activa.');
      return;
    }

    try {
      setApproving(true);
      await franchiseesApi.updateFranchiseeStatus(franchisee.id, 'active');
      await loadFranchisee();
    } catch (err) {
      console.error('Error approving franchisee:', err);
      alert('Error al aprobar franquiciado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setApproving(false);
    }
  };

  const handleSaveStatus = async () => {
    if (!franchisee || statusDraft === currentStatus) {
      return;
    }

    try {
      setSavingStatus(true);
      await franchiseesApi.updateFranchiseeStatus(franchisee.id, statusDraft);
      await loadFranchisee();
    } catch (err) {
      console.error('Error saving status:', err);
      alert('Error al guardar el estado: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setSavingStatus(false);
    }
  };

  const onboardingStatusLabel = (() => {
    switch (onboardingStatus) {
      case 'pending_payment':
        return 'Pendiente de pago';
      case 'pending_approval':
        return 'Pendiente de aprobación';
      case 'approved_pending_credentials':
        return 'Aprobado, falta activar credenciales';
      case 'credentials_sent':
        return 'Email de activación enviado';
      case 'active':
        return 'Onboarding completado';
      default:
        return 'Pendiente de aprobación';
    }
  })();

  const subscriptionBlockMessage = (() => {
    switch (currentSubscription) {
      case 'pending':
        return 'La aprobación está bloqueada: la suscripción inicial todavía no se ha activado.';
      case 'past_due':
        return 'La aprobación está bloqueada: la suscripción tiene un pago vencido y debe regularizarse antes de activar al franquiciado.';
      case 'canceled':
        return 'La aprobación está bloqueada: la suscripción fue cancelada y debe reactivarse antes de activar al franquiciado.';
      default:
        return 'La aprobación está bloqueada hasta que la suscripción inicial esté activa.';
    }
  })();

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/franchisees">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{franchisee.name || franchisee.company_name || franchisee.metadata.company_name}</h1>
            <p className="text-muted-foreground mt-1">
              {franchisee.contact_person || `${franchisee.first_name || ''} ${franchisee.last_name || ''}`.trim() || franchisee.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadFranchisee}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          {currentStatus === 'pending_approval' && (
            <Button onClick={handleApprove} disabled={approving || !canApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {approving ? 'Aprobando...' : 'Aprobar Franquiciado'}
            </Button>
          )}
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

      <div className="flex flex-wrap gap-2">
        <FranchiseeStatusBadge
          isActive={currentStatus === 'active'}
          status={currentStatus}
        />
        <Badge variant="outline">Suscripción: {currentSubscription}</Badge>
        <Badge variant="secondary">Onboarding: {onboardingStatusLabel}</Badge>
        {franchisee.has_account && (
          <Badge variant="outline">
            <Mail className="h-3 w-3 mr-1" />
            Cuenta activa
          </Badge>
        )}
      </div>

      {approvalRequiresActiveSubscription && currentStatus === 'pending_approval' && !subscriptionActive && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {subscriptionBlockMessage}
        </div>
      )}

      {onboardingStatus === 'approved_pending_credentials' && !franchisee.has_account && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          El franquiciado ya está aprobado, pero todavía falta enviar o completar la activación de credenciales.
        </div>
      )}

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
                {stats.orders_by_status.pending || 0} pendientes
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
              <CardDescription>Estado de Suscripción</CardDescription>
              <CardTitle className="text-lg">{currentSubscription}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Building2 className="h-3 w-3 mr-1" />
                Estado operativo del alta
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

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
          <TabsTrigger value="stores">Tiendas</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre comercial</p>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{franchisee.name || franchisee.company_name || franchisee.metadata.company_name || '-'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Razón social</p>
                <p className="font-medium">{franchisee.company_name || franchisee.metadata.company_name || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Persona de contacto</p>
                <p className="font-medium">{franchisee.contact_person || `${franchisee.first_name || ''} ${franchisee.last_name || ''}`.trim() || '-'}</p>
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
                <p className="text-sm text-muted-foreground">CIF/NIF</p>
                <p className="font-medium">{franchisee.tax_id || franchisee.metadata.tax_id || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Región</p>
                <p className="font-medium">{franchisee.region || franchisee.metadata.region || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Municipio</p>
                <p className="font-medium">{franchisee.municipality || franchisee.metadata.municipality || '-'}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{franchisee.address || franchisee.metadata.address || '-'}</p>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
              <CardDescription>
                El contrato canónico confirma el cambio de estado por `PATCH /admin/franchisees/:id/status`. Las notas internas siguen sin una ruta confirmada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Estado actual</p>
                <Select value={statusDraft} onValueChange={(value) => setStatusDraft(value as typeof statusDraft)}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_approval">Pendiente de aprobación</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2 rounded-lg border p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Estado de onboarding</p>
                  <p className="font-medium">{onboardingStatusLabel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado de suscripción</p>
                  <p className="font-medium">{currentSubscription}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Próxima renovación</p>
                  <p className="font-medium">{formatDate(franchisee.metadata.current_period_end)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Notas internas disponibles</p>
                <Textarea
                  value={franchisee.metadata.notes || ''}
                  readOnly
                  className="min-h-[120px]"
                  placeholder="No hay notas en el contrato confirmado"
                />
              </div>

              <Button onClick={handleSaveStatus} disabled={savingStatus || statusDraft === currentStatus}>
                {savingStatus ? 'Guardando...' : 'Guardar Estado'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tiendas y direcciones</CardTitle>
              <CardDescription>
                El backend ha validado el autoservicio `/franchisee/stores`, pero la edición admin de direcciones sigue pendiente de un contrato explícito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!franchisee.shipping_addresses || franchisee.shipping_addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay tiendas o direcciones expuestas por este recurso</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {franchisee.shipping_addresses.map((address) => (
                    <div key={address.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium">{address.company || address.first_name || 'Tienda'}</p>
                          {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
                        </div>
                        <Badge variant="outline">Solo lectura</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>{address.address_1}</p>
                        {address.address_2 && <p>{address.address_2}</p>}
                        <p>{address.postal_code} {address.city}</p>
                        <p>{address.province}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                <p className="text-muted-foreground">La vista detallada de pedidos sigue dependiendo del módulo orders.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
