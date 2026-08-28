'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products-client';
import type { Product } from '@/types/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Package, DollarSign, Tag, Warehouse } from 'lucide-react';
import InventoryAdjustmentDialog from '@/components/admin/InventoryAdjustmentDialog';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      const response = await productsApi.getProduct({
        id,
        expand: 'variants,categories,supplier',
      });
      if (response.data?.product) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await productsApi.deleteProduct(id);
      router.push('/admin/products');
    } catch (err) {
      console.error('Error:', err);
    }
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!product) return <div className="text-center py-12">Producto no encontrado</div>;

  const totalStock = product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
  const price = product.variants[0]?.prices[0]?.amount ? product.variants[0].prices[0].amount / 100 : 0;

  function getStockBadgeVariant(stock: number) {
    if (stock === 0) return 'destructive';
    if (stock <= 20) return 'default';
    return 'secondary';
  }

  function handleAdjustStock(variant: any) {
    setSelectedVariant(variant);
    setAdjustDialogOpen(true);
  }

  function handleAdjustmentSuccess() {
    setAdjustDialogOpen(false);
    loadProduct();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.subtitle && (
              <p className="text-gray-600 mt-1">{product.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/products/${id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalStock}</p>
                <p className="text-sm text-gray-500">Stock Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{price.toFixed(2)} €</p>
                <p className="text-sm text-gray-500">Precio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Warehouse className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{product.variants.length}</p>
                <p className="text-sm text-gray-500">Opciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="variants">Opciones</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && (
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
              )}

              {product.supplier && (
                <div>
                  <label className="text-sm font-medium">Proveedor</label>
                  <p className="text-sm text-gray-600 mt-1">{product.supplier.name}</p>
                </div>
              )}

              {product.categories && product.categories.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Categorías</label>
                  <div className="flex gap-2 mt-1">
                    {product.categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Etiquetas</label>
                  <div className="flex gap-2 mt-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>Opciones ({product.variants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{variant.title}</p>
                        <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustStock(variant)}
                      >
                        <Warehouse className="h-4 w-4 mr-2" />
                        Ajustar Stock
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="font-medium">
                          {variant.prices[0] ? (variant.prices[0].amount / 100).toFixed(2) : '0.00'} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <Badge variant={getStockBadgeVariant(variant.inventory_quantity)}>
                          {variant.inventory_quantity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Control de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.variants.map((variant) => {
                  const stock = variant.inventory_quantity;
                  let badgeClass = '';
                  let badgeText = '';
                  
                  if (stock === 0) {
                    badgeClass = 'bg-red-100 text-red-800 border-red-200';
                    badgeText = 'Sin Stock';
                  } else if (stock <= 20) {
                    badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                    badgeText = `Stock Bajo (${stock})`;
                  } else {
                    badgeClass = 'bg-green-100 text-green-800 border-green-200';
                    badgeText = `Stock: ${stock}`;
                  }
                  
                  return (
                    <div key={variant.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <p className="font-medium">{variant.title}</p>
                        <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={badgeClass}>
                          {badgeText}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedVariant && (
        <InventoryAdjustmentDialog
          variant={selectedVariant}
          productId={product.id}
          open={adjustDialogOpen}
          onOpenChange={setAdjustDialogOpen}
          onSuccess={handleAdjustmentSuccess}
        />
      )}
    </div>
  );
}
