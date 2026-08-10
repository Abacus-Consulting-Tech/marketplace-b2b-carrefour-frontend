"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/client";
import { Product } from "@/types";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      // Use mock API if NEXT_PUBLIC_MOCK_AUTH is true OR if no API URL is configured
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_API_URL;
      
      let response;
      if (isMockMode) {
        const { mockApi } = await import("@/lib/api/mock");
        response = await mockApi.products.getById(params.id);
      } else {
        response = await apiClient.get(`/products/${params.id}`);
      }
      
      setProduct(response.data);
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
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    });
    
    toast({
      title: "Producto agregado",
      description: `${quantity} x ${product.name} agregado al carrito`,
    });
  };

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
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
          
          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.slice(1, 5).map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${product.name} ${idx + 2}`}
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
              {product.name}
            </h1>
            {product.supplier && (
              <Badge variant="outline">
                Proveedor: {product.supplier.name}
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-blue-600">
              €{product.price.toFixed(2)}
            </span>
            {product.stock !== undefined && (
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
              </Badge>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>
          )}

          {product.category && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Categoría: {product.category}
              </span>
            </div>
          )}

          {/* Quantity selector */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
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
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                <Button 
                  onClick={handleAddToCart} 
                  className="w-full" 
                  size="lg"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
