/**
 * Tarjeta de Proyecto
 * 
 * Muestra información resumida de un proyecto de apertura.
 */

import React from 'react';
import Link from 'next/link';
import type { ProjectListResponse } from '@/types/openings';
import { formatDate } from '@/types/openings';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, FileText, MessageSquare } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectListResponse;
  href: string;
  showFranchisee?: boolean;
}

export function ProjectCard({ project, href, showFranchisee = false }: ProjectCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
              {showFranchisee && project.franchisee && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {project.franchisee.name}
                </p>
              )}
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Fecha de apertura planificada */}
            {project.planned_opening_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Apertura: {formatDate(project.planned_opening_date)}</span>
              </div>
            )}

            {/* Estadísticas */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {project.categories_count || 0} categorías
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {project.quotes_count || 0} presupuestos
                </span>
              </div>
            </div>

            {/* Fecha de creación */}
            <p className="text-xs text-gray-500">
              Creado el {formatDate(project.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
