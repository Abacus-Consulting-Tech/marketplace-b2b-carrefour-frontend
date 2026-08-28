'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Filter, Package, Percent, RotateCcw, Save, Search, TrendingUp, User } from 'lucide-react';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { Product, Seller } from '@/types/products-pricing';
import { calculateFinalPrice } from '@/lib/utils/pricing-calculator';

export default function ProductMarkupPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [useGlobalMarkup, setUseGlobalMarkup] = useState(true);
  const [productMarkup, setProductMarkup] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, sellersResponse] = await Promise.all([
        pricingApi.getPricedProducts({ status: 'approved', limit: 100 }),
        pricingApi.getAllSellers(),
      ]);

      setProducts(productsResponse.data.products);
      setSellers(sellersResponse.data);
    } catch (err) {
      console.error('Error loading product markups:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar markups de productos');
    } finally {
      setLoading(false);
    }
  }

  function getSeller(product: Product): Seller | undefined {
    return sellers.find((seller) => seller.id === product.seller_id);
  }

  function getAppliedMarkup(product: Product): number {
    return product.markup_percentage ?? getSeller(product)?.global_markup_percentage ?? 0;
  }

  function getFinalPrice(product: Product): number {
    return calculateFinalPrice(product.base_price, product.markup_percentage, getSeller(product)?.global_markup_percentage ?? 0).finalPrice;
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  function openMarkupDialog(product: Product) {
    setSelectedProduct(product);
    setUseGlobalMarkup(product.markup_percentage === null || product.markup_percentage === undefined);
    setProductMarkup(product.markup_percentage?.toString() ?? getAppliedMarkup(product).toString());
    setReason('');
    setError(null);
    setSuccess(null);
  }

  async function handleSaveMarkup() {
    if (!selectedProduct) return;

    const markupValue = parseFloat(productMarkup);
    if (!useGlobalMarkup && (isNaN(markupValue) || markupValue < 0 || markupValue > 500)) {
      setError('El markup debe estar entre 0% y 500%');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await pricingApi.updateProductMarkup(selectedProduct.id, {
        markup_percentage: useGlobalMarkup ? null : markupValue,
        reason: reason.trim() || undefined,
      });

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === selectedProduct.id ? response.data.product : product
        )
      );
      setSuccess(response.data.message);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error updating product markup:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar markup del producto');
    } finally {
      setSaving(false);
    }
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesSeller = selectedSellerId === 'all' || product.seller_id === selectedSellerId;
    const searchableText = [product.title, product.description, product.ean, product.seller_name, getSeller(product)?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);

    return matchesSeller && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Markup por Producto</h1>
        <p className="text-muted-foreground mt-2">
          Revisa el markup aplicado a productos aprobados y configura excepciones individuales.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="seller-filter">Proveedor</Label>
              <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                <SelectTrigger id="seller-filter">
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proveedores</SelectItem>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-search">Producto</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="product-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar por producto, EAN o proveedor"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSellerId('all');
                  setSearchQuery('');
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos aprobados</CardTitle>
          <CardDescription>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} con precio activo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay productos para revisar</p>
              <p className="text-sm mt-1">Prueba con otros filtros o aprueba productos pendientes primero.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Precio Base</TableHead>
                  <TableHead>Markup</TableHead>
                  <TableHead>Precio Final</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const seller = getSeller(product);
                  const usesGlobalMarkup = product.markup_percentage === null || product.markup_percentage === undefined;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">PCB Mínimo: {product.units_per_pack}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{product.seller_name || seller?.name || 'Proveedor'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(product.base_price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{getAppliedMarkup(product)}%</span>
                          <Badge variant={usesGlobalMarkup ? 'secondary' : 'outline'}>
                            {usesGlobalMarkup ? 'Global' : 'Específico'}
                          </Badge>
                        </div>
                        {usesGlobalMarkup && seller && (
                          <div className="text-xs text-muted-foreground mt-1">Proveedor: {seller.global_markup_percentage}%</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          {formatPrice(getFinalPrice(product))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => openMarkupDialog(product)}>
                          Editar markup
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Editar markup de producto</DialogTitle>
            <DialogDescription>
              Cambia el markup específico o vuelve al markup global del proveedor.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="font-medium">{selectedProduct.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Precio base: {formatPrice(selectedProduct.base_price)}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    checked={useGlobalMarkup}
                    onChange={() => setUseGlobalMarkup(true)}
                    className="h-4 w-4"
                  />
                  Usar markup global del proveedor
                  <Badge variant="secondary">{getSeller(selectedProduct)?.global_markup_percentage ?? 0}%</Badge>
                </label>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    checked={!useGlobalMarkup}
                    onChange={() => setUseGlobalMarkup(false)}
                    className="h-4 w-4"
                  />
                  Markup específico para este producto
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-markup">Markup específico (%)</Label>
                <Input
                  id="product-markup"
                  type="number"
                  step="0.01"
                  min="0"
                  max="500"
                  value={productMarkup}
                  onChange={(event) => {
                    setProductMarkup(event.target.value);
                    setUseGlobalMarkup(false);
                  }}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">Rango permitido: 0% - 500%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="markup-reason">Motivo del cambio</Label>
                <Textarea
                  id="markup-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Ej: Ajuste comercial específico para este producto"
                  rows={3}
                  disabled={saving}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMarkup} disabled={saving || (!useGlobalMarkup && !productMarkup)}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar markup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
