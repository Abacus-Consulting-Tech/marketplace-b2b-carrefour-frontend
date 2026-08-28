'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Calendar, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { openingsApi } from '@/lib/api/openings-client';
import type { CreateProjectRequest } from '@/types/openings';

export default function NewOpeningProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    franchisee_id: '',
    store_sap_code: '',
    name: '',
    planned_opening_date: '',
    // Address
    street: '',
    city: '',
    postal_code: '',
    province: '',
    country: 'ES',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
        if (!formData.franchisee_id || !formData.store_sap_code || !formData.name || !formData.street || !formData.city || 
          !formData.postal_code || !formData.province) {
        setError('Por favor, completa todos los campos obligatorios.');
        setIsSubmitting(false);
        return;
      }

      // Build request
      const request: CreateProjectRequest = {
        franchisee_id: formData.franchisee_id,
        store_sap_code: formData.store_sap_code,
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          postal_code: formData.postal_code,
          province: formData.province,
          country: formData.country,
        },
      };

      // Add optional planned_opening_date if provided
      if (formData.planned_opening_date) {
        request.planned_opening_date = new Date(formData.planned_opening_date);
      }

      // Submit
      console.log('Submitting project request:', request);
      const response = await openingsApi.createProject(request);
      console.log('Project creation response:', response);

      if (response.success && response.data) {
        // Navigate to the new project detail page
        console.log('Navigating to:', `/admin/openings/${response.data.id}`);
        router.push(`/admin/openings/${response.data.id}`);
      } else {
        console.error('Project creation failed:', response);
        setError(response.error || 'Error al crear el proyecto');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(`Error al crear el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/openings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Proyectos
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Nuevo Proyecto de Apertura</h1>
        </div>
        <p className="text-muted-foreground">
          Crea un nuevo proyecto de apertura de tienda para un franquiciado
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Proyecto
            </CardTitle>
            <CardDescription>
              Datos básicos del proyecto de apertura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="franchisee_id">
                  ID del Franquiciado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="franchisee_id"
                  name="franchisee_id"
                  value={formData.franchisee_id}
                  onChange={handleInputChange}
                  placeholder="ej: user_franchisee_juan"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  ID del usuario franquiciado en el sistema
                </p>
              </div>

              <div className="col-span-2">
                <Label htmlFor="store_sap_code">
                  Código SAP de la tienda <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="store_sap_code"
                  name="store_sap_code"
                  value={formData.store_sap_code}
                  onChange={handleInputChange}
                  placeholder="ej: SAP-000123"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Se usará para consultar los datos fiscales ya completados por el franquiciado.
                </p>
              </div>

              <div className="col-span-2">
                <Label htmlFor="name">
                  Nombre del Proyecto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ej: Nueva apertura - Calle Mayor 123"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="planned_opening_date">
                  Fecha de Apertura Planificada
                </Label>
                <Input
                  id="planned_opening_date"
                  name="planned_opening_date"
                  type="date"
                  value={formData.planned_opening_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación de la tienda
            </CardTitle>
            <CardDescription>
              Dirección de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="street">
                  Calle y Número <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="ej: Calle Mayor 123"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">
                  Ciudad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="ej: Madrid"
                  required
                />
              </div>

              <div>
                <Label htmlFor="province">
                  Provincia <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="ej: Madrid"
                  required
                />
              </div>

              <div>
                <Label htmlFor="postal_code">
                  Código Postal <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="ej: 28013"
                  required
                />
              </div>

              <div>
                <Label htmlFor="country">
                  País <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="ES"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/openings">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Calendar className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 mr-2" />
                Crear Proyecto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
