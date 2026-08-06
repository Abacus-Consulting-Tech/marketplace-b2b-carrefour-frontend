'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { mockApi } from '@/lib/api/mock';
import type { Supplier } from '@/types';
import { ArrowLeft, CheckCircle, XCircle, Ban, Star, Package, ShoppingCart, Calendar, Mail, Phone, MapPin, Building2, Globe, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Aprobado',
    className: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-red-100 text-red-800',
  },
  suspended: {
    label: 'Suspendido',
    className: 'bg-gray-100 text-gray-800',
  },
};

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchSupplier(params.id as string);
    }
  }, [params.id]);

  const fetchSupplier = async (id: string) => {
    try {
      setLoading(true);
      const response = await mockApi.suppliers.getById(id);
      setSupplier(response.data);
    } catch (error) {
      console.error('Error fetching supplier:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el proveedor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!supplier) return;

    try {
      setActionLoading(true);
      await mockApi.suppliers.approve(supplier.id);
      
      toast({
        title: 'Proveedor aprobado',
        description: `${supplier.companyName} ha sido aprobado correctamente`,
      });

      // Refresh supplier data
      await fetchSupplier(supplier.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo aprobar el proveedor',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!supplier || !rejectReason.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor indica el motivo del rechazo',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(true);
      await mockApi.suppliers.reject(supplier.id, rejectReason);
      
      toast({
        title: 'Proveedor rechazado',
        description: `${supplier.companyName} ha sido rechazado`,
      });

      setShowRejectDialog(false);
      setRejectReason('');
      
      // Refresh supplier data
      await fetchSupplier(supplier.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo rechazar el proveedor',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!supplier) return;

    try {
      setActionLoading(true);
      await mockApi.suppliers.suspend(supplier.id);
      
      toast({
        title: 'Proveedor suspendido',
        description: `${supplier.companyName} ha sido suspendido`,
      });

      await fetchSupplier(supplier.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo suspender el proveedor',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!supplier) return;

    try {
      setActionLoading(true);
      await mockApi.suppliers.activate(supplier.id);
      
      toast({
        title: 'Proveedor activado',
        description: `${supplier.companyName} ha sido activado`,
      });

      await fetchSupplier(supplier.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo activar el proveedor',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando proveedor...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Proveedor no encontrado</p>
          <Button variant="outline" onClick={() => router.push('/admin/suppliers')} className="mt-4">
            Volver a Proveedores
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/admin/suppliers')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Proveedores
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{supplier.companyName}</h1>
            <p className="text-gray-600 mt-1">{supplier.legalName}</p>
            <Badge className={`mt-2 ${STATUS_CONFIG[supplier.status].className}`}>
              {STATUS_CONFIG[supplier.status].label}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {supplier.status === 'pending' && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={actionLoading}
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar
                </Button>
              </>
            )}

            {supplier.status === 'approved' && (
              <Button
                onClick={handleSuspend}
                disabled={actionLoading}
                variant="outline"
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspender
              </Button>
            )}

            {supplier.status === 'suspended' && (
              <Button
                onClick={handleActivate}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos</p>
                <p className="text-2xl font-bold">{supplier.totalProducts || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold">{supplier.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valoración</p>
                <p className="text-2xl font-bold">{supplier.rating ? supplier.rating.toFixed(1) : 'N/A'}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registro</p>
                <p className="text-sm font-medium">{new Date(supplier.createdAt).toLocaleDateString('es-ES')}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejected Reason */}
      {supplier.status === 'rejected' && supplier.rejectedReason && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Motivo del Rechazo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{supplier.rejectedReason}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-600">CIF/NIF</Label>
              <p className="font-medium font-mono">{supplier.cif}</p>
            </div>

            <div>
              <Label className="text-gray-600">Nombre Legal</Label>
              <p className="font-medium">{supplier.legalName}</p>
            </div>

            <div>
              <Label className="text-gray-600">Dirección</Label>
              <p className="font-medium">
                {supplier.address}<br />
                {supplier.postalCode} {supplier.city}, {supplier.province}<br />
                {supplier.country}
              </p>
            </div>

            {supplier.website && (
              <div>
                <Label className="text-gray-600">Sitio Web</Label>
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline flex items-center"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {supplier.website}
                </a>
              </div>
            )}

            {supplier.description && (
              <div>
                <Label className="text-gray-600">Descripción</Label>
                <p className="font-medium">{supplier.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-600">Persona de Contacto</Label>
              <p className="font-medium">{supplier.contactPerson.name}</p>
            </div>

            <div>
              <Label className="text-gray-600">Email</Label>
              <a
                href={`mailto:${supplier.email}`}
                className="font-medium text-blue-600 hover:underline flex items-center"
              >
                <Mail className="h-4 w-4 mr-1" />
                {supplier.email}
              </a>
            </div>

            <div>
              <Label className="text-gray-600">Teléfono</Label>
              <a
                href={`tel:${supplier.phone}`}
                className="font-medium text-blue-600 hover:underline flex items-center"
              >
                <Phone className="h-4 w-4 mr-1" />
                {supplier.phone}
              </a>
            </div>

            <div>
              <Label className="text-gray-600">Email de Contacto</Label>
              <a
                href={`mailto:${supplier.contactPerson.email}`}
                className="font-medium text-blue-600 hover:underline flex items-center"
              >
                <Mail className="h-4 w-4 mr-1" />
                {supplier.contactPerson.email}
              </a>
            </div>

            <div>
              <Label className="text-gray-600">Teléfono de Contacto</Label>
              <a
                href={`tel:${supplier.contactPerson.phone}`}
                className="font-medium text-blue-600 hover:underline flex items-center"
              >
                <Phone className="h-4 w-4 mr-1" />
                {supplier.contactPerson.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supplier.productCategories.map((category, idx) => (
                <Badge key={idx} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Approval History */}
        {supplier.approvedAt && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Aprobación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Fecha de Aprobación</Label>
                <p className="font-medium">
                  {new Date(supplier.approvedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Última Actualización</Label>
                <p className="font-medium">
                  {new Date(supplier.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Proveedor</DialogTitle>
            <DialogDescription>
              Indica el motivo por el cual se rechaza a {supplier.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo del rechazo *</Label>
              <Input
                id="reason"
                placeholder="Ej: Documentación incompleta..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
            >
              Rechazar Proveedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
