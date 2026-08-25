/**
 * Franchisee Quotes Page
 * 
 * Lista de presupuestos recibidos para proyectos de apertura
 */

'use client'

import { QuotesList } from '@/components/quotes/QuotesList'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'

export default function QuotesPage() {
  // TODO: Get from auth context
  const franchiseeId = 'cus_bcn_norte_001'
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Mis Presupuestos
            </h1>
            <p className="text-gray-600">
              Presupuestos recibidos para tus proyectos de apertura
            </p>
          </div>
        </div>
      </div>
      
      {/* Info Banner */}
      <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm text-blue-900">
            <p className="font-medium">¿Cómo funciona el sistema de presupuestos?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Crea un proyecto de apertura desde el módulo de Aperturas</li>
              <li>El equipo administrativo invita a proveedores cualificados</li>
              <li>Los proveedores envían sus presupuestos con todos los detalles</li>
              <li>Compara las ofertas y adjudica al mejor proveedor</li>
              <li>Firma digitalmente el presupuesto adjudicado</li>
            </ul>
          </div>
        </div>
      </Card>
      
      {/* Quotes List */}
      <QuotesList franchiseeId={franchiseeId} />
    </div>
  )
}
