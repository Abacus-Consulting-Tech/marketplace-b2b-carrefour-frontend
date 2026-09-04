'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, CreateFranchiseeRequest, UpdateFranchiseeRequest } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FranchiseeFormProps {
  franchisee?: Franchisee;
  mode: 'create' | 'edit';
}

export default function FranchiseeForm({ franchisee, mode }: FranchiseeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: franchisee?.name || franchisee?.company_name || '',
    company_name: franchisee?.company_name || franchisee?.metadata?.company_name || '',
    tax_id: franchisee?.tax_id || franchisee?.metadata?.tax_id || '',
    contact_person: franchisee?.contact_person || `${franchisee?.first_name || ''} ${franchisee?.last_name || ''}`.trim(),
    email: franchisee?.email || '',
    phone: franchisee?.phone || '',
    store_code: franchisee?.store_code || franchisee?.metadata?.store_code || '',
    region: franchisee?.region || franchisee?.metadata?.region || '',
    address: franchisee?.address || franchisee?.metadata?.address || '',
    municipality: franchisee?.municipality || franchisee?.metadata?.municipality || '',
    postal_code: franchisee?.postal_code || franchisee?.metadata?.postal_code || '',
    country: franchisee?.country || franchisee?.metadata?.country || 'ES',
  });

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        return !value?.trim() ? 'El nombre comercial es obligatorio' : null;
      case 'company_name':
        return !value?.trim() ? 'La razón social es obligatoria' : null;
      case 'tax_id':
        return !value?.trim() ? 'El CIF/NIF es obligatorio' : null;
      case 'contact_person':
        return !value?.trim() ? 'La persona de contacto es obligatoria' : null;
      case 'email':
        if (!value?.trim()) return 'El email es obligatorio';
        if (!value.includes('@')) return 'El email no es válido';
        return null;
      case 'phone':
        return !value?.trim() ? 'El teléfono es obligatorio' : null;
      case 'region':
        return !value?.trim() ? 'La región es obligatoria' : null;
      case 'address':
        return !value?.trim() ? 'La dirección es obligatoria' : null;
      default:
        return null;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: fieldError || '',
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field as keyof typeof formData]);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: fieldError || '',
    }));
  };

  const validateForm = (): string | null => {
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
    });

    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return 'Por favor, corrige los errores en el formulario';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (mode === 'create') {
        const request: CreateFranchiseeRequest = {
          name: formData.name,
          email: formData.email,
          tax_id: formData.tax_id,
          contact_person: formData.contact_person || undefined,
          company_name: formData.company_name || undefined,
          phone: formData.phone || undefined,
          store_code: formData.store_code || undefined,
          region: formData.region || undefined,
          address: formData.address || undefined,
          municipality: formData.municipality || undefined,
          postal_code: formData.postal_code || undefined,
          country: formData.country || undefined,
        };

        const response = await franchiseesApi.createFranchisee(request);

        const created = response.data?.franchisee || response.data?.customer;
        if (created) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/admin/franchisees/${created.id}`);
          }, 1000);
        }
      } else {
        const request: UpdateFranchiseeRequest = {
          name: formData.name,
          email: formData.email,
          tax_id: formData.tax_id,
          contact_person: formData.contact_person || undefined,
          company_name: formData.company_name || undefined,
          phone: formData.phone || undefined,
          store_code: formData.store_code || undefined,
          region: formData.region || undefined,
          address: formData.address || undefined,
          municipality: formData.municipality || undefined,
          postal_code: formData.postal_code || undefined,
          country: formData.country || undefined,
        };

        const response = await franchiseesApi.updateFranchisee(franchisee!.id, request);

        if (response.data?.franchisee || response.data?.customer) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/admin/franchisees/${franchisee!.id}`);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Error saving franchisee:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar franquiciado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/franchisees">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Nuevo Franquiciado' : 'Editar Franquiciado'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Crea manualmente un franquiciado usando el contrato canónico B2B'
              : 'Actualiza los datos del franquiciado'}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {mode === 'create' ? 'Franquiciado creado exitosamente' : 'Franquiciado actualizado exitosamente'}
              </p>
              <p className="text-sm text-green-700 mt-1">Redirigiendo...</p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Franquiciado</CardTitle>
          <CardDescription>Información canónica del recurso `/admin/franchisees`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nombre comercial *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Carrefour Express Centro"
                required
                className={fieldErrors.name ? 'border-red-500' : ''}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Razón social *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                onBlur={() => handleBlur('company_name')}
                placeholder="Carrefour Express Centro SL"
                required
                className={fieldErrors.company_name ? 'border-red-500' : ''}
              />
              {fieldErrors.company_name && (
                <p className="text-sm text-red-600">{fieldErrors.company_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">CIF/NIF *</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => handleChange('tax_id', e.target.value)}
                onBlur={() => handleBlur('tax_id')}
                placeholder="B12345678"
                required
                className={fieldErrors.tax_id ? 'border-red-500' : ''}
              />
              {fieldErrors.tax_id && (
                <p className="text-sm text-red-600">{fieldErrors.tax_id}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact_person">Persona de contacto *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                onBlur={() => handleBlur('contact_person')}
                placeholder="María García"
                required
                className={fieldErrors.contact_person ? 'border-red-500' : ''}
              />
              {fieldErrors.contact_person && (
                <p className="text-sm text-red-600">{fieldErrors.contact_person}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="juan.garcia@carrefour.es"
                required
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+34 600 123 456"
                className={fieldErrors.phone ? 'border-red-500' : ''}
              />
              {fieldErrors.phone && (
                <p className="text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_code">Código de tienda</Label>
              <Input
                id="store_code"
                value={formData.store_code}
                onChange={(e) => handleChange('store_code', e.target.value)}
                placeholder="CRF-MAD-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Región *</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                onBlur={() => handleBlur('region')}
                placeholder="Madrid"
                className={fieldErrors.region ? 'border-red-500' : ''}
              />
              {fieldErrors.region && (
                <p className="text-sm text-red-600">{fieldErrors.region}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="Gran Vía 1"
                className={fieldErrors.address ? 'border-red-500' : ''}
              />
              {fieldErrors.address && (
                <p className="text-sm text-red-600">{fieldErrors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio</Label>
              <Input
                id="municipality"
                value={formData.municipality}
                onChange={(e) => handleChange('municipality', e.target.value)}
                placeholder="Madrid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Código postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                placeholder="28013"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value.toUpperCase())}
                placeholder="ES"
                maxLength={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href="/admin/franchisees">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Crear Franquiciado' : 'Guardar Cambios'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
