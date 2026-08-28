"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productsApi } from "@/lib/api/products-client";
import type { Product, ProductVariant } from "@/types/products";
import { ShoppingCart, ArrowLeft, Plus, Minus, Package, Info, Warehouse } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await productsApi.getProduct({ id: params.id, expand: 'variants,categories,tags,supplier' });
      setProduct(response.data?.product || null);
      // Set first variant as selected by default
      if (response.data?.product?.variants?.length > 0) {
        setSelectedVariant(response.data.product.variants[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const price = selectedVariant.prices[0]?.amount || 0;
    
    addItem({
      productId: product.id,
      name: product.title,
      price,
      quantity,
      image: product.thumbnail,
      variantId: selectedVariant.id,
    });
    
    toast({
      title: "Producto agregado",
      description: `${quantity} x ${product.title} agregado al carrito`,
    });
  };

  const currentStock = selectedVariant?.inventory_quantity || 0;
  const currentPrice = selectedVariant?.prices[0]?.amount || 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Producto no encontrado</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al catálogo
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Product images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.slice(0, 4).map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.title}
            </h1>
            <div className="flex gap-2 flex-wrap">
              {product.supplier && (
                <Badge variant="outline">
                  Proveedor: {product.supplier.name}
                </Badge>
              )}
              <Badge
                className={
                  currentStock === 0
                    ? "bg-red-100 text-red-800 border-red-200"
                    : currentStock <= 20
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }
              >
                {currentStock === 0 ? "Sin Stock" : currentStock <= 20 ? `Stock Bajo (${currentStock})` : `Stock: ${currentStock}`}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <Info className="h-4 w-4 mr-2" />
                Información
              </TabsTrigger>
              <TabsTrigger value="variants">
                <Package className="h-4 w-4 mr-2" />
                Opciones
              </TabsTrigger>
              <TabsTrigger value="details">
                <Warehouse className="h-4 w-4 mr-2" />
                Detalles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>
                </div>
              )}

              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Categorías</h3>
                  <div className="flex gap-2 flex-wrap">
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
                  <h3 className="font-semibold mb-2">Etiquetas</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="variants" className="space-y-3 mt-4">
              {product.variants.map((variant) => {
                const variantPrice = variant.prices[0]?.amount || 0;
                const variantStock = variant.inventory_quantity || 0;
                const isSelected = selectedVariant?.id === variant.id;
                
                return (
                  <Card
                    key={variant.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">{variant.title}</div>
                          {variant.sku && (
                            <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                          )}
                          <div className="text-lg font-bold text-blue-600 mt-1">
                            €{(variantPrice / 100).toFixed(2)}
                          </div>
                        </div>
                        <Badge
                          variant={variantStock > 0 ? "default" : "secondary"}
                          className={
                            variantStock === 0
                              ? "bg-red-100 text-red-800"
                              : variantStock <= 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          Stock: {variantStock}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="details" className="space-y-3 mt-4">
              {product.metadata?.units_per_pack && (
                <div className="flex justify-between">
                  <span className="text-gray-600">PCB Mínimo:</span>
                  <span className="font-semibold">{product.metadata.units_per_pack}</span>
                </div>
              )}
              {product.metadata?.min_quantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad mínima:</span>
                  <span className="font-semibold">{product.metadata.min_quantity}</span>
                </div>
              )}
              {selectedVariant?.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold">{selectedVariant.sku}</span>
                </div>
              )}
              {selectedVariant?.barcode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Código de barras:</span>
                  <span className="font-semibold">{selectedVariant.barcode}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Pricing and Purchase */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-blue-600">
                      €{(currentPrice / 100).toFixed(2)}
                    </span>
                    {product.metadata?.units_per_pack && product.metadata.units_per_pack > 1 && (
                      <span className="text-lg text-gray-500">
                        / pack {product.metadata.units_per_pack}
                      </span>
                    )}
                  </div>
                  
                  {product.metadata?.units_per_pack && product.metadata.units_per_pack > 1 && (
                    <p className="text-gray-500">
                      (€{(currentPrice / 100 / product.metadata.units_per_pack).toFixed(2)} por unidad)
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={currentStock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{((currentPrice / 100) * quantity).toFixed(2)}
                  </span>
                </div>

                <Button 
                  onClick={handleAddToCart} 
                  className="w-full" 
                  size="lg"
                  disabled={currentStock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {currentStock === 0 ? "Sin stock" : "Agregar al carrito"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
