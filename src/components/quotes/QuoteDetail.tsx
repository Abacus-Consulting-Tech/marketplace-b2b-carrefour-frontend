/**
 * Quote Detail Component
 * 
 * Vista detallada de un presupuesto con acciones disponibles
 */

'use client'

import { Quote, QuoteSignature, SupplierInvitation } from '@/types/quotes'
import { QuoteStatusBadge, AmountBadge } from './QuoteStatusBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Calendar,
  Package,
  Shield,
  CreditCard,
  FileText,
  Download,
  Award,
  CheckCircle2,
  PenTool,
  Clock,
} from 'lucide-react'
import { quotesApi } from '@/lib/api/quotes-client'

interface QuoteDetailProps {
  quote: Quote
  invitation?: SupplierInvitation
  signature?: QuoteSignature
  onAward?: () => void
  onReject?: () => void
  onSign?: () => void
  className?: string
}

export function QuoteDetail({
  quote,
  invitation,
  signature,
  onAward,
  onReject,
  onSign,
  className = '',
}: QuoteDetailProps) {
  const canAward = quote.status === 'submitted' || quote.status === 'under_review'
  const canReject = quote.status === 'submitted' || quote.status === 'under_review'
  const canSign = quote.status === 'awarded' && !signature
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {quote.project_name}
            </h1>
            <p className="text-lg text-gray-600 mb-1">{quote.category_name}</p>
            <p className="text-sm text-gray-500">
              Proyecto: {quote.project_code} • Presupuesto: {quote.id}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <QuoteStatusBadge status={quote.status} />
            {quote.is_awarded && (
              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                <Award className="h-3 w-3 mr-1" />
                Adjudicado
              </Badge>
            )}
          </div>
        </div>
        
        {/* Amount */}
        <div className="flex items-baseline gap-4 pt-6 border-t">
          <span className="text-gray-600">Importe total:</span>
          <AmountBadge
            amount={quote.amount}
            discount={quote.discount_percentage}
            finalAmount={quote.final_amount}
          />
        </div>
      </Card>
      
      {/* Supplier Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Información del Proveedor
        </h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{quote.supplier_name}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{quote.supplier_email}</p>
          </div>
          
          {quote.supplier_company && (
            <div>
              <p className="text-sm text-gray-500">Empresa</p>
              <p className="font-medium">{quote.supplier_company}</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Quote Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Detalles del Presupuesto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quote.delivery_days && (
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Plazo de entrega</p>
                <p className="font-medium">{quote.delivery_days} días</p>
              </div>
            </div>
          )}
          
          {quote.warranty_months && (
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Garantía</p>
                <p className="font-medium">{quote.warranty_months} meses</p>
              </div>
            </div>
          )}
          
          {quote.payment_terms && (
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Condiciones de pago</p>
                <p className="font-medium">{quote.payment_terms}</p>
              </div>
            </div>
          )}
          
          {quote.submitted_at && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Fecha de envío</p>
                <p className="font-medium">{quotesApi.formatShortDate(quote.submitted_at)}</p>
              </div>
            </div>
          )}
          
          {quote.expires_at && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Válido hasta</p>
                <p className={`font-medium ${quotesApi.isExpired(quote.expires_at) ? 'text-red-600' : ''}`}>
                  {quotesApi.formatShortDate(quote.expires_at)}
                  {quotesApi.isExpired(quote.expires_at) && ' (Expirado)'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Items breakdown */}
      {quote.items && quote.items.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Desglose de Items</h2>
          
          <div className="space-y-4">
            {quote.items.map(item => (
              <div key={item.id} className="flex items-start justify-between pb-4 border-b last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {item.sku && <span>SKU: {item.sku}</span>}
                    <span>Cantidad: {item.quantity}</span>
                    <span>Precio unitario: {quotesApi.formatPrice(item.unit_price, quote.currency)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {quotesApi.formatPrice(item.total, quote.currency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    IVA {item.tax_rate}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Notes */}
      {quote.notes && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notas del Proveedor</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
        </Card>
      )}
      
      {/* PDF Download */}
      {quote.pdf_url && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Documentos</h2>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href={quote.pdf_url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Descargar Presupuesto (PDF)
            </a>
          </Button>
        </Card>
      )}
      
      {/* Signature Info */}
      {signature && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                Presupuesto Firmado
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-green-800">
                  Firmado por: <strong>{signature.franchisee_name}</strong>
                </p>
                <p className="text-green-800">
                  Fecha: <strong>{quotesApi.formatDate(signature.signed_at)}</strong>
                </p>
                <p className="text-green-800">
                  Método: <strong>{signature.signature_method === 'digital' ? 'Firma Digital' : 'Firma Electrónica'}</strong>
                </p>
              </div>
              {signature.signed_pdf_url && (
                <Button variant="outline" asChild className="mt-4" size="sm">
                  <a href={signature.signed_pdf_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Documento Firmado
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* Actions */}
      {(canAward || canReject || canSign) && (
        <Card className="p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-3">
            {canAward && onAward && (
              <Button onClick={onAward} className="bg-green-600 hover:bg-green-700">
                <Award className="h-4 w-4 mr-2" />
                Adjudicar Presupuesto
              </Button>
            )}
            
            {canReject && onReject && (
              <Button onClick={onReject} variant="destructive">
                Rechazar Presupuesto
              </Button>
            )}
            
            {canSign && onSign && (
              <Button onClick={onSign} className="bg-blue-600 hover:bg-blue-700">
                <PenTool className="h-4 w-4 mr-2" />
                Firmar Presupuesto
              </Button>
            )}
          </div>
          
          {quote.status === 'under_review' && (
            <p className="text-sm text-gray-600 mt-4">
              ℹ️ Revisa cuidadosamente todos los detalles antes de tomar una decisión
            </p>
          )}
        </Card>
      )}
      
      {/* Rejection reason */}
      {quote.rejection_reason && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Motivo de Rechazo</h2>
          <p className="text-red-800">{quote.rejection_reason}</p>
        </Card>
      )}
    </div>
  )
}
