'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OrderDetail } from '@/components/supplier/OrderDetail'
import { supplierOrdersApi } from '@/lib/api/orders-supplier-client'
import type { SupplierOrder } from '@/types/orders-supplier'

export default function SupplierOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<SupplierOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await supplierOrdersApi.getOrderById(orderId)
      if (data) {
        setOrder(data)
      } else {
        setError('Pedido no encontrado')
      }
    } catch (err) {
      console.error('Error loading order:', err)
      setError('Error al cargar el pedido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderUpdate = (updatedOrder: SupplierOrder) => {
    setOrder(updatedOrder)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 animate-pulse rounded w-64"></div>
        <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link href="/supplier/orders">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Pedidos
          </Button>
        </Link>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error || 'Pedido no encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              El pedido que buscas no existe o no tienes permiso para verlo.
            </p>
            <Button onClick={() => router.push('/supplier/orders')}>
              Volver a Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/supplier/orders">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Pedidos
        </Button>
      </Link>

      {/* Order Detail */}
      <OrderDetail order={order} onOrderUpdate={handleOrderUpdate} />
    </div>
  )
}
