'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { pricingApi } from '@/lib/api/products-pricing-client';
import { formatPrice } from '@/lib/utils/pricing-calculator';
import type { Product, Seller } from '@/types/products-pricing';
import { Package, Eye, Loader2, AlertCircle, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PricingQueueProps {
  onSelectProduct?: (product: Product) => void;
}

export function PricingQueue({ onSelectProduct }: PricingQueueProps) {
  const { toast } = useToast();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string>('all');

  useEffect(() => {
    Promise.all([fetchPendingProducts(), fetchSellers()]);
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters = selectedSellerId !== 'all' ? { seller_id: selectedSellerId } : undefined;
      const response = await pricingApi.getPendingProducts(filters);

      setPendingProducts(response.data.products);
    } catch (err) {
      console.error('Error fetching pending products:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos pendientes');
      toast({
        title: 'Error al cargar productos',
        description: 'No se pudieron cargar los productos pendientes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await pricingApi.getAllSellers();
      setSellers(response.data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, [selectedSellerId]);

  const handleReview = (product: Product) => {
    onSelectProduct?.(product);
  };

  const refreshQueue = () => {
    fetchPendingProducts();
  };

  if (isLoading && pendingProducts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Cargando productos pendientes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Productos Pendientes</CardDescription>
            <CardTitle className="text-3xl">{pendingProducts.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Proveedores Activos</CardDescription>
            <CardTitle className="text-3xl">
              {new Set(pendingProducts.map(p => p.seller_id)).size}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valor Total Propuesto</CardDescription>
            <CardTitle className="text-3xl">
              {formatPrice(pendingProducts.reduce((sum, p) => sum + p.base_price, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proveedores</SelectItem>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name} ({seller.pending_products || 0} pendientes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={refreshQueue}>
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cola de Aprobación</CardTitle>
          <CardDescription>
            Productos esperando revisión y aprobación de precios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedSellerId === 'all'
                  ? '¡Excelente! No hay productos pendientes de aprobación'
                  : 'Este proveedor no tiene productos pendientes'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Precio Base</TableHead>
                    <TableHead>Unidades/Pack</TableHead>
                    <TableHead>Fecha Propuesta</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{product.title}</div>
                            {product.category_id && (
                              <div className="text-sm text-gray-500">{product.category_id}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{product.seller_name || 'N/A'}</div>
                          <div className="text-gray-500">{product.seller_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{formatPrice(product.base_price)}</div>
                      </TableCell>
                      <TableCell>{product.units_per_pack}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleReview(product)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Revisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export refresh function for parent components
export type PricingQueueHandle = {
  refresh: () => void;
};
