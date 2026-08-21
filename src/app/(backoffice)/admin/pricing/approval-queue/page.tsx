'use client';

/**
 * Pricing Approval Queue (Phase 7)
 * 
 * Admin page for reviewing and approving/rejecting product proposals
 * - View pending products from all suppliers
 * - Filter by supplier, category
 * - Approve with custom markup or use seller's global markup
 * - Reject with reason
 */

import { useState, useEffect } from 'react';
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
import { 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Euro,
  Percent,
  User,
  Calendar,
  Filter,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { 
  Product, 
  Seller,
  PendingProductsFilters,
} from '@/types/products-pricing';
import { calculateFinalPrice } from '@/lib/utils/pricing-calculator';

export default function ApprovalQueuePage() {
  // State - Data
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [total, setTotal] = useState(0);
  
  // State - Filters
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // State - Modals
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State - Form
  const [customMarkup, setCustomMarkup] = useState<string>('');
  const [useGlobalMarkup, setUseGlobalMarkup] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  // State - UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadPendingProducts();
    loadSellers();
  }, []);

  // Reload products when filters change
  useEffect(() => {
    loadPendingProducts();
  }, [selectedSellerId, selectedCategoryId]);

  /**
   * Load pending products with filters
   */
  async function loadPendingProducts() {
    try {
      setLoading(true);
      setError(null);
      
      const filters: PendingProductsFilters = {};
      if (selectedSellerId) filters.seller_id = selectedSellerId;
      if (selectedCategoryId) filters.category_id = selectedCategoryId;
      
      const response = await pricingApi.getPendingProducts(filters);
      
      if (response.data) {
        setProducts(response.data.products);
        setTotal(response.data.total);
      }
    } catch (err: any) {
      console.error('Error loading pending products:', err);
      setError(err.message || 'Error al cargar productos pendientes');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Load all sellers
   */
  async function loadSellers() {
    try {
      const response = await pricingApi.getAllSellers();
      if (response.data) {
        setSellers(response.data);
      }
    } catch (err) {
      console.error('Error loading sellers:', err);
    }
  }

  /**
   * Open approval dialog
   */
  function handleOpenApproval(product: Product) {
    setSelectedProduct(product);
    
    // Get seller's global markup as default
    const seller = sellers.find(s => s.id === product.seller_id);
    if (seller) {
      setCustomMarkup(seller.global_markup_percentage.toString());
      setUseGlobalMarkup(true);
    }
    
    setApprovalDialogOpen(true);
  }

  /**
   * Open rejection dialog
   */
  function handleOpenRejection(product: Product) {
    setSelectedProduct(product);
    setRejectionReason('');
    setRejectionDialogOpen(true);
  }

  /**
   * Approve product with markup
   */
  async function handleApprove() {
    if (!selectedProduct) return;

    const markupValue = parseFloat(customMarkup);
    
    if (isNaN(markupValue) || markupValue < 0 || markupValue > 500) {
      setError('El markup debe estar entre 0% y 500%');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await pricingApi.approveProduct(
        selectedProduct.id,
        markupValue
      );

      if (response.data) {
        setSuccess(`✅ ${response.data.message}`);
        setApprovalDialogOpen(false);
        setSelectedProduct(null);
        
        // Reload products
        await loadPendingProducts();
      }
    } catch (err: any) {
      console.error('Error approving product:', err);
      setError(err.message || 'Error al aprobar producto');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reject product with reason
   */
  async function handleReject() {
    if (!selectedProduct) return;

    if (!rejectionReason.trim()) {
      setError('Debes indicar un motivo de rechazo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await pricingApi.rejectProduct(
        selectedProduct.id,
        rejectionReason.trim()
      );

      if (response.data) {
        setSuccess(`✅ ${response.data.message}`);
        setRejectionDialogOpen(false);
        setSelectedProduct(null);
        setRejectionReason('');
        
        // Reload products
        await loadPendingProducts();
      }
    } catch (err: any) {
      console.error('Error rejecting product:', err);
      setError(err.message || 'Error al rechazar producto');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reset filters
   */
  function handleResetFilters() {
    setSelectedSellerId('');
    setSelectedCategoryId('');
  }

  /**
   * Format price in EUR
   */
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  /**
   * Format date in Spanish
   */
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  /**
   * Get seller info for product
   */
  function getSellerInfo(sellerId: string): Seller | undefined {
    return sellers.find(s => s.id === sellerId);
  }

  /**
   * Calculate preview price with markup
   */
  function calculatePreviewPrice(basePrice: number, markup: number): number {
    const result = calculateFinalPrice(basePrice, markup);
    return result.finalPrice;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cola de Aprobación de Productos</h1>
        <p className="text-muted-foreground mt-2">
          Revisa y aprueba productos propuestos por los proveedores
        </p>
      </div>

      {/* Alerts */}
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

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">{total}</CardTitle>
            <CardDescription>Productos pendientes de aprobación</CardDescription>
          </div>
          <Package className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="seller-filter">Proveedor</Label>
              <Select
                value={selectedSellerId}
                onValueChange={setSelectedSellerId}
              >
                <SelectTrigger id="seller-filter">
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los proveedores</SelectItem>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Categoría</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  <SelectItem value="cat_uniformes">Uniformes</SelectItem>
                  <SelectItem value="cat_tecnologia">Tecnología</SelectItem>
                  <SelectItem value="cat_alimentacion">Alimentación</SelectItem>
                  <SelectItem value="cat_oficina">Oficina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Pendientes</CardTitle>
          <CardDescription>
            {products.length} producto{products.length !== 1 ? 's' : ''} 
            {selectedSellerId || selectedCategoryId ? ' (filtrados)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay productos pendientes</p>
              <p className="text-sm mt-1">
                {selectedSellerId || selectedCategoryId 
                  ? 'Intenta con otros filtros'
                  : 'Todos los productos han sido revisados'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Precio Base</TableHead>
                  <TableHead>Markup Global</TableHead>
                  <TableHead>Precio Sugerido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const seller = getSellerInfo(product.seller_id);
                  const suggestedPrice = seller 
                    ? calculatePreviewPrice(product.base_price, seller.global_markup_percentage)
                    : product.base_price;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {product.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {product.units_per_pack} uds/pack
                            </Badge>
                            {product.variants && product.variants.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {product.variants.length} variantes
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{product.seller_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          {formatPrice(product.base_price)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pack de {product.units_per_pack} uds
                        </div>
                      </TableCell>
                      <TableCell>
                        {seller && (
                          <div className="flex items-center gap-1">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{seller.global_markup_percentage}%</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          {formatPrice(suggestedPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Con markup global
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(product.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenApproval(product)}
                            disabled={loading}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenRejection(product)}
                            disabled={loading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aprobar Producto</DialogTitle>
            <DialogDescription>
              Configura el markup para este producto. Puedes usar el markup global del proveedor o establecer uno personalizado.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              {/* Product Info */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                {selectedProduct.thumbnail && (
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{selectedProduct.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedProduct.seller_name}
                  </div>
                  <div className="text-sm font-medium mt-2">
                    Precio base: {formatPrice(selectedProduct.base_price)}
                  </div>
                </div>
              </div>

              {/* Markup Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="use-global"
                    checked={useGlobalMarkup}
                    onChange={() => {
                      setUseGlobalMarkup(true);
                      const seller = getSellerInfo(selectedProduct.seller_id);
                      if (seller) {
                        setCustomMarkup(seller.global_markup_percentage.toString());
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="use-global" className="cursor-pointer">
                    Usar markup global del proveedor
                    {(() => {
                      const seller = getSellerInfo(selectedProduct.seller_id);
                      if (!seller) return null;
                      return (
                        <Badge variant="secondary" className="ml-2">
                          {seller.global_markup_percentage}%
                        </Badge>
                      );
                    })()}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="use-custom"
                    checked={!useGlobalMarkup}
                    onChange={() => setUseGlobalMarkup(false)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="use-custom" className="cursor-pointer">
                    Markup personalizado para este producto
                  </Label>
                </div>
              </div>

              {/* Custom Markup Input */}
              <div className="space-y-2">
                <Label htmlFor="custom-markup">
                  Markup (%)
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="custom-markup"
                  type="number"
                  step="0.01"
                  min="0"
                  max="500"
                  value={customMarkup}
                  onChange={(e) => {
                    setCustomMarkup(e.target.value);
                    setUseGlobalMarkup(false);
                  }}
                  placeholder="ej: 12.5"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Rango permitido: 0% - 500%
                </p>
              </div>

              {/* Price Preview */}
              {customMarkup && !isNaN(parseFloat(customMarkup)) && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-900">
                      Precio final pack ({selectedProduct.units_per_pack} uds):
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {formatPrice(calculatePreviewPrice(selectedProduct.base_price, parseFloat(customMarkup)))}
                    </span>
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Precio por unidad: {
                      formatPrice(
                        calculatePreviewPrice(selectedProduct.base_price, parseFloat(customMarkup)) / 
                        selectedProduct.units_per_pack
                      )
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              disabled={loading || !customMarkup}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {loading ? 'Aprobando...' : 'Aprobar Producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rechazar Producto</DialogTitle>
            <DialogDescription>
              Indica el motivo del rechazo para que el proveedor pueda corregir y volver a proponer el producto.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              {/* Product Info */}
              <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
                {selectedProduct.thumbnail && (
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{selectedProduct.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedProduct.seller_name}
                  </div>
                  <div className="text-sm font-medium mt-2">
                    Precio base: {formatPrice(selectedProduct.base_price)}
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">
                  Motivo del Rechazo
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="ej: El precio base es demasiado alto para esta categoría. Por favor ajusta el precio a un máximo de €15/ud."
                  rows={4}
                  disabled={loading}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Este mensaje será visible para el proveedor
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {loading ? 'Rechazando...' : 'Rechazar Producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
