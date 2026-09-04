'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, CreateFranchiseeRequest, UpdateFranchiseeRequest, DiscountTier } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FranchiseeStatusBadge, DiscountTierBadge } from './FranchiseeStatusBadge';
import { AlertCircle, Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

interface FranchiseeFormProps {
  franchisee?: Franchisee;
  mode: 'create' | 'edit';
}

type FranchiseeFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  discount_tier: DiscountTier;
  credit_limit: string;
  payment_terms: string;
  is_active: boolean;
  notes: string;
};

export default function FranchiseeForm({ franchisee, mode }: FranchiseeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const isEditMode = mode === 'edit';
  const isPendingApproval = franchisee?.metadata?.status === 'pending_approval';
  const detailHref = franchisee ? `/admin/franchisees/${franchisee.id}` : '/admin/franchisees';

  // Form state
  const [formData, setFormData] = useState<FranchiseeFormData>({
    // Personal Info
    first_name: franchisee?.first_name || '',
    last_name: franchisee?.last_name || '',
    email: franchisee?.email || '',
    phone: franchisee?.phone || '',
    password: '',
    
    // B2B Config
    discount_tier: (franchisee?.metadata?.discount_tier as DiscountTier) || 'basic',
    credit_limit: franchisee?.metadata?.credit_limit?.toString() || '5000',
    payment_terms: String(franchisee?.metadata?.payment_terms || '30'),
    
    // Status
    is_active: franchisee?.metadata?.is_active ?? true,
    
    // Notes
    notes: franchisee?.metadata?.notes || '',
  });

  const validateField = (field: keyof FranchiseeFormData, value: FranchiseeFormData[keyof FranchiseeFormData]): string | null => {
    const normalizedValue = typeof value === 'string' ? value : String(value);

    switch (field) {
      case 'first_name':
        return !normalizedValue.trim() ? 'El nombre es obligatorio' : null;
      case 'last_name':
        return !normalizedValue.trim() ? 'Los apellidos son obligatorios' : null;
      case 'email':
        if (!normalizedValue.trim()) return 'El email es obligatorio';
        if (!normalizedValue.includes('@')) return 'El email no es válido';
        return null;
      case 'password':
        if (mode === 'create') {
          if (!normalizedValue) return 'La contraseña es obligatoria';
          if (normalizedValue.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = <K extends keyof FranchiseeFormData>(field: K, value: FranchiseeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear general error when user starts typing
    if (error) setError(null);
    // Validate field if it has been touched
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: fieldError || '',
      }));
    }
  };

  const handleBlur = (field: keyof FranchiseeFormData) => {
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
    (Object.keys(formData) as Array<keyof FranchiseeFormData>).forEach((field) => {
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          groups: [{ id: 'cg_b2b_franchisees' }],
          metadata: {
            discount_tier: formData.discount_tier,
            credit_limit: parseFloat(formData.credit_limit),
            payment_terms: parseInt(String(formData.payment_terms)),
            is_active: formData.is_active,
            notes: formData.notes || undefined,
          },
        };

        const response = await franchiseesApi.createFranchisee(request);
        
        if (response.data?.customer) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/admin/franchisees/${response.data.customer.id}`);
          }, 1000);
        }
      } else {
        // Edit mode
        const request: UpdateFranchiseeRequest = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || undefined,
          metadata: {
            ...franchisee?.metadata,
            discount_tier: formData.discount_tier,
            credit_limit: parseFloat(formData.credit_limit),
            payment_terms: parseInt(String(formData.payment_terms)),
            is_active: formData.is_active,
            notes: formData.notes || undefined,
          },
        };

        const response = await franchiseesApi.updateFranchisee(franchisee!.id, request);
        
        if (response.data?.customer) {
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
        <Link href={detailHref}>
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {mode === 'create'
              ? 'Nuevo Franquiciado'
              : isPendingApproval
                ? 'Revisar Solicitud de Franquiciado'
                : 'Editar Franquiciado'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Crea el acceso inicial para que el franquiciado complete su perfil y tiendas'
              : isPendingApproval
                ? 'Ajusta los datos de la solicitud antes de aprobar el acceso al marketplace'
                : 'Actualiza la información del franquiciado'}
          </p>
        </div>
        </div>
        {isEditMode && franchisee && (
          <Link href={detailHref}>
            <Button type="button" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver detalle
            </Button>
          </Link>
        )}
      </div>

      {isEditMode && franchisee && (
        <div className="flex flex-wrap gap-2">
          <FranchiseeStatusBadge
            isActive={franchisee.metadata?.is_active || false}
            status={franchisee.metadata?.status}
          />
          <DiscountTierBadge tier={franchisee.metadata?.discount_tier} />
          <Badge variant="outline">
            Suscripción: {franchisee.metadata?.subscription_status || 'pending'}
          </Badge>
          {franchisee.has_account && <Badge variant="outline">Cuenta activa</Badge>}
        </div>
      )}

      {isPendingApproval && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Esta es la misma ficha de edición del franquiciado, pero aplicada a una solicitud pendiente. Puedes corregir los datos aquí y luego aprobarla desde el detalle o desde la cola de pendientes.
        </div>
      )}

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
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Datos de contacto del responsable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                onBlur={() => handleBlur('first_name')}
                placeholder="Juan"
                required
                className={fieldErrors.first_name ? 'border-red-500' : ''}
              />
              {fieldErrors.first_name && (
                <p className="text-sm text-red-600">{fieldErrors.first_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                onBlur={() => handleBlur('last_name')}
                placeholder="García López"
                required
                className={fieldErrors.last_name ? 'border-red-500' : ''}
              />
              {fieldErrors.last_name && (
                <p className="text-sm text-red-600">{fieldErrors.last_name}</p>
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
                placeholder="+34 600 123 456"
              />
            </div>

            {mode === 'create' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password">Contraseña temporal *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Contraseña temporal para el primer acceso"
                  required
                  minLength={8}
                  className={fieldErrors.password ? 'border-red-500' : ''}
                />
                {fieldErrors.password ? (
                  <p className="text-sm text-red-600">{fieldErrors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Estado y Notas</CardTitle>
          <CardDescription>Estado de la cuenta y observaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Cuenta Activa</Label>
              <p className="text-sm text-muted-foreground">
                Permite al franquiciado acceder y realizar pedidos
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Internas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observaciones adicionales sobre este franquiciado..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href={detailHref}>
          <Button type="button" variant="outline" disabled={loading}>
            {isEditMode ? 'Volver al detalle' : 'Cancelar'}
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
