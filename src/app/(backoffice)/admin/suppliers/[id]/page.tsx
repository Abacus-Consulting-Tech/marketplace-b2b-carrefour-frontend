'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, Mail, Phone, Globe, User, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Supplier, SupplierStatus } from '@/types';
import { supplierRegistrationApi } from '@/lib/api/supplier-registration-client';

const statusColors: Record<SupplierStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<SupplierStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
};

export default function SupplierDetailPage() {
  const params = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSupplier() {
      try {
        setLoading(true);
        setError(null);
        const response = await supplierRegistrationApi.getSupplierById(params.id);
        if (isMounted) {
          setSupplier(response.supplier);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el proveedor');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (params.id) {
      loadSupplier();
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return <div>Cargando proveedor...</div>;
  }

  if (error || !supplier) {
    return <div className="text-red-600">{error || 'Proveedor no encontrado'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/suppliers" className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proveedores
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{supplier.businessName}</h1>
          <p className="text-muted-foreground">Detalle completo de la solicitud y estado del proveedor</p>
        </div>
        <Button asChild>
          <Link href={`/admin/suppliers/${supplier.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar proveedor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{supplier.legalName}</span>
            </div>
            <div>NIF/CIF: {supplier.nifCif}</div>
            <div>{supplier.fiscalAddress}</div>
            <div>{supplier.municipality} ({supplier.postalCode}), {supplier.country}</div>
            <div>IBAN: {supplier.iban}</div>
            {supplier.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {supplier.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto y estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contactName} {supplier.contactSurname} · {supplier.contactPosition}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone}</span>
            </div>
            <div className="pt-2">
              <Badge className={statusColors[supplier.status]}>{statusLabels[supplier.status]}</Badge>
            </div>
            <div>Onboarding: {supplier.metadata?.onboarding_status || 'pending_approval'}</div>
            <div>Notas: {supplier.metadata?.approval_notes || 'Sin notas'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}