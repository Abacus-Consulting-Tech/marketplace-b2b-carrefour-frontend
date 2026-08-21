'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { pricingApi } from '@/lib/api/products-pricing-client';
import { ProductStatusBadge } from './ProductStatusBadge';
import { calculateFinalPrice } from '@/lib/utils/pricing-calculator';
import type { Product, PricingStatus, Seller } from '@/types/products-pricing';
import { 
  Search, 
  Package, 
  Eye, 
  AlertCircle, 
  Loader2, 
  Percent,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from 'lucide-react';

interface ProductsListProps {
  sellerId: string;
}

export function ProductsList({ sellerId }: ProductsListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PricingStatus | 'all'>('all');

  // Fetch products and seller info on mount
  useEffect(() => {
    fetchData();
  }, [sellerId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch products
      const productsResponse = await pricingApi.getMyProducts(sellerId);
      setProducts(productsResponse.data);
      
      // Fetch seller markup info
      try {
        const markupResponse = await pricingApi.getSellerMarkup(sellerId);
        // Create a basic Seller object with the markup data
        const sellerData: Seller = {
          id: sellerId,
          name: 'Mi Empresa', // This would come from auth context in real app
          email: '',
          global_markup_percentage: markupResponse.data.global_markup_percentage,
          total_products: productsResponse.data.length,
          pending_products: productsResponse.data.filter(p => p.status === 'pending_approval').length,
          approved_products: productsResponse.data.filter(p => p.status === 'approved').length,
        };
        setSeller(sellerData);
      } catch (markupError) {
        console.error('Error fetching markup:', markupError);
        // Continue without markup info
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      toast({
        title: 'Error al cargar productos',
        description: 'No se pudieron cargar los productos. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = search === '' || product.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const counts = {
    all: products.length,
    pending_approval: products.filter(p => p.status === 'pending_approval').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/supplier/products/${productId}`);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getAppliedMarkup = (product: Product): number => {
    if (product.markup_percentage !== null && product.markup_percentage !== undefined) {
      return product.markup_percentage;
    }
    return seller?.global_markup_percentage || 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Cargando productos...</p>
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
      {/* Markup Info Card */}
      {seller && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-blue-600" />
              Mi Markup Global
            </CardTitle>
            <CardDescription>
              Este markup se aplica automáticamente a todos tus productos (salvo excepciones)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {seller.global_markup_percentage}%
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Markup aplicado por defecto
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Productos usando markup global:
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {products.filter(p => p.markup_percentage === null).length} de {products.length}
                </div>
              </div>
            </div>
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                El equipo de Carrefour puede establecer un markup específico para productos individuales al aprobarlos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.all}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{counts.pending_approval}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                Todos ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="pending_approval">
                Pendientes ({counts.pending_approval})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aprobados ({counts.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rechazados ({counts.rejected})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} Producto{filteredProducts.length !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>
            {statusFilter === 'all'
              ? 'Todos tus productos propuestos'
              : statusFilter === 'pending_approval'
              ? 'Productos pendientes de aprobación'
              : statusFilter === 'approved'
              ? 'Productos aprobados y activos'
              : 'Productos rechazados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {search
                  ? 'No se encontraron productos con ese criterio'
                  : statusFilter === 'all'
                  ? 'Aún no has propuesto productos'
                  : `No hay productos ${statusFilter === 'pending_approval' ? 'pendientes' : statusFilter === 'approved' ? 'aprobados' : 'rechazados'}`}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio Base</TableHead>
                    <TableHead>Markup</TableHead>
                    <TableHead>Precio Final</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const appliedMarkup = getAppliedMarkup(product);
                    const finalPriceCalc = calculateFinalPrice(product.base_price, appliedMarkup);
                    const isCustomMarkup = product.markup_percentage !== null && product.markup_percentage !== undefined;

                    return (
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
                            <div className="max-w-xs">
                              <div className="font-medium">{product.title}</div>
                              <div className="text-xs text-gray-500">
                                Pack de {product.units_per_pack} uds
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatPrice(product.base_price)}</div>
                          <div className="text-xs text-gray-500">
                            {formatPrice(product.base_price / product.units_per_pack)}/ud
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{appliedMarkup}%</span>
                          </div>
                          {product.status === 'approved' && (
                            <Badge variant={isCustomMarkup ? "default" : "secondary"} className="text-xs mt-1">
                              {isCustomMarkup ? 'Específico' : 'Global'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.status === 'approved' ? (
                            <div>
                              <div className="flex items-center gap-1 font-medium text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                {formatPrice(finalPriceCalc.finalPrice)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatPrice(finalPriceCalc.finalPrice / product.units_per_pack)}/ud
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <ProductStatusBadge status={product.status} />
                          {product.status === 'rejected' && product.rejection_reason && (
                            <Alert variant="destructive" className="mt-2 max-w-sm">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>Motivo:</strong> {product.rejection_reason}
                              </AlertDescription>
                            </Alert>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(product.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
