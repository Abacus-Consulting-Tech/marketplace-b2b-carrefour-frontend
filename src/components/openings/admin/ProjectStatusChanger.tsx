'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { openingsApi } from '@/lib/api/openings-client';
import { getNextStates, STATUS_METADATA } from '@/lib/constants/workflow';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types/openings';
import type { ProjectStatus, OpeningProject } from '@/types/openings';
import { cn } from '@/lib/utils';

interface ProjectStatusChangerProps {
  project: OpeningProject;
  onStatusChanged?: (updatedProject: OpeningProject) => void;
  className?: string;
}

export default function ProjectStatusChanger({
  project,
  onStatusChanged,
  className,
}: ProjectStatusChangerProps) {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatus = project.status;
  const validNextStates = getNextStates(currentStatus);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as ProjectStatus);
  };

  const handleSubmit = () => {
    if (!selectedStatus) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes seleccionar un nuevo estado',
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);
    try {
      const response = await openingsApi.updateProjectStatus(project.id, {
        new_status: selectedStatus,
        notes: notes || undefined,
      });

      if (response.success && response.data) {
        toast({
          title: 'Estado actualizado',
          description: `El proyecto ahora está en estado: ${PROJECT_STATUS_LABELS[selectedStatus]}`,
        });

        // Reset form
        setSelectedStatus('');
        setNotes('');
        setShowConfirmation(false);

        // Callback
        onStatusChanged?.(response.data);
      } else {
        throw new Error(response.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar el estado',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const currentMetadata = STATUS_METADATA[currentStatus];
  const selectedMetadata = selectedStatus ? STATUS_METADATA[selectedStatus] : null;

  // Determinar si el cambio es crítico (a estado final o peligroso)
  const isCriticalChange =
    selectedStatus === 'cancelled' ||
    selectedStatus === 'financing_rejected' ||
    selectedMetadata?.isFinal;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Cambiar Estado del Proyecto</CardTitle>
          <CardDescription>
            Solo se muestran las transiciones válidas según el flujo de trabajo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado actual */}
          <div>
            <Label className="text-sm font-medium">Estado Actual</Label>
            <div className="mt-2 flex items-center gap-3">
              <Badge
                variant="outline"
                style={{
                  backgroundColor:
                    PROJECT_STATUS_COLORS[currentStatus] === 'green'
                      ? '#10b981'
                      : PROJECT_STATUS_COLORS[currentStatus] === 'blue'
                      ? '#3b82f6'
                      : PROJECT_STATUS_COLORS[currentStatus] === 'yellow'
                      ? '#f59e0b'
                      : PROJECT_STATUS_COLORS[currentStatus] === 'red'
                      ? '#ef4444'
                      : '#6b7280',
                  color: 'white',
                  borderColor: 'transparent',
                }}
              >
                {PROJECT_STATUS_LABELS[currentStatus]}
              </Badge>
              <span className="text-sm text-gray-500">{currentMetadata.description}</span>
            </div>
          </div>

          {/* Selector de nuevo estado */}
          <div>
            <Label htmlFor="new-status">Nuevo Estado</Label>
            {validNextStates.length > 0 ? (
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger id="new-status" className="mt-2">
                  <SelectValue placeholder="Selecciona el siguiente estado..." />
                </SelectTrigger>
                <SelectContent>
                  {validNextStates.map((status) => {
                    const metadata = STATUS_METADATA[status];
                    return (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <span>{PROJECT_STATUS_LABELS[status]}</span>
                          {metadata.isFinal && (
                            <Badge variant="outline" className="text-xs">
                              Final
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">
                  No hay transiciones disponibles desde este estado
                </p>
              </div>
            )}
          </div>

          {/* Información del nuevo estado seleccionado */}
          {selectedMetadata && (
            <div
              className={cn(
                'p-3 rounded-md border',
                isCriticalChange
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              )}
            >
              <div className="flex items-start gap-2">
                {isCriticalChange ? (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCriticalChange ? 'text-red-900' : 'text-blue-900'
                    )}
                  >
                    {selectedMetadata.description}
                  </p>
                  {selectedMetadata.requiresAction && selectedMetadata.actionBy && (
                    <p className="text-xs text-gray-600 mt-1">
                      Requiere acción de:{' '}
                      {selectedMetadata.actionBy === 'admin'
                        ? 'Administrador'
                        : selectedMetadata.actionBy === 'franchisee'
                        ? 'Franquiciado'
                        : selectedMetadata.actionBy === 'supplier'
                        ? 'Proveedor'
                        : 'Sistema'}
                    </p>
                  )}
                  {selectedMetadata.isFinal && (
                    <p className="text-xs text-gray-600 mt-1">
                      ⚠️ Este es un estado final, no se podrá cambiar después
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notas opcionales */}
          <div>
            <Label htmlFor="notes">
              Notas <span className="text-sm text-gray-500">(Opcional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega comentarios sobre este cambio de estado..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Botón de acción */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!selectedStatus || isUpdating}
              className={cn(isCriticalChange && 'bg-red-600 hover:bg-red-700')}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCriticalChange ? 'Cambiar Estado (Crítico)' : 'Cambiar Estado'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmación */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCriticalChange ? '⚠️ Confirmar Cambio Crítico' : 'Confirmar Cambio de Estado'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCriticalChange ? (
                <span className="text-red-600">
                  Estás a punto de cambiar el proyecto a un estado{' '}
                  {selectedMetadata?.isFinal ? 'final' : 'crítico'}. Esta acción puede no ser
                  reversible.
                </span>
              ) : (
                <span>¿Confirmas que quieres cambiar el estado del proyecto?</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">De:</span>
              <Badge variant="outline">{PROJECT_STATUS_LABELS[currentStatus]}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">A:</span>
              <Badge
                variant="outline"
                className={cn(
                  isCriticalChange && 'bg-red-100 text-red-800 border-red-300'
                )}
              >
                {selectedStatus && PROJECT_STATUS_LABELS[selectedStatus]}
              </Badge>
            </div>
            {notes && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-1">Notas:</p>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isUpdating}
              className={cn(isCriticalChange && 'bg-red-600 hover:bg-red-700')}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
