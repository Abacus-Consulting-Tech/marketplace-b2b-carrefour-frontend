'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApi } from '@/lib/api/mock';
import type { Supplier, SupplierStatus } from '@/types';
import { Search, Building2, CheckCircle, XCircle, AlertCircle, Ban, Eye } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Aprobado',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rechazado',
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
  },
  suspended: {
    label: 'Suspendido',
    icon: Ban,
    className: 'bg-gray-100 text-gray-800',
  },
};

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | 'all'>('all');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await mockApi.suppliers.list();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getSuppliersByStatus = (status: SupplierStatus | 'all') => {
    if (status === 'all') return suppliers;
    return suppliers.filter((s) => s.status === status);
  };

  const counts = {
    all: suppliers.length,
    pending: getSuppliersByStatus('pending').length,
    approved: getSuppliersByStatus('approved').length,
    rejected: getSuppliersByStatus('rejected').length,
    suspended: getSuppliersByStatus('suspended').length,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
            <p className="text-gray-600 mt-1">
              Administra y aprueba proveedores del marketplace
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Volver al Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold">{counts.all}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-yellow-600">Pendientes</div>
              <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-green-600">Aprobados</div>
              <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-red-600">Rechazados</div>
              <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Suspendidos</div>
              <div className="text-2xl font-bold text-gray-600">{counts.suspended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por nombre, CIF o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs by Status */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SupplierStatus | 'all')}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Aprobados ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rechazados ({counts.rejected})</TabsTrigger>
          <TabsTrigger value="suspended">Suspendidos ({counts.suspended})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter}>
          <Card>
            <CardHeader>
              <CardTitle>Proveedores</CardTitle>
              <CardDescription>
                {filteredSuppliers.length} proveedor{filteredSuppliers.length !== 1 ? 'es' : ''} encontrado{filteredSuppliers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-4">Cargando proveedores...</p>
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron proveedores</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Empresa</TableHead>
                        <TableHead className="min-w-[100px]">CIF</TableHead>
                        <TableHead className="min-w-[150px]">Contacto</TableHead>
                        <TableHead className="min-w-[120px]">Categorías</TableHead>
                        <TableHead className="min-w-[120px]">Estado</TableHead>
                        <TableHead className="min-w-[80px]">Productos</TableHead>
                        <TableHead className="min-w-[80px]">Pedidos</TableHead>
                        <TableHead className="min-w-[100px] text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier) => {
                        const StatusIcon = STATUS_CONFIG[supplier.status].icon;
                        return (
                          <TableRow key={supplier.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{supplier.companyName}</div>
                                <div className="text-sm text-gray-500">{supplier.city}, {supplier.province}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{supplier.cif}</TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{supplier.contactPerson.name}</div>
                                <div className="text-xs text-gray-500">{supplier.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {supplier.productCategories.slice(0, 2).map((cat, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                                {supplier.productCategories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{supplier.productCategories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={STATUS_CONFIG[supplier.status].className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {STATUS_CONFIG[supplier.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{supplier.totalProducts || 0}</TableCell>
                            <TableCell className="text-center">{supplier.totalOrders || 0}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
