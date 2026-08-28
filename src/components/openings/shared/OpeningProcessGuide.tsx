'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  FileUp,
  Handshake,
  PenLine,
  Send,
  Signature,
  WalletCards,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getStatusIndex } from '@/lib/constants/workflow';
import type { ProjectStatus } from '@/types/openings';

type OpeningRole = 'admin' | 'franchisee' | 'supplier';

interface OpeningProcessGuideProps {
  currentStatus: ProjectStatus;
  role: OpeningRole;
  className?: string;
}

interface ProcessStep {
  number: number;
  title: string;
  owner: string;
  statuses: ProjectStatus[];
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleLabels: Record<OpeningRole, string> = {
  admin: 'Administración',
  franchisee: 'Franquiciado',
  supplier: 'Proveedor',
};

const roleIntro: Record<OpeningRole, string> = {
  admin: 'Siguiente mejor acción para coordinar planos, categorías, invitaciones, presupuestos y financiación.',
  franchisee: 'Sigue el avance de la apertura y actúa cuando toque comparar, aprobar y firmar presupuestos.',
  supplier: 'Consulta documentos técnicos y presenta presupuesto solo en las categorías donde has sido invitado.',
};

const roleHighlights: Record<OpeningRole, number[]> = {
  admin: [1, 2, 5],
  franchisee: [4, 6],
  supplier: [3],
};

const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Subir planos y documentos',
    owner: 'Administración',
    statuses: ['draft', 'preparing_documentation'],
    description: 'Carga planos, memoria técnica, anexos y documentos base para que todos trabajen sobre la misma información.',
    icon: FileUp,
  },
  {
    number: 2,
    title: 'Invitar proveedores por categoría',
    owner: 'Administración',
    statuses: ['requesting_quotes'],
    description: 'Define categorías, asigna proveedores y envía invitaciones con el alcance esperado y la fecha límite.',
    icon: Send,
  },
  {
    number: 3,
    title: 'Recibir presupuestos',
    owner: 'Proveedores',
    statuses: ['quotes_received'],
    description: 'Los proveedores revisan los documentos técnicos y presentan su presupuesto para cada categoría invitada.',
    icon: PenLine,
  },
  {
    number: 4,
    title: 'Aprobar presupuesto por categoría',
    owner: 'Franquiciado',
    statuses: ['pending_selection', 'awarded'],
    description: 'El franquiciado compara ofertas, resuelve dudas y selecciona el presupuesto ganador por categoría.',
    icon: Handshake,
  },
  {
    number: 5,
    title: 'Firmar presupuesto final',
    owner: 'Franquiciado',
    statuses: ['pending_signature', 'signed'],
    description: 'Se consolida la adjudicación, el franquiciado firma el presupuesto final y queda preparada la documentación financiera.',
    icon: Signature,
  },
  {
    number: 6,
    title: 'Pasar a financiación',
    owner: 'Administración y banco',
    statuses: ['pending_financing', 'financing_approved', 'in_execution', 'completed'],
    description: 'Se emite la carta de pago descargable para el franquiciado y se coordina la financiación con el banco.',
    icon: WalletCards,
  },
];

function getStepState(step: ProcessStep, currentStatus: ProjectStatus) {
  const currentIndex = getStatusIndex(currentStatus);
  const firstStepIndex = Math.min(...step.statuses.map(getStatusIndex));
  const lastStepIndex = Math.max(...step.statuses.map(getStatusIndex));

  if (currentStatus === 'cancelled' || currentStatus === 'financing_rejected') {
    return step.statuses.includes(currentStatus) ? 'current' : 'pending';
  }

  if (step.statuses.includes(currentStatus)) return 'current';
  if (currentIndex > lastStepIndex) return 'completed';
  if (currentIndex < firstStepIndex) return 'pending';

  return 'pending';
}

export default function OpeningProcessGuide({
  currentStatus,
  role,
  className,
}: OpeningProcessGuideProps) {
  const highlightedSteps = roleHighlights[role];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Guía del proceso de apertura</CardTitle>
            <CardDescription>{roleIntro[role]}</CardDescription>
          </div>
          <Badge variant="outline">Vista {roleLabels[role]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-6">
          {processSteps.map((step) => {
            const state = getStepState(step, currentStatus);
            const Icon = step.icon;
            const isRoleStep = highlightedSteps.includes(step.number);

            return (
              <div
                key={step.number}
                className={cn(
                  'relative rounded-lg border p-4 transition-colors',
                  state === 'completed' && 'border-green-200 bg-green-50',
                  state === 'current' && 'border-blue-300 bg-blue-50 shadow-sm',
                  state === 'pending' && 'border-gray-200 bg-white',
                  isRoleStep && state === 'pending' && 'border-gray-300'
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                      state === 'completed' && 'bg-green-600 text-white',
                      state === 'current' && 'bg-blue-600 text-white',
                      state === 'pending' && 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {state === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                  </div>
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      state === 'completed' && 'text-green-700',
                      state === 'current' && 'text-blue-700',
                      state === 'pending' && 'text-gray-400'
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold leading-snug text-gray-900">{step.title}</h3>
                    {state === 'current' && (
                      <Badge className="bg-blue-600 text-[10px]">Ahora</Badge>
                    )}
                    {isRoleStep && (
                      <Badge variant="secondary" className="text-[10px]">
                        Tu parte
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-500">{step.owner}</p>
                  <p className="text-xs leading-relaxed text-gray-600">{step.description}</p>
                </div>

                {state === 'pending' && (
                  <Circle className="absolute right-3 top-3 h-3 w-3 text-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}