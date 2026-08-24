'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FranchiseeStatusBadge, DiscountTierBadge } from './FranchiseeStatusBadge';
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
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function FranchiseesList() {
  const [franchisees, setFranchisees] = useState<Franchisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    platinum: 0,
    gold: 0,
    silver: 0,
    basic: 0,
  });

  const loadFranchisees = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        q: searchQuery || undefined,
        limit,
        offset,
        expand: 'groups,shipping_addresses',
      };

      // Apply filters
      if (statusFilter !== 'all') {
        filters.has_account = statusFilter === 'active';
      }

      if (tierFilter !== 'all') {
        filters.groups = [tierFilter];
      }

      const response = await franchiseesApi.listFranchisees(filters);

      if (response.data) {
        setFranchisees(response.data.customers);
        setTotalCount(response.data.count);

        // Calculate stats
        calculateStats(response.data.customers);
      }
    } catch (err) {
      console.error('Error loading franchisees:', err);
      setError(err instanceof Error ? err.message : 'Failed to load franchisees');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Franchisee[]) => {
    const active = data.filter((f) => f.metadata?.is_active).length;
    const inactive = data.length - active;

    const platinum = data.filter((f) => f.metadata?.discount_tier === 'platinum').length;
    const gold = data.filter((f) => f.metadata?.discount_tier === 'gold').length;
    const silver = data.filter((f) => f.metadata?.discount_tier === 'silver').length;
    const basic = data.filter((f) => f.metadata?.discount_tier === 'basic').length;

    setStats({
      total: data.length,
      active,
      inactive,
      platinum,
      gold,
      silver,
      basic,
    });
  };

  useEffect(() => {
    loadFranchisees();
  }, [searchQuery, tierFilter, statusFilter, offset]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setOffset(0); // Reset pagination
  };

  const handleTierFilter = (value: string) => {
    setTierFilter(value);
    setOffset(0);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setOffset(0);
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
              Nuevo Franquiciado
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Franquiciados</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1" />
              {stats.active} activos, {stats.inactive} inactivos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Platinum</CardDescription>
            <CardTitle className="text-2xl">{stats.platinum}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              Nivel más alto
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription">Gold & Silver</CardDescription>
            <CardTitle className="text-2xl">{stats.gold + stats.silver}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.gold} gold, {stats.silver} silver
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Basic</CardDescription>
            <CardTitle className="text-2xl">{stats.basic}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              Nivel estándar
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

            {/* Tier Filter */}
            <div>
              <Select value={tierFilter} onValueChange={handleTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tiers</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
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
                {searchQuery || tierFilter !== 'all' || statusFilter !== 'all'
                  ? 'No se encontraron resultados con los filtros aplicados'
                  : 'Comienza creando tu primer franquiciado'}
              </p>
              <Link href="/admin/franchisees/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Franquiciado
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
                    <TableHead>Tier</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchisees.map((franchisee) => (
                    <TableRow key={franchisee.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {franchisee.metadata?.company_name || `${franchisee.first_name} ${franchisee.last_name}`}
                          </div>
                          {franchisee.metadata?.store_code && (
                            <div className="text-xs text-muted-foreground">
                              Código: {franchisee.metadata.store_code}
                            </div>
                          )}
                          {franchisee.metadata?.tax_id && (
                            <div className="text-xs text-muted-foreground">
                              CIF: {franchisee.metadata.tax_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
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
                        {franchisee.shipping_addresses && franchisee.shipping_addresses.length > 0 ? (
                          <div className="flex items-start text-sm">
                            <MapPin className="h-3 w-3 mr-1 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <div>
                              <div>{franchisee.shipping_addresses[0].city}</div>
                              <div className="text-xs text-muted-foreground">
                                {franchisee.shipping_addresses[0].province}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DiscountTierBadge tier={franchisee.metadata?.discount_tier} />
                      </TableCell>
                      <TableCell>
                        <FranchiseeStatusBadge isActive={franchisee.metadata?.is_active || false} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatCurrency(franchisee.metadata?.total_spent || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {franchisee.metadata?.total_orders || 0} pedidos
                          </div>
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
