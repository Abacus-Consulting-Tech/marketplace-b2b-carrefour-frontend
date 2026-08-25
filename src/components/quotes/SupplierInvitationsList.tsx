/**
 * Supplier Invitations List
 * 
 * Lista de invitaciones recibidas para enviar presupuestos
 */

'use client'

import { useState, useEffect } from 'react'
import { SupplierInvitation } from '@/types/quotes'
import { quotesApi } from '@/lib/api/quotes-client'
import { InvitationStatusBadge } from './QuoteStatusBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Calendar,
  Building2,
  Send,
  X,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

interface SupplierInvitationsListProps {
  supplierId: string
  className?: string
}

export function SupplierInvitationsList({ supplierId, className = '' }: SupplierInvitationsListProps) {
  const [invitations, setInvitations] = useState<SupplierInvitation[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadInvitations()
  }, [supplierId])
  
  async function loadInvitations() {
    setLoading(true)
    try {
      const response = await quotesApi.getInvitationsForSupplier(supplierId)
      setInvitations(response.invitations)
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setLoading(false)
    }
  }
  
  function isNearDeadline(deadline?: string): boolean {
    if (!deadline) return false
    const daysUntil = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysUntil > 0 && daysUntil < 3 // Less than 3 days
  }
  
  function isExpired(deadline?: string): boolean {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }
  
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </Card>
        ))}
      </div>
    )
  }
  
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending' || inv.status === 'viewed')
  const completedInvitations = invitations.filter(inv => inv.status === 'quote_submitted')
  const declinedExpired = invitations.filter(inv => inv.status === 'declined' || inv.status === 'expired')
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Invitaciones Pendientes ({pendingInvitations.length})
          </h2>
          
          <div className="space-y-4">
            {pendingInvitations.map(invitation => (
              <Card key={invitation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invitation.project_name}
                      </h3>
                      {isNearDeadline(invitation.deadline) && !isExpired(invitation.deadline) && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgente
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {invitation.category_name}
                    </p>
                    {invitation.message && (
                      <p className="text-sm text-gray-500 italic mt-2">
                        "{invitation.message}"
                      </p>
                    )}
                  </div>
                  
                  <InvitationStatusBadge status={invitation.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Invitado</p>
                      <p className="font-medium text-gray-900">
                        {quotesApi.formatShortDate(invitation.invited_at)}
                      </p>
                    </div>
                  </div>
                  
                  {invitation.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Fecha límite</p>
                        <p className={`font-medium ${isExpired(invitation.deadline) ? 'text-red-600' : isNearDeadline(invitation.deadline) ? 'text-orange-600' : 'text-gray-900'}`}>
                          {quotesApi.formatShortDate(invitation.deadline)}
                          {isExpired(invitation.deadline) && ' (Expirado)'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {!isExpired(invitation.deadline) && (
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <Button asChild className="flex-1">
                      <Link href={`/supplier/quotes/new?invitation=${invitation.id}`}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Presupuesto
                      </Link>
                    </Button>
                    
                    <Button variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Declinar
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Completed */}
      {completedInvitations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Presupuestos Enviados ({completedInvitations.length})
          </h2>
          
          <div className="space-y-4">
            {completedInvitations.map(invitation => (
              <Card key={invitation.id} className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {invitation.project_name}
                    </h3>
                    <p className="text-sm text-gray-600">{invitation.category_name}</p>
                    {invitation.quote_status && (
                      <Badge variant="outline" className="mt-2">
                        {invitation.quote_status}
                      </Badge>
                    )}
                  </div>
                  
                  {invitation.quote_id && (
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/supplier/quotes/${invitation.quote_id}`}>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Presupuesto
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {invitations.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay invitaciones
          </h3>
          <p className="text-gray-600">
            Aún no has recibido invitaciones para enviar presupuestos
          </p>
        </Card>
      )}
    </div>
  )
}
