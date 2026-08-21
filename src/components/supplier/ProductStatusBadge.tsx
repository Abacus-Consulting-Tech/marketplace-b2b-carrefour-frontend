'use client';

import { Badge } from '@/components/ui/badge';
import type { PricingStatus } from '@/types/products-pricing';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ProductStatusBadgeProps {
  status: PricingStatus;
  className?: string;
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = {
    pending_approval: {
      label: 'Pendiente',
      icon: Clock,
      variant: 'outline' as const,
      className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    approved: {
      label: 'Aprobado',
      icon: CheckCircle2,
      variant: 'outline' as const,
      className: 'border-green-500 text-green-700 bg-green-50',
    },
    rejected: {
      label: 'Rechazado',
      icon: XCircle,
      variant: 'outline' as const,
      className: 'border-red-500 text-red-700 bg-red-50',
    },
  };

  const { label, icon: Icon, variant, className: statusClass } = config[status];

  return (
    <Badge variant={variant} className={`${statusClass} ${className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
