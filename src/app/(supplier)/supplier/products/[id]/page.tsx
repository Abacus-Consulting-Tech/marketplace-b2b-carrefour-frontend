'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { pricingApi } from '@/lib/api/products-pricing-client';
import { ProductStatusBadge } from '@/components/supplier/ProductStatusBadge';
import { useAuthStore } from '@/lib/store/auth';
import { featureFlags } from '@/config/feature-flags';
import type { Product } from '@/types/products-pricing';
import {
  ArrowLeft,
  Package,
  Loader2,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Tag,
  Barcode,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const sellerId = user?.seller_id ?? (featureFlags.shouldUseMock('pricing') ? user?.id : undefined);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProductDetails();
  }, [productId, user]);

  const fetchProductDetails = async () => {
    if (!sellerId) {
      setIsLoading(false);
      setError('No se ha podido identificar la cuenta de proveedor. Cierra sesión y vuelve a iniciar sesión.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all products and find the one we need
      const response = await pricingApi.getMyProducts(sellerId);
      const foundProduct = response.data.find(p => p.id === productId);

      if (!foundProduct) {
        setError('Producto no encontrado');
        toast({
          title: 'Producto no encontrado',
          description: 'El producto que buscas no existe o no tienes acceso a él.',
          variant: 'destructive',
        });
        return;
      }

      setProduct(foundProduct);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      toast({
        title: 'Error al cargar producto',
        description: 'No se pudo cargar la información del producto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleResubmitRejectedProduct = async () => {
    if (!sellerId || !product) return;

    try {
      setIsResubmitting(true);
      const response = await pricingApi.resubmitRejectedProduct(product.id, sellerId);
      setProduct(response.data.product);
      toast({
        title: 'Producto reenviado',
        description: 'El producto vuelve a estar pendiente de aprobación.',
      });
    } catch (err) {
      console.error('Error resubmitting product:', err);
      toast({
        title: 'Error al reenviar producto',
        description: 'No se pudo reenviar el producto a aprobación.',
        variant: 'destructive',
      });
    } finally {
      setIsResubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-500">Cargando producto...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/supplier/products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mis Productos
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Producto no encontrado'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const canResubmitProduct = product.status === 'rejected' || Boolean(product.rejection_reason || product.rejected_at);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/supplier/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mis Productos
        </Button>

        <ProductStatusBadge status={product.status} />
      </div>

      {/* Rejection Alert */}
      {canResubmitProduct && (
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Motivo del rechazo:</strong> {product.rejection_reason || 'No especificado'}
          </AlertDescription>
        </Alert>
      )}

      {canResubmitProduct && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-900">Producto rechazado</p>
              <p className="text-sm text-red-700">
                Puedes corregir la propuesta y reenviarla para una nueva revisión.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResubmitRejectedProduct}
              disabled={isResubmitting}
              className="border-red-300 bg-white text-red-700 hover:bg-red-50"
            >
              {isResubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Reenviar a aprobación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Alert */}
      {product.status === 'pending_approval' && (
        <Alert className="mb-6 bg-orange-50 border-orange-200">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Tu producto está pendiente de revisión por el equipo de Carrefour. Te notificaremos cuando sea aprobado.
          </AlertDescription>
        </Alert>
      )}

      {/* Approved Alert */}
      {product.status === 'approved' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ¡Producto aprobado! Ya está disponible para la venta en el marketplace.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                {product.description && (
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pricing Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Información de Precios
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-gray-500 mb-1">Precio Propuesto (Pack)</div>
                  <div className="text-2xl font-bold">{formatPrice(product.base_price)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatPrice(product.base_price / product.units_per_pack)} por unidad
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm text-gray-500 mb-1">PCB Mínimo</div>
                  <div className="text-2xl font-bold">{product.units_per_pack}</div>
                  <div className="text-sm text-gray-600 mt-1">unidades</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Información Adicional
              </h3>
              
              <div className="space-y-3">
                {product.category_id && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Categoría:</span>
                    <span className="text-sm font-medium">{product.category_id}</span>
                  </div>
                )}

                {product.subcategory && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Subcategoría:</span>
                    <span className="text-sm font-medium">{product.subcategory}</span>
                  </div>
                )}

                {product.ean && (
                  <div className="flex items-center gap-2">
                    <Barcode className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">EAN:</span>
                    <span className="text-sm font-mono font-medium">{product.ean}</span>
                  </div>
                )}

                {product.tax_rate !== undefined && (
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">IVA:</span>
                    <span className="text-sm font-medium">{product.tax_rate}%</span>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-sm text-gray-500">Etiquetas:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Línea de Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="w-px h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-medium">Producto Propuesto</div>
                  <div className="text-xs text-gray-500">
                    {new Date(product.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {product.status === 'approved' && product.approved_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-700">Aprobado</div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.approved_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {product.approved_by && (
                      <div className="text-xs text-gray-500 mt-1">
                        Por: {product.approved_by}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product.status === 'rejected' && product.rejected_at && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-700">Rechazado</div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.rejected_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {product.rejected_by && (
                      <div className="text-xs text-gray-500 mt-1">
                        Por: {product.rejected_by}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product.status === 'pending_approval' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-orange-700">En Revisión</div>
                    <div className="text-xs text-gray-500">
                      Esperando aprobación del equipo de Carrefour
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
