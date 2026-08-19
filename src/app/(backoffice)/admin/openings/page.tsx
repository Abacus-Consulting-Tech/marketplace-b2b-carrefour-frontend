/**
 * Portal Admin - Listado de Proyectos de Apertura
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useOpenings } from '@/lib/store/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { ProjectCard } from '@/components/openings/shared/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export default function AdminOpeningsPage() {
  const { projects, setProjects, isLoadingProjects, setLoadingProjects } = useOpenings();

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const response = await openingsApi.getProjects();
        if (response.success && response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, [setProjects, setLoadingProjects]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos de Apertura</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los proyectos de nuevas aperturas de establecimientos
          </p>
        </div>
        <Link href="/admin/openings/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Total Proyectos</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">En Proceso</p>
          <p className="text-2xl font-bold">
            {projects.filter((p) => 
              ['requesting_quotes', 'quotes_received', 'pending_selection'].includes(p.status)
            ).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Pendiente Firma</p>
          <p className="text-2xl font-bold">
            {projects.filter((p) => p.status === 'pending_signature').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.filter((p) => ['financing_approved', 'in_execution', 'completed'].includes(p.status)).length}
          </p>
        </div>
      </div>

      {/* Lista de proyectos */}
      {isLoadingProjects ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-600 mb-4">No hay proyectos de apertura</p>
          <Link href="/admin/openings/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear primer proyecto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/admin/openings/${project.id}`}
              showFranchisee={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
