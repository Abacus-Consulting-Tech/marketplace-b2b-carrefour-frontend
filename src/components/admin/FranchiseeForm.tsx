'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee, CreateFranchiseeRequest, UpdateFranchiseeRequest } from '@/types/franchisees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,  GET /admin/products/prod_001?expand=variants,images,categories,supplier
  Authorization: Bearer {token}
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
    // Personal Info
    first_name: franchisee?.first_name || '',
    last_name: franchisee?.last_name || '',
    email: franchisee?.email || '',
    phone: franchisee?.phone || '',
    password: '',
    
    // Company Info
    company_name: franchisee?.metadata?.company_name || '',
    tax_id: franchisee?.metadata?.tax_id || '',
    store_code: franchisee?.metadata?.store_code || '',
    
    // B2B Config
    discount_tier: franchisee?.metadata?.discount_tier || 'basic',
    credit_limit: franchisee?.metadata?.credit_limit?.toString() || '5000',
    payment_terms: franchisee?.metadata?.payment_terms || '30',
    
    // Status
    is_active: franchisee?.metadata?.is_active ?? true,
    
    // Notes
    notes: franchisee?.metadata?.notes || '',
  });

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'first_name':
        return !value?.trim() ? 'El nombre es obligatorio' : null;
      case 'last_name':
        return !value?.trim() ? 'Los apellidos son obligatorios' : null;
      case 'email':
        if (!value?.trim()) return 'El email es obligatorio';
        if (!value.includes('@')) return 'El email no es válido';
        return null;
      case 'password':
        if (mode === 'create') {
          if (!value) return 'La contraseña es obligatoria';
          if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        }
        return null;
      case 'company_name':
        return !value?.trim() ? 'El nombre de la empresa es obligatorio' : null;
      case 'tax_id':
        return !value?.trim() ? 'El CIF/NIF es obligatorio' : null;
      case 'store_code':
        return !value?.trim() ? 'El código de tienda es obligatorio' : null;
      case 'credit_limit':
        const creditLimit = parseFloat(value);
        if (isNaN(creditLimit)) return 'Debe ser un número';
        if (creditLimit < 0) return 'El límite de crédito debe ser positivo';
        return null;
      case 'payment_terms':
        const paymentTerms = parseInt(value);
        if (isNaN(paymentTerms)) return 'Debe ser un número';
        if (paymentTerms < 0) return 'Los días de pago deben ser positivos';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: string, value: any) => {
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          groups: [{ id: 'cg_b2b_franchisees' }],
          metadata: {
            company_name: formData.company_name,
            tax_id: formData.tax_id,
            store_code: formData.store_code,
            discount_tier: formData.discount_tier as any,
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
            company_name: formData.company_name,
            tax_id: formData.tax_id,
            store_code: formData.store_code,
            discount_tier: formData.discount_tier as any,
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
              ? 'Completa la información para crear un nuevo franquiciado'
              : 'Actualiza la información del franquiciado'}
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
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Mínimo 8 caracteres"
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

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
          <CardDescription>Datos fiscales y comerciales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company_name">Nombre de la Empresa *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                onBlur={() => handleBlur('company_name')}
                placeholder="Carrefour Centro SL"
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

            <div className="space-y-2">
              <Label htmlFor="store_code">Código de Tienda *</Label>
              <Input
                id="store_code"
                value={formData.store_code}
                onChange={(e) => handleChange('store_code', e.target.value)}
                onBlur={() => handleBlur('store_code')}
                placeholder="CF-MAD-001"
                required
                className={fieldErrors.store_code ? 'border-red-500' : ''}
              />
              {fieldErrors.store_code && (
                <p className="text-sm text-red-600">{fieldErrors.store_code}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B2B Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración B2B</CardTitle>
          <CardDescription>Condiciones comerciales y descuentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_tier">Nivel de Descuento *</Label>
              <Select value={formData.discount_tier} onValueChange={(value) => handleChange('discount_tier', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (0-5%)</SelectItem>
                  <SelectItem value="silver">Silver (5-10%)</SelectItem>
                  <SelectItem value="gold">Gold (10-15%)</SelectItem>
                  <SelectItem value="platinum">Platinum (15-20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_limit">Límite de Crédito (€) *</Label>
              <Input
                id="credit_limit"
                type="number"
                step="0.01"
                min="0"
                value={formData.credit_limit}
                onChange={(e) => handleChange('credit_limit', e.target.value)}
                onBlur={() => handleBlur('credit_limit')}
                placeholder="5000"
                required
                className={fieldErrors.credit_limit ? 'border-red-500' : ''}
              />
              {fieldErrors.credit_limit && (
                <p className="text-sm text-red-600">{fieldErrors.credit_limit}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms">Días de Pago *</Label>
              <Input
                id="payment_terms"
                type="number"
                min="0"
                value={formData.payment_terms}
                onChange={(e) => handleChange('payment_terms', e.target.value)}
                onBlur={() => handleBlur('payment_terms')}
                placeholder="30"
                required
                className={fieldErrors.payment_terms ? 'border-red-500' : ''}
              />
              {fieldErrors.payment_terms && (
                <p className="text-sm text-red-600">{fieldErrors.payment_terms}</p>
              )}
            </div>
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
