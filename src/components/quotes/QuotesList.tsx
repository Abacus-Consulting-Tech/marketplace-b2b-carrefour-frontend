/**
 * Quotes List - Franchisee View
 * 
 * Lista de presupuestos recibidos para proyectos de apertura
 */

'use client'

import { useState, useEffect } from 'react'
import { Quote, QuoteSearchParams } from '@/types/quotes'
import { quotesApi } from '@/lib/api/quotes-client'
import { QuoteStatusBadge, AmountBadge } from './QuoteStatusBadge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, FileText, Calendar, Package, Building2, Award } from 'lucide-react'
import Link from 'next/link'

interface QuotesListProps {
  franchiseeId: string
  projectId?: string  // Optional: filter by specific project
  className?: string
}

export function QuotesList({ franchiseeId, projectId, className = '' }: QuotesListProps) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  useEffect(() => {
    loadQuotes()
  }, [franchiseeId, projectId, statusFilter])
  
  async function loadQuotes() {
    setLoading(true)
    try {
      const params: QuoteSearchParams = {
        project_id: projectId,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        sort_by: 'submitted_at',
        sort_order: 'desc',
      }
      
      const response = await quotesApi.getQuotesForFranchisee(franchiseeId, params)
      setQuotes(response.quotes)
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredQuotes = quotes.filter(quote => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      quote.project_name.toLowerCase().includes(searchLower) ||
      quote.category_name.toLowerCase().includes(searchLower) ||
      quote.supplier_name.toLowerCase().includes(searchLower) ||
      quote.id.toLowerCase().includes(searchLower)
    )
  })
  
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por proyecto, categoría, proveedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="submitted">Enviados</SelectItem>
            <SelectItem value="under_review">En Revisión</SelectItem>
            <SelectItem value="awarded">Adjudicados</SelectItem>
            <SelectItem value="rejected">Rechazados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredQuotes.length} {filteredQuotes.length === 1 ? 'presupuesto' : 'presupuestos'}
        </p>
        
        {filteredQuotes.some(q => q.is_awarded) && (
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <Award className="h-3 w-3 mr-1" />
            {filteredQuotes.filter(q => q.is_awarded).length} adjudicados
          </Badge>
        )}
      </div>
      
      {/* Quotes list */}
      {filteredQuotes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay presupuestos
          </h3>
          <p className="text-gray-600">
            {search || statusFilter !== 'all'
              ? 'No se encontraron presupuestos con los filtros seleccionados'
              : 'Aún no has recibido presupuestos para tus tiendas'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map(quote => (
            <Link key={quote.id} href={`/marketplace/quotes/${quote.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quote.project_name}
                      </h3>
                      {quote.is_awarded && (
                        <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                          <Award className="h-3 w-3 mr-1" />
                          Adjudicado
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {quote.category_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ref: {quote.id}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <QuoteStatusBadge status={quote.status} />
                    <AmountBadge
                      amount={quote.amount}
                      discount={quote.discount_percentage}
                      finalAmount={quote.final_amount}
                    />
                  </div>
                </div>
                
                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Proveedor</p>
                      <p className="font-medium text-gray-900">{quote.supplier_name}</p>
                    </div>
                  </div>
                  
                  {quote.delivery_days && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Plazo entrega</p>
                        <p className="font-medium text-gray-900">{quote.delivery_days} días</p>
                      </div>
                    </div>
                  )}
                  
                  {quote.submitted_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Enviado</p>
                        <p className="font-medium text-gray-900">
                          {quotesApi.formatShortDate(quote.submitted_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Notes preview */}
                {quote.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium">Notas: </span>
                      {quote.notes}
                    </p>
                  </div>
                )}
                
                {/* Expiry warning */}
                {quote.expires_at && quotesApi.isExpired(quote.expires_at) && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-700">
                      ⚠️ Este presupuesto ha expirado
                    </p>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
