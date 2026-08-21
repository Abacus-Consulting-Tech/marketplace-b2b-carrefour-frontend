'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { pricingApi } from '@/lib/api/products-pricing-client';
import { PriceCalculator } from './PriceCalculator';
import { formatPrice } from '@/lib/utils/pricing-calculator';
import type { Product } from '@/types/products-pricing';
import { Package, CheckCircle2, XCircle, Calendar, User, Tag, Loader2 } from 'lucide-react';

interface ProductReviewPanelProps {
  product: Product;
  sellerGlobalMarkup?: number;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ProductReviewPanel({
  product,
  sellerGlobalMarkup = 0,
  onApprove,
  onReject,
}: ProductReviewPanelProps) {
  const { toast } = useToast();
  const [markupPercentage, setMarkupPercentage] = useState(sellerGlobalMarkup);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (markupPercentage < 0 || markupPercentage > 500) {
      toast({
        title: 'Error de validación',
        description: 'El markup debe estar entre 0% y 500%',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await pricingApi.approveProduct(product.id, markupPercentage);

      toast({
        title: '✅ Producto aprobado',
        description: `${product.title} ha sido aprobado con un markup del ${markupPercentage}%`,
      });

      setShowApproveDialog(false);
      onApprove?.();
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Error al aprobar',
        description: error instanceof Error ? error.message : 'No se pudo aprobar el producto',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Motivo requerido',
        description: 'Debes proporcionar un motivo para el rechazo',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await pricingApi.rejectProduct(product.id, rejectionReason);

      toast({
        title: 'Producto rechazado',
        description: `${product.title} ha sido rechazado`,
      });

      setShowRejectDialog(false);
      onReject?.();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: 'Error al rechazar',
        description: error instanceof Error ? error.message : 'No se pudo rechazar el producto',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl">{product.title}</CardTitle>
              <CardDescription className="mt-2">
                {product.description || 'Sin descripción'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Proveedor</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{product.seller_name || product.seller_id}</span>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Precio Base</Label>
              <div className="font-bold text-lg mt-1">
                {formatPrice(product.base_price)}
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Unidades/Pack</Label>
              <div className="font-medium mt-1">
                {product.units_per_pack} unidades
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Fecha Propuesta</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {new Date(product.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          {product.category_id && (
            <div>
              <Label className="text-xs text-gray-500">Categoría</Label>
              <div className="mt-1">
                <Badge variant="outline">{product.category_id}</Badge>
                {product.subcategory && (
                  <Badge variant="outline" className="ml-2">{product.subcategory}</Badge>
                )}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <Label className="text-xs text-gray-500">Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.ean && (
            <div>
              <Label className="text-xs text-gray-500">EAN</Label>
              <div className="font-mono text-sm mt-1">{product.ean}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Calculator */}
      <PriceCalculator
        basePrice={product.base_price}
        markup={markupPercentage}
        onMarkupChange={setMarkupPercentage}
        sellerGlobalMarkup={sellerGlobalMarkup}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={() => setShowRejectDialog(true)}
          className="flex-1"
          disabled={isSubmitting}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Rechazar
        </Button>
        <Button
          onClick={() => setShowApproveDialog(true)}
          className="flex-1"
          disabled={isSubmitting}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Aprobar
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Producto</DialogTitle>
            <DialogDescription>
              ¿Confirmas que deseas aprobar este producto con un markup del {markupPercentage}%?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Precio Base:</span>
                <span className="font-medium">{formatPrice(product.base_price)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Markup:</span>
                <span className="font-medium text-green-600">{markupPercentage}%</span>
              </div>
              <div className="h-px bg-green-300 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Precio Final:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(product.base_price * (1 + markupPercentage / 100))}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aprobando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmar Aprobación
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Producto</DialogTitle>
            <DialogDescription>
              Proporciona un motivo para el rechazo. Esto será enviado al proveedor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rejection_reason">Motivo del Rechazo *</Label>
              <Textarea
                id="rejection_reason"
                placeholder="Ej: El precio base excede el límite acordado en contrato..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rechazando...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirmar Rechazo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
