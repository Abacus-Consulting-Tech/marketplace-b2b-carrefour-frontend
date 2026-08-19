/**
 * Portal Franquiciado - Mis Proyectos de Apertura
 */

'use client';

import React, { useEffect } from 'react';
import { useOpenings } from '@/lib/store/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { ProjectCard } from '@/components/openings/shared/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText } from 'lucide-react';

export default function FranchiseeOpeningsPage() {
  const { myProjects, setMyProjects, isLoadingMyProjects, setLoadingMyProjects } = useOpenings();

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingMyProjects(true);
        // En modo real, llamaríamos a un endpoint específico del franquiciado
        // Para el mock, reutilizamos getProjects
        const response = await openingsApi.getProjects();
        if (response.success && response.data) {
          setMyProjects(response.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoadingMyProjects(false);
      }
    }

    loadProjects();
  }, [setMyProjects, setLoadingMyProjects]);

  // Filtrar proyectos por estado
  const activeProjects = myProjects.filter((p) =>
    ['requesting_quotes', 'quotes_received', 'pending_selection'].includes(p.status)
  );
  const pendingSignatureProjects = myProjects.filter(
    (p) => p.status === 'pending_signature'
  );
  const completedProjects = myProjects.filter((p) =>
    ['financing_approved', 'in_execution', 'completed'].includes(p.status)
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mis Proyectos de Apertura</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tus proyectos de apertura de establecimientos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Total Proyectos</p>
          <p className="text-2xl font-bold">{myProjects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">En Proceso</p>
          <p className="text-2xl font-bold text-blue-600">{activeProjects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Pendiente Firma</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingSignatureProjects.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">{completedProjects.length}</p>
        </div>
      </div>

      {/* Tabs por estado */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Activos ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="signature">
            Pendiente Firma ({pendingSignatureProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {isLoadingMyProjects ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tienes proyectos activos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  href={`/franchisee/openings/${project.id}`}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="signature" className="mt-6">
          {pendingSignatureProjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay proyectos pendientes de firma</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingSignatureProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  href={`/franchisee/openings/${project.id}/sign`}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedProjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay proyectos completados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  href={`/franchisee/openings/${project.id}`}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
