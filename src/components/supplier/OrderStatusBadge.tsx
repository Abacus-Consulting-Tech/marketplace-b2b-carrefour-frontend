'use client'

import { Badge } from '@/components/ui/badge'
import type { SupplierOrderStatus } from '@/types/orders-supplier'
import { Clock, CheckCircle2, Package, Truck, Home, XCircle } from 'lucide-react'

interface OrderStatusBadgeProps {
  status: SupplierOrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = {
    pending: {
      label: 'Pendiente',
      icon: Clock,
      variant: 'outline' as const,
      className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    confirmed: {
      label: 'Confirmado',
      icon: CheckCircle2,
      variant: 'outline' as const,
      className: 'border-blue-500 text-blue-700 bg-blue-50',
    },
    rejected: {
      label: 'Rechazado',
      icon: XCircle,
      variant: 'outline' as const,
      className: 'border-red-500 text-red-700 bg-red-50',
    },
    in_preparation: {
      label: 'En Preparación',
      icon: Package,
      variant: 'outline' as const,
      className: 'border-purple-500 text-purple-700 bg-purple-50',
    },
    shipped: {
      label: 'Enviado',
      icon: Truck,
      variant: 'outline' as const,
      className: 'border-indigo-500 text-indigo-700 bg-indigo-50',
    },
    delivered: {
      label: 'Entregado',
      icon: Home,
      variant: 'outline' as const,
      className: 'border-green-500 text-green-700 bg-green-50',
    },
    cancelled: {
      label: 'Cancelado',
      icon: XCircle,
      variant: 'outline' as const,
      className: 'border-gray-500 text-gray-700 bg-gray-50',
    },
  }

  const { label, icon: Icon, variant, className: statusClass } = config[status]

  return (
    <Badge variant={variant} className={`${statusClass} ${className || ''}`}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}
