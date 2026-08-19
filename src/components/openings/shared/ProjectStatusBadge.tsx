/**
 * Badge de Estado del Proyecto
 * 
 * Muestra el estado actual del proyecto con color y texto apropiado.
 */

import React from 'react';
import type { ProjectStatus } from '@/types/openings';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types/openings';
import { Badge } from '@/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const STATUS_VARIANT_MAP: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  gray: 'secondary',
  blue: 'default',
  yellow: 'outline',
  green: 'default',
  red: 'destructive',
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const label = PROJECT_STATUS_LABELS[status];
  const color = PROJECT_STATUS_COLORS[status];
  const variant = STATUS_VARIANT_MAP[color];

  return (
    <Badge
      variant={variant}
      className={className}
      style={{
        backgroundColor:
          color === 'green'
            ? '#10b981'
            : color === 'yellow'
            ? '#f59e0b'
            : color === 'blue'
            ? '#3b82f6'
            : color === 'red'
            ? '#ef4444'
            : undefined,
        color: color !== 'gray' ? 'white' : undefined,
      }}
    >
      {label}
    </Badge>
  );
}
