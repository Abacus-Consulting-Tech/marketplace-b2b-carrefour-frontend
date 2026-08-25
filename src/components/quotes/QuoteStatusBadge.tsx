/**
 * Quote Status Badges
 * 
 * Visual indicators for quote and invitation status
 */

import { Quote, QuoteStatus, InvitationStatus, QUOTE_STATUS_CONFIG, INVITATION_STATUS_CONFIG } from '@/types/quotes'
import { Badge } from '@/components/ui/badge'
import { FileText, Send, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface QuoteStatusBadgeProps {
  status: QuoteStatus
  className?: string
}

export function QuoteStatusBadge({ status, className = '' }: QuoteStatusBadgeProps) {
  const config = QUOTE_STATUS_CONFIG[status]
  
  const icons: Record<QuoteStatus, React.ReactNode> = {
    draft: <FileText className="h-3 w-3" />,
    submitted: <Send className="h-3 w-3" />,
    under_review: <Eye className="h-3 w-3" />,
    awarded: <CheckCircle2 className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
    expired: <Clock className="h-3 w-3" />,
  }
  
  return (
    <Badge 
      variant="outline"
      className={`${config.color} ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <span className="flex items-center gap-1.5">
        {icons[status]}
        {config.label}
      </span>
    </Badge>
  )
}

interface InvitationStatusBadgeProps {
  status: InvitationStatus
  className?: string
}

export function InvitationStatusBadge({ status, className = '' }: InvitationStatusBadgeProps) {
  const config = INVITATION_STATUS_CONFIG[status]
  
  const icons: Record<InvitationStatus, React.ReactNode> = {
    pending: <Clock className="h-3 w-3" />,
    viewed: <Eye className="h-3 w-3" />,
    quote_submitted: <Send className="h-3 w-3" />,
    declined: <XCircle className="h-3 w-3" />,
    expired: <Clock className="h-3 w-3" />,
  }
  
  return (
    <Badge 
      variant="outline"
      className={`${config.color} ${config.bgColor} ${className}`}
    >
      <span className="flex items-center gap-1.5">
        {icons[status]}
        {config.label}
      </span>
    </Badge>
  )
}

interface AmountBadgeProps {
  amount: number
  currency?: string
  discount?: number
  finalAmount?: number
  className?: string
}

export function AmountBadge({ amount, currency = 'EUR', discount, finalAmount, className = '' }: AmountBadgeProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(value / 100)
  }
  
  if (discount && finalAmount) {
    return (
      <div className={`flex flex-col items-end ${className}`}>
        <span className="text-sm text-gray-500 line-through">{formatPrice(amount)}</span>
        <span className="text-lg font-semibold text-green-600">{formatPrice(finalAmount)}</span>
        <span className="text-xs text-green-600">(-{discount}% desc.)</span>
      </div>
    )
  }
  
  return (
    <span className={`text-lg font-semibold ${className}`}>
      {formatPrice(amount)}
    </span>
  )
}
