/**
 * Franchisee Order Detail Page
 * 
 * Página de detalle de un pedido específico
 * Route: /marketplace/orders/[id]
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrderById, cancelOrder } from '@/lib/api/orders-franchisee-client'
import { FranchiseeOrder } from '@/types/orders-franchisee'
import { OrderDetail } from '@/components/franchisee/OrderDetail'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { ArrowLeft, Loader2, XCircle, Package } from 'lucide-react'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function FranchiseeOrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<FranchiseeOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await getOrderById(params.id)
      setOrder(response.order)
    } catch (error) {
      console.error('Error al cargar pedido:', error)
      toast({
        title: 'Error al cargar el pedido',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    try {
      setCancelling(true)
      const response = await cancelOrder({
        order_id: order.id,
        reason: 'Cancelado por el cliente'
      })
      
      setOrder(response.order)
      toast({
        title: 'Pedido cancelado correctamente',
      })
      setCancelDialogOpen(false)
    } catch (error: any) {
      console.error('Error al cancelar pedido:', error)
      toast({
        title: error.message || 'Error al cancelar el pedido',
        variant: 'destructive',
      })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pedido no encontrado</h3>
                <p className="text-gray-600 mt-2">
                  No se pudo encontrar el pedido solicitado
                </p>
              </div>
              <Button asChild>
                <Link href="/marketplace/orders">
                  Volver a Mis Pedidos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Pedidos
            </Link>
          </Button>

          {order.can_cancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar Pedido
            </Button>
          )}
        </div>
      </div>

      {/* Order Detail */}
      <OrderDetail order={order} />

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará el pedido {order.display_id}. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              No, mantener pedido
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelando...
                </>
              ) : (
                'Sí, cancelar pedido'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
