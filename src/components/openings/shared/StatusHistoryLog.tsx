'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Loader2, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { openingsApi } from '@/lib/api/openings-client';
import { PROJECT_STATUS_LABELS } from '@/types/openings';
import type { StatusHistoryEntry } from '@/types/openings';
import { cn } from '@/lib/utils';

interface StatusHistoryLogProps {
  projectId: string;
  refreshTrigger?: number; // Para forzar recarga
  className?: string;
}

export default function StatusHistoryLog({
  projectId,
  refreshTrigger,
  className,
}: StatusHistoryLogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, [projectId, refreshTrigger]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await openingsApi.getStatusHistory(projectId);
      if (response.success && response.data) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error loading status history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar el historial de estados',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      franchisee: 'bg-blue-100 text-blue-800 border-blue-200',
      system: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const roleLabels = {
      admin: 'Admin',
      franchisee: 'Franquiciado',
      system: 'Sistema',
    };

    return (
      <Badge variant="outline" className={roleColors[role as keyof typeof roleColors] || ''}>
        {roleLabels[role as keyof typeof roleLabels] || role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando historial...</span>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Historial de Estados</CardTitle>
          <CardDescription>Registro de cambios de estado del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-600">No hay cambios de estado registrados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por fecha descendente (más reciente primero)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Historial de Estados</CardTitle>
        <CardDescription>
          {history.length} cambio{history.length !== 1 ? 's' : ''} registrado
          {history.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistory.map((entry, index) => {
            const isFirst = index === 0;
            const isLast = index === sortedHistory.length - 1;

            return (
              <div key={entry.id} className="relative">
                {/* Línea conectora */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 h-full w-0.5 bg-gray-200" />
                )}

                <div className="flex gap-4">
                  {/* Punto temporal */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        isFirst
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-gray-200 text-gray-600'
                      )}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 pb-8">
                    <div
                      className={cn(
                        'rounded-lg border p-4',
                        isFirst ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {entry.from_status && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  {PROJECT_STATUS_LABELS[entry.from_status]}
                                </Badge>
                                <span className="text-gray-400">→</span>
                              </>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs font-medium',
                                isFirst && 'bg-blue-600 text-white border-blue-600'
                              )}
                            >
                              {PROJECT_STATUS_LABELS[entry.to_status]}
                            </Badge>
                            {isFirst && (
                              <Badge variant="default" className="text-xs bg-blue-600">
                                Actual
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">{formatDate(entry.changed_at)}</p>
                        </div>
                      </div>

                      {/* Usuario */}
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{entry.changed_by_name}</span>
                        {getRoleBadge(entry.changed_by_role)}
                      </div>

                      {/* Notas */}
                      {entry.notes && (
                        <div className="mt-3 rounded bg-gray-50 p-3">
                          <p className="text-sm text-gray-700">{entry.notes}</p>
                        </div>
                      )}

                      {/* Metadata adicional */}
                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          <details className="cursor-pointer">
                            <summary className="font-medium">Información adicional</summary>
                            <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2">
                              {JSON.stringify(entry.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
