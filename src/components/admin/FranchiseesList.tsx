'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FranchiseeStatusBadge } from './FranchiseeStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function FranchiseesList() {
  const [franchisees, setFranchisees] = useState<Franchisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    suspended: 0,
  });

  const loadFranchisees = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        q: searchQuery || undefined,
        limit,
        offset,
        take: limit,
        skip: offset,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await franchiseesApi.listFranchisees(filters);

      if (response.data) {
        const franchiseeItems = response.data.franchisees;
        const filteredItems =
          statusFilter === 'all'
            ? franchiseeItems
            : franchiseeItems.filter((item) => (item.status || item.metadata?.status) === statusFilter);

        setFranchisees(filteredItems);
        setTotalCount(response.data.total);
        calculateStats(franchiseeItems);
      }
    } catch (err) {
      console.error('Error loading franchisees:', err);
      setError(err instanceof Error ? err.message : 'Failed to load franchisees');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Franchisee[]) => {
    const active = data.filter((f) => (f.status || f.metadata?.status) === 'active').length;
    const inactive = data.filter((f) => (f.status || f.metadata?.status) === 'inactive').length;
    const pending = data.filter((f) => (f.status || f.metadata?.status) === 'pending_approval').length;
    const suspended = data.filter((f) => (f.status || f.metadata?.status) === 'suspended').length;

    setStats({
      total: data.length,
      active,
      inactive,
      pending,
      suspended,
    });
  };

  useEffect(() => {
    loadFranchisees();
  }, [searchQuery, statusFilter, offset]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setOffset(0); // Reset pagination
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setOffset(0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Franquiciados</h1>
          <p className="text-muted-foreground mt-1">
            Administra los franquiciados del marketplace B2B
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadFranchisees} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Link href="/admin/franchisees/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invitar Franquiciado
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Franquiciados</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1" />
              {stats.active} activos, {stats.pending} pendientes
            </div>
          </CardContent>
        </Card>

        <Card className={stats.pending > 0 ? 'border-amber-300' : undefined}>
          <CardHeader className="pb-2">
            <CardDescription>Pendientes de Aprobación</CardDescription>
            <CardTitle className="text-2xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              className="flex items-center text-xs text-amber-700 hover:underline"
              onClick={() => handleStatusFilter('pending')}
            >
              <Filter className="h-3 w-3 mr-1" />
              Ver solicitudes de autoregistro
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-2xl">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Filter className="h-3 w-3 mr-1" />
              Estado operativo
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactivos</CardDescription>
            <CardTitle className="text-2xl">{stats.inactive}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Filter className="h-3 w-3 mr-1" />
              Sin acceso operativo
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Suspendidos</CardDescription>
            <CardTitle className="text-2xl">{stats.suspended}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Filter className="h-3 w-3 mr-1" />
              Requieren revisión
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email, CIF..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending_approval">Pendientes de aprobación</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-lg text-red-800">
              <p className="font-medium">Error al cargar franquiciados</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Cargando franquiciados...</p>
            </div>
          ) : franchisees.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No hay franquiciados</p>
              <p className="text-muted-foreground mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'No se encontraron resultados con los filtros aplicados'
                  : 'Comienza creando tu primer franquiciado'}
              </p>
              <Link href="/admin/franchisees/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Invitar Franquiciado
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Franquiciado</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Suscripción</TableHead>
                    <TableHead>Alta</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchisees.map((franchisee) => (
                    <TableRow key={franchisee.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {franchisee.name || franchisee.company_name || franchisee.metadata?.company_name || '-'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {franchisee.id}
                          </div>
                          {(franchisee.tax_id || franchisee.metadata?.tax_id) && (
                            <div className="text-xs text-muted-foreground">
                              CIF: {franchisee.tax_id || franchisee.metadata?.tax_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {franchisee.contact_person || `${franchisee.first_name || ''} ${franchisee.last_name || ''}`.trim() || '-'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            {franchisee.email}
                          </div>
                          {franchisee.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {franchisee.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {franchisee.region || franchisee.municipality || franchisee.address ? (
                          <div className="flex items-start text-sm">
                            <MapPin className="h-3 w-3 mr-1 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <div>
                              <div>{franchisee.municipality || franchisee.region || '-'}</div>
                              <div className="text-xs text-muted-foreground">
                                {franchisee.address || franchisee.region || '-'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <FranchiseeStatusBadge
                          isActive={(franchisee.status || franchisee.metadata?.status) === 'active'}
                          status={franchisee.status || franchisee.metadata?.status}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {franchisee.subscription_status || franchisee.metadata?.subscription_status || 'not_configured'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(franchisee.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/franchisees/${franchisee.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver Detalles
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalCount > limit && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {offset + 1} - {Math.min(offset + limit, totalCount)} de {totalCount}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOffset(Math.max(0, offset - limit))}
                      disabled={offset === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= totalCount}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Mock Mode Indicator */}
      {franchiseesApi.isMockMode() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎭</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Modo de Desarrollo</p>
              <p className="text-sm text-yellow-700 mt-1">
                Usando datos de prueba. Los datos no se guardan en el backend.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
