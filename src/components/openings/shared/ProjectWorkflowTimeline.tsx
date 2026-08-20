'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  PROJECT_STATUS_ORDER,
  WORKFLOW_PHASES,
  STATUS_METADATA,
  isStatusCompleted,
  calculateProgress,
  getPhaseForStatus,
} from '@/lib/constants/workflow';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types/openings';
import type { ProjectStatus } from '@/types/openings';
import { cn } from '@/lib/utils';

interface ProjectWorkflowTimelineProps {
  currentStatus: ProjectStatus;
  className?: string;
  showProgress?: boolean;
}

export default function ProjectWorkflowTimeline({
  currentStatus,
  className,
  showProgress = true,
}: ProjectWorkflowTimelineProps) {
  const currentPhase = getPhaseForStatus(currentStatus);
  const progress = calculateProgress(currentStatus);

  // Filtrar estados cancelados para el timeline principal
  const mainStatuses = PROJECT_STATUS_ORDER.filter(
    (s) => s !== 'cancelled' && s !== 'financing_rejected'
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estado del Proyecto</CardTitle>
            <CardDescription>
              Fase actual: <span className="font-medium">{currentPhase?.name || 'N/A'}</span>
            </CardDescription>
          </div>
          {showProgress && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
              <div className="text-xs text-gray-500">Completado</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de progreso */}
        {showProgress && (
          <div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Timeline por fases */}
        <div className="space-y-6">
          {WORKFLOW_PHASES.map((phase) => {
            const phaseStatuses = phase.statuses.filter((s) =>
              mainStatuses.includes(s)
            );
            const isCurrentPhase = phase.statuses.includes(currentStatus);
            const allCompleted = phaseStatuses.every((s) =>
              isStatusCompleted(s, currentStatus)
            );

            return (
              <div key={phase.name} className="space-y-3">
                {/* Encabezado de fase */}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-1 flex-1 rounded',
                      allCompleted ? 'bg-green-500' : isCurrentPhase ? 'bg-blue-500' : 'bg-gray-200'
                    )}
                  />
                  <Badge
                    variant={isCurrentPhase ? 'default' : 'outline'}
                    className={cn(
                      isCurrentPhase && 'bg-blue-600 text-white',
                      allCompleted && !isCurrentPhase && 'bg-green-100 text-green-800 border-green-300'
                    )}
                  >
                    {phase.name}
                  </Badge>
                  <div
                    className={cn(
                      'h-1 flex-1 rounded',
                      allCompleted ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                </div>

                {/* Estados de la fase */}
                <div className="ml-4 space-y-2">
                  {phaseStatuses.map((status, index) => {
                    const isCompleted = isStatusCompleted(status, currentStatus);
                    const isCurrent = status === currentStatus;
                    const metadata = STATUS_METADATA[status];

                    return (
                      <div
                        key={status}
                        className={cn(
                          'flex items-start gap-3 relative',
                          index < phaseStatuses.length - 1 && 'pb-2'
                        )}
                      >
                        {/* Línea conectora */}
                        {index < phaseStatuses.length - 1 && (
                          <div
                            className={cn(
                              'absolute left-[11px] top-6 w-0.5 h-full',
                              isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            )}
                          />
                        )}

                        {/* Icono de estado */}
                        <div className="relative z-10">
                          {isCompleted ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          ) : isCurrent ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-100">
                              <Circle className="h-3 w-3 fill-white text-white" />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                              <Circle className="h-3 w-3 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Información del estado */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                'text-sm font-medium',
                                isCurrent
                                  ? 'text-blue-900'
                                  : isCompleted
                                  ? 'text-green-900'
                                  : 'text-gray-500'
                              )}
                            >
                              {PROJECT_STATUS_LABELS[status]}
                            </p>
                            {isCurrent && (
                              <Badge variant="default" className="bg-blue-600 text-xs">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {metadata.description}
                          </p>
                          {metadata.requiresAction && metadata.actionBy && (
                            <p className="text-xs text-gray-400 mt-1">
                              Acción: {
                                metadata.actionBy === 'admin' ? 'Admin' :
                                metadata.actionBy === 'franchisee' ? 'Franquiciado' :
                                metadata.actionBy === 'supplier' ? 'Proveedor' :
                                'Sistema'
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estados especiales (cancelado/rechazado) */}
        {(currentStatus === 'cancelled' || currentStatus === 'financing_rejected') && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">
                  {PROJECT_STATUS_LABELS[currentStatus]}
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  {STATUS_METADATA[currentStatus].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
