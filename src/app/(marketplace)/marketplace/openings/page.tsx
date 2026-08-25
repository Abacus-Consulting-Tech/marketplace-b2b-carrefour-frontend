/**
 * Portal Franquiciado - Mis Proyectos de Apertura
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectListResponse } from '@/types/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Building2,
  MapPin,
  Calendar,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function FranchiseeOpeningsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      console.log('[FranchiseeOpenings] Cargando proyectos...');
      // En un entorno real, esto cargaría solo los proyectos asignados al franquiciado autenticado
      const response = await openingsApi.getProjects();
      console.log('[FranchiseeOpenings] Response:', response);

      if (response.success && response.data) {
        // response.data ya es el array de proyectos (ProjectListResponse[])
        console.log('[FranchiseeOpenings] Proyectos recibidos:', response.data.length);
        setProjects(response.data);
      } else {
        console.log('[FranchiseeOpenings] No se recibieron datos o fallo:', response);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Proyectos de Apertura</h1>
        <p className="text-gray-600">
          Gestiona tus proyectos de apertura de tienda y accede a la documentación técnica
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              No tienes proyectos de apertura asignados
            </p>
            <p className="text-sm text-gray-400">
              Cuando se te asigne un proyecto, aparecerá aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/marketplace/openings/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.franchisee.name} - {project.franchisee.email}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Creado:{' '}
                      {new Date(project.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {project.planned_opening_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Apertura prevista:{' '}
                        {new Date(project.planned_opening_date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>{project.categories_count} categorías · {project.quotes_count} presupuestos</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/marketplace/openings/${project.id}`);
                    }}
                  >
                    Ver Detalles
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
