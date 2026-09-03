'use client';

import { Badge } from '@/components/ui/badge';
import type { FranchiseeStatus, DiscountTier, FranchiseeMetadata } from '@/types/franchisees';
import { CheckCircle, XCircle, Clock, Ban, Crown, Star, Award, Circle } from 'lucide-react';

interface FranchiseeStatusBadgeProps {
  isActive: boolean;
  // Real backend enum (pending_approval/active/suspended/inactive), confirmed 2026-09-02.
  // Takes priority over isActive when present; isActive stays as a fallback for
  // franchisees created before this field existed.
  status?: FranchiseeMetadata['status'];
  className?: string;
}

export function FranchiseeStatusBadge({ isActive, status, className }: FranchiseeStatusBadgeProps) {
  if (status === 'pending_approval') {
    return (
      <Badge variant="secondary" className={`bg-amber-100 text-amber-800 hover:bg-amber-100 ${className || ''}`}>
        <Clock className="h-3 w-3 mr-1" />
        Pendiente de Aprobación
      </Badge>
    );
  }

  if (status === 'suspended') {
    return (
      <Badge variant="secondary" className={`bg-red-100 text-red-800 hover:bg-red-100 ${className || ''}`}>
        <Ban className="h-3 w-3 mr-1" />
        Suspendido
      </Badge>
    );
  }

  if (status === 'active' || isActive) {
    return (
      <Badge variant="default" className={`bg-green-100 text-green-800 hover:bg-green-100 ${className || ''}`}>
        <CheckCircle className="h-3 w-3 mr-1" />
        Activo
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`bg-gray-100 text-gray-800 ${className || ''}`}>
      <XCircle className="h-3 w-3 mr-1" />
      Inactivo
    </Badge>
  );
}

interface DiscountTierBadgeProps {
  tier?: string;
  className?: string;
}

export function DiscountTierBadge({ tier, className }: DiscountTierBadgeProps) {
  const config = {
    platinum: {
      label: 'Platinum',
      icon: Crown,
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
    gold: {
      label: 'Gold',
      icon: Star,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    silver: {
      label: 'Silver',
      icon: Award,
      className: 'bg-gray-200 text-gray-800 hover:bg-gray-200',
    },
    basic: {
      label: 'Basic',
      icon: Circle,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
  };

  const tierConfig = tier ? config[tier as keyof typeof config] : config.basic;
  const Icon = tierConfig.icon;

  return (
    <Badge variant="secondary" className={`${tierConfig.className} ${className || ''}`}>
      <Icon className="h-3 w-3 mr-1" />
      {tierConfig.label}
    </Badge>
  );
}
