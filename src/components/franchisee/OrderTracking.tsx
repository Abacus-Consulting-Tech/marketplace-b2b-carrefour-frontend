/**
 * Order Tracking Component
 * 
 * Componente para mostrar información de tracking de envío
 */

'use client'

import { TrackingInfo } from '@/types/orders-franchisee'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, Package, CheckCircle2, XCircle, Clock, ExternalLink, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/api/orders-franchisee-client'

interface OrderTrackingProps {
  tracking: TrackingInfo
}

export function OrderTracking({ tracking }: OrderTrackingProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-blue-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregado'
      case 'in_transit':
        return 'En tránsito'
      case 'out_for_delivery':
        return 'En reparto'
      case 'failed':
        return 'Incidencia'
      default:
        return 'Pendiente'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500'
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-blue-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(tracking.status)}
              Información de Envío
            </CardTitle>
            <CardDescription>
              Transportista: {tracking.carrier}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(tracking.status)}>
            {getStatusLabel(tracking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tracking Number */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Número de seguimiento</p>
            <p className="text-lg font-mono font-semibold">{tracking.tracking_number}</p>
          </div>
          {tracking.tracking_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={tracking.tracking_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Seguir envío
              </a>
            </Button>
          )}
        </div>

        {/* Delivery Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tracking.shipped_at && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha de envío</p>
              <p className="font-semibold">{formatDate(tracking.shipped_at)}</p>
            </div>
          )}
          {tracking.estimated_delivery && !tracking.delivered_at && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Entrega estimada</p>
              <p className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                {formatDate(tracking.estimated_delivery)}
              </p>
            </div>
          )}
          {tracking.delivered_at && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha de entrega</p>
              <p className="font-semibold text-green-600">{formatDate(tracking.delivered_at)}</p>
            </div>
          )}
        </div>

        {/* Tracking Updates */}
        {tracking.updates && tracking.updates.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Historial de seguimiento</h4>
            <div className="space-y-4">
              {tracking.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? getStatusColor(tracking.status) : 'bg-gray-300'
                    }`} />
                    {index < tracking.updates.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-1" />
                    )}
                  </div>

                  {/* Update info */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{update.status}</p>
                        <p className="text-sm text-gray-600">{update.description}</p>
                        {update.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {update.location}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(update.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
