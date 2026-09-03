'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, FranchiseeStats } from '@/types/franchisees';
import { isFranchiseeBillingEnabled } from '@/lib/config/franchisee-billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseeStatusBadge, DiscountTierBadge } from './FranchiseeStatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  const [approving, setApproving] = useState(false);
  const [statusDraft, setStatusDraft] = useState<NonNullable<Franchisee['metadata']['status']>>('active');
  const [notesDraft, setNotesDraft] = useState('');
  const [savingStatusNotes, setSavingStatusNotes] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [savingStore, setSavingStore] = useState(false);
  const [newStore, setNewStore] = useState({
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
  });
  const approvalRequiresActiveSubscription = isFranchiseeBillingEnabled;
  const subscriptionActive = franchisee?.metadata?.subscription_status === 'active';
  const canApprove =
    franchisee?.metadata?.status === 'pending_approval' &&
    (!approvalRequiresActiveSubscription || subscriptionActive);

  const loadFranchisee = async () => {
    try {
      setLoading(true);
      setError(null);

      const [franchiseeResponse, statsResponse] = await Promise.all([
        franchiseesApi.getFranchisee({ id: franchiseeId, expand: 'groups,shipping_addresses' }),
        franchiseesApi.getFranchiseeStats(franchiseeId),
      ]);

      if (franchiseeResponse.data?.customer) {
        const customer = franchiseeResponse.data.customer;
        setFranchisee(customer);
        setStatusDraft(customer.metadata?.status || (customer.metadata?.is_active ? 'active' : 'inactive'));
        setNotesDraft(customer.metadata?.notes || '');
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

  const handleSaveStatusNotes = async () => {
    if (!franchisee) return;

    try {
      setSavingStatusNotes(true);

      if (statusDraft !== franchisee.metadata?.status) {
        await franchiseesApi.updateFranchiseeStatus(franchisee.id, statusDraft);
      }

      if (notesDraft !== (franchisee.metadata?.notes || '')) {
        await franchiseesApi.updateFranchisee(franchisee.id, { metadata: { notes: notesDraft } });
      }

      await loadFranchisee();
    } catch (err) {
      console.error('Error saving status/notes:', err);
      alert('Error al guardar: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setSavingStatusNotes(false);
    }
  };

  const handleAddStore = async () => {
    if (!franchisee) return;

    if (!newStore.company.trim() || !newStore.address_1.trim() || !newStore.city.trim() || !newStore.postal_code.trim()) {
      alert('Nombre, dirección, ciudad y código postal son obligatorios.');
      return;
    }

    const addressPayload = {
      company: newStore.company,
      address_1: newStore.address_1,
      address_2: newStore.address_2 || undefined,
      city: newStore.city,
      province: newStore.province || undefined,
      postal_code: newStore.postal_code,
      phone: newStore.phone || undefined,
      country_code: 'es',
    };

    try {
      setSavingStore(true);

      if (editingAddressId) {
        await franchiseesApi.updateAddress(franchisee.id, editingAddressId, addressPayload);
      } else {
        await franchiseesApi.addAddress(franchisee.id, { address: addressPayload });
      }

      await loadFranchisee();
      handleCloseStoreDialog();
    } catch (err) {
      console.error('Error saving store:', err);
      alert('Error al guardar tienda: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setSavingStore(false);
    }
  };

  const handleEditStore = (address: NonNullable<Franchisee['shipping_addresses']>[number]) => {
    setEditingAddressId(address.id);
    setNewStore({
      company: address.company || '',
      address_1: address.address_1 || '',
      address_2: address.address_2 || '',
      city: address.city || '',
      province: address.province || '',
      postal_code: address.postal_code || '',
      phone: address.phone || '',
    });
    setShowAddStore(true);
  };

  const handleCloseStoreDialog = () => {
    setShowAddStore(false);
    setEditingAddressId(null);
    setNewStore({ company: '', address_1: '', address_2: '', city: '', province: '', postal_code: '', phone: '' });
  };

  const handleDeleteStore = async (address: NonNullable<Franchisee['shipping_addresses']>[number]) => {
    if (!franchisee) return;

    const confirmed = confirm(`¿Eliminar la tienda "${address.company || address.first_name}"?`);
    if (!confirmed) return;

    try {
      setDeletingAddressId(address.id);
      await franchiseesApi.deleteAddress(franchisee.id, address.id);
      await loadFranchisee();
    } catch (err) {
      console.error('Error deleting store:', err);
      alert('Error al eliminar tienda: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setDeletingAddressId(null);
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

  const onboardingStatusLabel = (() => {
    switch (franchisee?.metadata?.onboarding_status) {
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
    switch (franchisee?.metadata?.subscription_status) {
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
          {franchisee.metadata?.status === 'pending_approval' && (
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

      {/* Status & Tier */}
      <div className="flex gap-2">
        <FranchiseeStatusBadge
          isActive={franchisee.metadata?.is_active || false}
          status={franchisee.metadata?.status}
        />
        <DiscountTierBadge tier={franchisee.metadata?.discount_tier} />
        <Badge variant="outline">
          Suscripción: {franchisee.metadata?.subscription_status || 'pending'}
        </Badge>
        <Badge variant="secondary">
          Onboarding: {onboardingStatusLabel}
        </Badge>
        {franchisee.has_account && (
          <Badge variant="outline">
            <Mail className="h-3 w-3 mr-1" />
            Cuenta Activa
          </Badge>
        )}
      </div>

      {approvalRequiresActiveSubscription &&
        franchisee.metadata?.status === 'pending_approval' &&
        !subscriptionActive && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {subscriptionBlockMessage}
        </div>
      )}

      {franchisee.metadata?.onboarding_status === 'approved_pending_credentials' && !franchisee.has_account && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          El franquiciado ya está aprobado, pero todavía falta enviar o completar la activación de credenciales.
        </div>
      )}

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
          <TabsTrigger value="status">Estado y Notas</TabsTrigger>
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

        {/* Status & Notes Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado y Notas</CardTitle>
              <CardDescription>
                Cambia el estado del franquiciado y añade notas internas (visibles solo para el equipo admin)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Estado</p>
                <Select
                  value={statusDraft}
                  onValueChange={(value) => setStatusDraft(value as typeof statusDraft)}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_approval">Pendiente de Aprobación</SelectItem>
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
                  <p className="font-medium">{franchisee.metadata?.subscription_status || 'pending'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Próxima renovación</p>
                  <p className="font-medium">{formatDate(franchisee.metadata?.current_period_end)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Notas Internas</p>
                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Notas visibles solo para el equipo admin..."
                  className="min-h-[120px]"
                />
              </div>

              <Button onClick={handleSaveStatusNotes} disabled={savingStatusNotes}>
                {savingStatusNotes ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tiendas</CardTitle>
                <Button size="sm" onClick={() => setShowAddStore(true)}>
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditStore(address)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStore(address)}
                            disabled={deletingAddressId === address.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingAddressId === address.id ? 'Eliminando...' : 'Eliminar'}
                          </Button>
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

      {/* Add Store Dialog */}
      <Dialog open={showAddStore} onOpenChange={(open) => (open ? setShowAddStore(true) : handleCloseStoreDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddressId ? 'Editar Tienda' : 'Añadir Tienda'}</DialogTitle>
            <DialogDescription>
              Datos básicos de {editingAddressId ? 'esta' : 'la nueva'} tienda de este franquiciado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nombre de la Tienda *</Label>
              <Input
                value={newStore.company}
                onChange={(e) => setNewStore({ ...newStore, company: e.target.value })}
                placeholder="Carrefour Express Sur"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dirección *</Label>
              <Input
                value={newStore.address_1}
                onChange={(e) => setNewStore({ ...newStore, address_1: e.target.value })}
                placeholder="Calle Mayor 123"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dirección (línea 2)</Label>
              <Input
                value={newStore.address_2}
                onChange={(e) => setNewStore({ ...newStore, address_2: e.target.value })}
                placeholder="Local 3"
              />
            </div>

            <div className="space-y-2">
              <Label>Ciudad *</Label>
              <Input
                value={newStore.city}
                onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                placeholder="Madrid"
              />
            </div>

            <div className="space-y-2">
              <Label>Provincia</Label>
              <Input
                value={newStore.province}
                onChange={(e) => setNewStore({ ...newStore, province: e.target.value })}
                placeholder="Madrid"
              />
            </div>

            <div className="space-y-2">
              <Label>Código Postal *</Label>
              <Input
                value={newStore.postal_code}
                onChange={(e) => setNewStore({ ...newStore, postal_code: e.target.value })}
                placeholder="28001"
              />
            </div>

            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={newStore.phone}
                onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                placeholder="+34 900 000 000"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseStoreDialog} disabled={savingStore}>
              Cancelar
            </Button>
            <Button onClick={handleAddStore} disabled={savingStore}>
              {savingStore ? 'Guardando...' : 'Guardar Tienda'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
