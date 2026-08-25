/**
 * Portal Proveedor - Detalle de Proyecto de Apertura
 * Vista de documentos técnicos para proveedores invitados
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OpeningProject } from '@/types/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDocumentsViewer from '@/components/openings/shared/ProjectDocumentsViewer';
import {
  Loader2,
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  FileText,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function SupplierOpeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuthStore();

  const [project, setProject] = useState<OpeningProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (projectId) {
      checkAccessAndLoadProject();
    }
  }, [projectId]);

  async function checkAccessAndLoadProject() {
    try {
      setLoading(true);
      setCheckingAccess(true);

      // 1. Cargar proyecto
      const projectResponse = await openingsApi.getProjectById(projectId);
      if (!projectResponse.success || !projectResponse.data) {
        return;
      }

      setProject(projectResponse.data);

      // 2. Verificar si el proveedor está invitado a este proyecto
      // En mock mode, simulamos que tiene acceso si tiene invitaciones
      const invitationsResponse = await openingsApi.getMyInvitations();
      
      if (invitationsResponse.success && invitationsResponse.data) {
        const hasInvitation = invitationsResponse.data.some(
          (inv) => inv.project_id === projectId
        );
        setHasAccess(hasInvitation);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
      setCheckingAccess(false);
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      preparing_documentation: 'Preparando Documentación',
      requesting_quotes: 'Solicitando Presupuestos',
      comparing_quotes: 'Comparando Ofertas',
      approved: 'Aprobado',
      in_execution: 'En Ejecución',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      preparing_documentation: 'bg-blue-100 text-blue-800',
      requesting_quotes: 'bg-purple-100 text-purple-800',
      comparing_quotes: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      in_execution: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  if (loading || checkingAccess) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Proyecto no encontrado</p>
            <Button
              variant="link"
              onClick={() => router.push('/supplier/openings')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a invitaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Acceso denegado
  if (!hasAccess) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/supplier/openings')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a invitaciones
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permiso para acceder a este proyecto. Solo los proveedores invitados pueden ver los documentos técnicos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/supplier/openings')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a invitaciones
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.address.street}, {project.address.city}</p>
          </div>
          <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>
      </div>

      {/* Access Confirmation Alert */}
      <Alert className="mb-6">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Tienes acceso a este proyecto. Puedes descargar todos los documentos técnicos necesarios para preparar tu presupuesto.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documentos Técnicos
          </TabsTrigger>
          <TabsTrigger value="info">
            <Info className="mr-2 h-4 w-4" />
            Información del Proyecto
          </TabsTrigger>
        </TabsList>

        {/* Documentos Técnicos */}
        <TabsContent value="documents">
          <ProjectDocumentsViewer
            projectId={projectId}
            canDownload={hasAccess}
            showCategoryFilter={true}
          />
        </TabsContent>

        {/* Información General */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Ubicación
                  </h3>
                  <p className="text-sm text-gray-600">{project.address.street}</p>
                  <p className="text-sm text-gray-600">
                    {project.address.postal_code} {project.address.city}
                  </p>
                  <p className="text-sm text-gray-600">{project.address.province}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Fechas Clave
                  </h3>
                  {project.planned_opening_date && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Apertura prevista:</span>{' '}
                      {new Date(project.planned_opening_date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              {project.description && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Descripción</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
