'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Supplier, UpdateSupplierRequest } from '@/types';
import { supplierRegistrationApi } from '@/lib/api/supplier-registration-client';

type SupplierEditForm = Pick<
  Supplier,
  | 'businessName'
  | 'legalName'
  | 'nifCif'
  | 'fiscalAddress'
  | 'municipality'
  | 'postalCode'
  | 'country'
  | 'iban'
  | 'email'
  | 'phone'
  | 'website'
  | 'contactName'
  | 'contactSurname'
  | 'contactPosition'
  | 'contactEmail'
  | 'contactPhone'
> & { approvalNotes: string };

const emptyForm: SupplierEditForm = {
  businessName: '',
  legalName: '',
  nifCif: '',
  fiscalAddress: '',
  municipality: '',
  postalCode: '',
  country: '',
  iban: '',
  email: '',
  phone: '',
  website: '',
  contactName: '',
  contactSurname: '',
  contactPosition: '',
  contactEmail: '',
  contactPhone: '',
  approvalNotes: '',
};

export default function SupplierEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<SupplierEditForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSupplier() {
      try {
        setLoading(true);
        setError(null);
        const response = await supplierRegistrationApi.getSupplierById(params.id);
        const supplier = response.supplier;

        if (isMounted) {
          setForm({
            businessName: supplier.businessName,
            legalName: supplier.legalName,
            nifCif: supplier.nifCif,
            fiscalAddress: supplier.fiscalAddress,
            municipality: supplier.municipality,
            postalCode: supplier.postalCode,
            country: supplier.country,
            iban: supplier.iban,
            email: supplier.email,
            phone: supplier.phone,
            website: supplier.website || '',
            contactName: supplier.contactName,
            contactSurname: supplier.contactSurname,
            contactPosition: supplier.contactPosition,
            contactEmail: supplier.contactEmail,
            contactPhone: supplier.contactPhone,
            approvalNotes: supplier.metadata?.approval_notes || '',
          });
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

  const updateField = (field: keyof SupplierEditForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      const request: UpdateSupplierRequest = {
        businessName: form.businessName,
        legalName: form.legalName,
        nifCif: form.nifCif,
        fiscalAddress: form.fiscalAddress,
        municipality: form.municipality,
        postalCode: form.postalCode,
        country: form.country,
        iban: form.iban,
        email: form.email,
        phone: form.phone,
        website: form.website,
        contactName: form.contactName,
        contactSurname: form.contactSurname,
        contactPosition: form.contactPosition,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        metadata: {
          approval_notes: form.approvalNotes,
        },
      };
      await supplierRegistrationApi.updateSupplier(params.id, request);
      router.push(`/admin/suppliers/${params.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el proveedor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando proveedor...</div>;
  }

  if (error && !saving) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/suppliers/${params.id}`} className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al detalle
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Editar proveedor</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos del proveedor</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre comercial</Label>
              <Input id="businessName" value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razón social</Label>
              <Input id="legalName" value={form.legalName} onChange={(event) => updateField('legalName', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nifCif">NIF/CIF</Label>
              <Input id="nifCif" value={form.nifCif} onChange={(event) => updateField('nifCif', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input id="iban" value={form.iban} onChange={(event) => updateField('iban', event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fiscalAddress">Dirección fiscal</Label>
              <Input id="fiscalAddress" value={form.fiscalAddress} onChange={(event) => updateField('fiscalAddress', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio</Label>
              <Input id="municipality" value={form.municipality} onChange={(event) => updateField('municipality', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input id="postalCode" value={form.postalCode} onChange={(event) => updateField('postalCode', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input id="country" value={form.country} onChange={(event) => updateField('country', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Web</Label>
              <Input id="website" value={form.website || ''} onChange={(event) => updateField('website', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email empresa</Label>
              <Input id="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono empresa</Label>
              <Input id="phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre contacto</Label>
              <Input id="contactName" value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactSurname">Apellidos contacto</Label>
              <Input id="contactSurname" value={form.contactSurname} onChange={(event) => updateField('contactSurname', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPosition">Cargo</Label>
              <Input id="contactPosition" value={form.contactPosition} onChange={(event) => updateField('contactPosition', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email contacto</Label>
              <Input id="contactEmail" value={form.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono contacto</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(event) => updateField('contactPhone', event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="approvalNotes">Notas internas</Label>
              <Textarea id="approvalNotes" value={form.approvalNotes} onChange={(event) => updateField('approvalNotes', event.target.value)} />
            </div>
            {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
            <div className="flex justify-end gap-3 md:col-span-2">
              <Button type="button" variant="outline" asChild>
                <Link href={`/admin/suppliers/${params.id}`}>Cancelar</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}