/**
 * Order Status Badge Component
 * 
 * Badge visual para mostrar el estado de un pedido
 */

import { Badge } from '@/components/ui/badge'
import { OrderStatus, PaymentStatus, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/types/orders-franchisee'
import { cn } from '@/lib/utils'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status]
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = PAYMENT_STATUS_CONFIG[status]
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
