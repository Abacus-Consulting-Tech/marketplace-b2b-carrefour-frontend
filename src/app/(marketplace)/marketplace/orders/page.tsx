/**
 * Franchisee Orders Page
 * 
 * Página de listado de pedidos del franquiciado
 * Route: /marketplace/orders
 */

import { OrdersList } from '@/components/franchisee/OrdersList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'

export default function FranchiseeOrdersPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8" />
              Mis Pedidos
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona y consulta el estado de tus pedidos
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <OrdersList />
    </div>
  )
}

