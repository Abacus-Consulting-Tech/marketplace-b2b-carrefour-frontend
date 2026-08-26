/**
 * Quote Detail Page - Franchisee
 * 
 * Detalle completo de un presupuesto con acciones disponibles
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Quote, QuoteStatus, GetQuoteResponse, AwardQuoteRequest, RejectQuoteRequest, SignQuoteRequest, UpdateQuoteStatusRequest } from '@/types/quotes'
import { quotesApi } from '@/lib/api/quotes-client'
import { QuoteDetail } from '@/components/quotes/QuoteDetail'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

const quoteStatusOptions: Array<{ value: QuoteStatus; label: string }> = [
  { value: 'draft', label: 'Borrador' },
  { value: 'submitted', label: 'Enviado' },
  { value: 'under_review', label: 'En Revisión' },
  { value: 'awarded', label: 'Adjudicado' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'expired', label: 'Expirado' },
]

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const quoteId = params.id as string
  
  const [data, setData] = useState<GetQuoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showAwardDialog, setShowAwardDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showSignDialog, setShowSignDialog] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [statusProcessing, setStatusProcessing] = useState(false)
  
  // Form states
  const [awardNotes, setAwardNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [signatureConsent, setSignatureConsent] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<QuoteStatus>('submitted')
  const [statusReason, setStatusReason] = useState('')
  
  useEffect(() => {
    loadQuote()
  }, [quoteId])
  
  async function loadQuote() {
    setLoading(true)
    try {
      const response = await quotesApi.getQuoteById(quoteId)
      if (!response) {
        toast({
          title: 'Error',
          description: 'Presupuesto no encontrado',
          variant: 'destructive',
        })
        router.push('/marketplace/quotes')
        return
      }
      setData(response)
      setSelectedStatus(response.quote.status)
    } catch (error) {
      console.error('Error loading quote:', error)
      toast({
        title: 'Error',
        description: 'Error al cargar el presupuesto',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus() {
    if (!data?.quote || selectedStatus === data.quote.status) return
    if (selectedStatus === 'rejected' && !statusReason.trim()) {
      toast({
        title: 'Motivo requerido',
        description: 'Indica un motivo para cambiar el presupuesto a rechazado',
        variant: 'destructive',
      })
      return
    }

    setStatusProcessing(true)
    try {
      const request: UpdateQuoteStatusRequest = {
        quote_id: data.quote.id,
        status: selectedStatus,
        reason: statusReason || undefined,
      }

      await quotesApi.updateQuoteStatus(request)

      toast({
        title: 'Estado actualizado',
        description: 'El estado del presupuesto se ha actualizado correctamente',
      })

      setStatusReason('')
      await loadQuote()
    } catch (error) {
      console.error('Error updating quote status:', error)
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado del presupuesto',
        variant: 'destructive',
      })
    } finally {
      setStatusProcessing(false)
    }
  }
  
  async function handleAward() {
    if (!data?.quote) return
    
    setProcessing(true)
    try {
      const request: AwardQuoteRequest = {
        quote_id: data.quote.id,
        internal_notes: awardNotes || undefined,
      }
      
      await quotesApi.awardQuote(request)
      
      toast({
        title: 'Presupuesto Adjudicado',
        description: 'El presupuesto ha sido adjudicado exitosamente',
      })
      
      setShowAwardDialog(false)
      await loadQuote() // Reload to show updated state
    } catch (error) {
      console.error('Error awarding quote:', error)
      toast({
        title: 'Error',
        description: 'Error al adjudicar el presupuesto',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }
  
  async function handleReject() {
    if (!data?.quote || !rejectReason.trim()) return
    
    setProcessing(true)
    try {
      const request: RejectQuoteRequest = {
        quote_id: data.quote.id,
        reason: rejectReason,
      }
      
      await quotesApi.rejectQuote(request)
      
      toast({
        title: 'Presupuesto Rechazado',
        description: 'El presupuesto ha sido rechazado',
      })
      
      setShowRejectDialog(false)
      await loadQuote()
    } catch (error) {
      console.error('Error rejecting quote:', error)
      toast({
        title: 'Error',
        description: 'Error al rechazar el presupuesto',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }
  
  async function handleSign() {
    if (!data?.quote || !signatureConsent) return
    
    setProcessing(true)
    try {
      const request: SignQuoteRequest = {
        quote_id: data.quote.id,
        signature_method: 'digital',
        consent_text: 'Acepto los términos y condiciones del presupuesto',
        terms_version: 'v2.1',
      }
      
      await quotesApi.signQuote(request)
      
      toast({
        title: 'Presupuesto Firmado',
        description: 'El documento ha sido firmado digitalmente',
      })
      
      setShowSignDialog(false)
      await loadQuote()
    } catch (error) {
      console.error('Error signing quote:', error)
      toast({
        title: 'Error',
        description: 'Error al firmar el presupuesto',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }
  
  if (!data?.quote) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Presupuesto no encontrado</h2>
          <p className="text-gray-600 mb-6">El presupuesto que buscas no existe</p>
          <Button asChild>
            <Link href="/marketplace/quotes">Volver a Presupuestos</Link>
          </Button>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/marketplace/quotes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Presupuestos
          </Link>
        </Button>
      </div>
      
      {/* Quote Detail */}
      <QuoteDetail
        quote={data.quote}
        invitation={data.invitation}
        signature={data.signature}
        onAward={() => setShowAwardDialog(true)}
        onReject={() => setShowRejectDialog(true)}
        onSign={() => setShowSignDialog(true)}
      />

      {/* Status Control */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-950">Cambiar estado del presupuesto</h2>
            <p className="text-sm text-blue-800 mt-1">
              Permite reabrir, adjudicar, rechazar o expirar el presupuesto durante la demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="quote-status">Estado</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as QuoteStatus)}>
                <SelectTrigger id="quote-status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {quoteStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-reason">Motivo / notas</Label>
              <Input
                id="status-reason"
                value={statusReason}
                onChange={(event) => setStatusReason(event.target.value)}
                placeholder={selectedStatus === 'rejected' ? 'Motivo obligatorio para rechazo' : 'Opcional'}
              />
            </div>

            <Button
              onClick={handleUpdateStatus}
              disabled={statusProcessing || selectedStatus === data.quote.status}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {statusProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cambiando...
                </>
              ) : (
                'Cambiar estado'
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Award Dialog */}
      <AlertDialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adjudicar Presupuesto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres adjudicar este presupuesto a {data.quote.supplier_name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Label htmlFor="award-notes">Notas internas (opcional)</Label>
            <Textarea
              id="award-notes"
              placeholder="Agrega notas internas sobre la adjudicación..."
              value={awardNotes}
              onChange={e => setAwardNotes(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAward} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adjudicando...
                </>
              ) : (
                'Adjudicar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Presupuesto</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, indica el motivo del rechazo
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Label htmlFor="reject-reason">Motivo de rechazo *</Label>
            <Textarea
              id="reject-reason"
              placeholder="Ej: Precio superior al presupuesto aprobado"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={processing || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rechazando...
                </>
              ) : (
                'Rechazar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Sign Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Firmar Presupuesto</DialogTitle>
            <DialogDescription>
              Firma digital del presupuesto adjudicado
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <p><strong>Proveedor:</strong> {data.quote.supplier_name}</p>
              <p><strong>Importe:</strong> {quotesApi.formatPrice(data.quote.final_amount || data.quote.amount, data.quote.currency)}</p>
              <p className="text-xs text-gray-600 mt-4">
                Al firmar, aceptas los términos y condiciones del presupuesto. Este documento será legalmente vinculante.
              </p>
            </div>
            
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="consent"
                checked={signatureConsent}
                onChange={e => setSignatureConsent(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm">
                Acepto los términos y condiciones y confirmo que estoy autorizado para firmar este presupuesto
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignDialog(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button
              onClick={handleSign}
              disabled={processing || !signatureConsent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Firmando...
                </>
              ) : (
                'Firmar Digitalmente'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
