/**
 * Portal Admin - Detalle de Proyecto de Apertura
 */

'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOpenings } from '@/lib/store/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { ProjectStatusBadge } from '@/components/openings/shared/ProjectStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Building2, Calendar, MapPin, FileText } from 'lucide-react';
import { formatDate } from '@/types/openings';

export default function AdminOpeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { selectedProject, selectProject, isLoadingProjects, setLoadingProjects } = useOpenings();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        console.log('[AdminOpeningDetail] Loading project:', projectId);
        setLoadingProjects(true);
        setError(null);
        const response = await openingsApi.getProjectById(projectId);
        console.log('[AdminOpeningDetail] Response:', response);
        
        if (response.success && response.data) {
          selectProject(response.data);
        } else {
          console.error('[AdminOpeningDetail] Failed to load project:', response.error);
          setError(response.error || 'Error al cargar el proyecto');
        }
      } catch (error) {
        console.error('[AdminOpeningDetail] Error loading project:', error);
        setError('Error al cargar el proyecto');
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProject();
  }, [projectId, selectProject, setLoadingProjects]);

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Cargando proyecto...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => router.push('/admin/openings')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-600 mb-4">Proyecto no encontrado</div>
        <Button onClick={() => router.push('/admin/openings')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
            <p className="text-gray-600 mt-1">{selectedProject.description || 'Sin descripción'}</p>
          </div>
          <ProjectStatusBadge status={selectedProject.status} />
        </div>
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Franquiciado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{selectedProject.franchisee?.name || 'No disponible'}</p>
            <p className="text-sm text-gray-600">{selectedProject.franchisee?.email || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{selectedProject.address.street}</p>
            <p className="text-sm text-gray-600">
              {selectedProject.address.postal_code} {selectedProject.address.city}
            </p>
            <p className="text-sm text-gray-600">{selectedProject.address.province}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Apertura Planificada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">
              {selectedProject.planned_opening_date
                ? formatDate(selectedProject.planned_opening_date)
                : 'No definida'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="quotes">Presupuestos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Descripción</h4>
                <p className="text-gray-600">{selectedProject.description || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Superficie</h4>
                  <p className="text-gray-600">
                    {selectedProject.store_size_sqm
                      ? `${selectedProject.store_size_sqm} m²`
                      : 'No especificada'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Formato</h4>
                  <p className="text-gray-600">
                    {selectedProject.store_format || 'No especificado'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Datos Fiscales</h4>
                <p className="text-gray-600">
                  CIF: {selectedProject.fiscal_data.tax_id}
                </p>
                <p className="text-gray-600">
                  {selectedProject.fiscal_data.company_name}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorías del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funcionalidad en desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Proveedores Invitados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funcionalidad en desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Presupuestos Recibidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funcionalidad en desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProject.floor_plan_url ? (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <a
                    href={selectedProject.floor_plan_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Plano del local
                  </a>
                </div>
              ) : (
                <p className="text-gray-500">No hay documentos adjuntos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
