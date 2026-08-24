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
  SelectValue,
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.first_name.trim()) return 'El nombre es obligatorio';
    if (!formData.last_name.trim()) return 'Los apellidos son obligatorios';
    if (!formData.email.trim()) return 'El email es obligatorio';
    if (!formData.email.includes('@')) return 'El email no es válido';
    if (mode === 'create' && !formData.password) return 'La contraseña es obligatoria';
    if (mode === 'create' && formData.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!formData.company_name.trim()) return 'El nombre de la empresa es obligatorio';
    if (!formData.tax_id.trim()) return 'El CIF/NIF es obligatorio';
    if (!formData.store_code.trim()) return 'El código de tienda es obligatorio';

    const creditLimit = parseFloat(formData.credit_limit);
    if (isNaN(creditLimit) || creditLimit < 0) return 'El límite de crédito debe ser un número positivo';

    const paymentTerms = parseInt(formData.payment_terms);
    if (isNaN(paymentTerms) || paymentTerms < 0) return 'Los días de pago deben ser un número positivo';

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
            payment_terms: parseInt(formData.payment_terms),
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
            payment_terms: parseInt(formData.payment_terms),
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
                placeholder="Juan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="García López"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="juan.garcia@carrefour.es"
                required
              />
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
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 8 caracteres
                </p>
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
                placeholder="Carrefour Centro SL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">CIF/NIF *</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => handleChange('tax_id', e.target.value)}
                placeholder="B12345678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_code">Código de Tienda *</Label>
              <Input
                id="store_code"
                value={formData.store_code}
                onChange={(e) => handleChange('store_code', e.target.value)}
                placeholder="CF-MAD-001"
                required
              />
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
                value={formData.credit_limit}
                onChange={(e) => handleChange('credit_limit', e.target.value)}
                placeholder="5000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms">Días de Pago *</Label>
              <Input
                id="payment_terms"
                type="number"
                value={formData.payment_terms}
                onChange={(e) => handleChange('payment_terms', e.target.value)}
                placeholder="30"
                required
              />
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
