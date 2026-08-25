/**
 * Portal Franquiciado - Detalle de Proyecto de Apertura
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OpeningProject } from '@/types/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Euro,
  User,
} from 'lucide-react';

export default function FranchiseeOpeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<OpeningProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  async function loadProject() {
    try {
      setLoading(true);
      const response = await openingsApi.getProjectById(projectId);

      if (response.success && response.data) {
        setProject(response.data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
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
              onClick={() => router.push('/marketplace/openings')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis proyectos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/marketplace/openings')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis proyectos
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

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">
            <Info className="mr-2 h-4 w-4" />
            Información
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documentos Técnicos
          </TabsTrigger>
        </TabsList>

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
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Creado:</span>{' '}
                    {new Date(project.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {project.franchisee && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Franquiciado
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.franchisee.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {project.franchisee.email}
                    </p>
                  </div>
                )}
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

        {/* Documentos Técnicos */}
        <TabsContent value="documents">
          <ProjectDocumentsViewer
            projectId={projectId}
            canDownload={true}
            showCategoryFilter={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
