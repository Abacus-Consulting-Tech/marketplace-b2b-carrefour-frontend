"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isMercurCartEnabled,
  removeMercurCartLineItem,
  updateMercurCartLineItem,
} from "@/lib/api/mercur-cart";
import { useCartStore } from "@/lib/store/cart";
import { productsApi } from "@/lib/api/products-client";
import type { Product } from "@/types/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CartItemWithDetails {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  variantId?: string;
  backendLineItemId?: string;
  offerId?: string;
  // Expanded product details
  product?: Product;
  loading?: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const { cartId, items, summary, syncMercurCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const [itemsWithDetails, setItemsWithDetails] = useState<CartItemWithDetails[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch product details for each cart item
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (items.length === 0) {
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);
      const itemsWithProductData: CartItemWithDetails[] = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await productsApi.getProduct({ 
              id: item.productId, 
              expand: 'variants,categories,supplier' 
            });
            return {
              ...item,
              product: response.data?.product,
              loading: false,
            };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return {
              ...item,
              loading: false,
            };
          }
        })
      );
      setItemsWithDetails(itemsWithProductData);
      setLoadingProducts(false);
    };

    fetchProductDetails();
  }, [items]);

  const subtotal = summary?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const iva = summary?.tax ?? subtotal * 0.21;
  const shipping = summary?.shipping ?? 0;
  const discount = summary?.discount ?? 0;
  const total = summary?.total ?? subtotal + iva + shipping - discount;

  const handleUpdateQuantity = async (productId: string, newQuantity: number, variantId?: string) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId, variantId);
      return;
    }

    const item = items.find((cartItem) => 
      cartItem.productId === productId && 
      (!variantId || cartItem.variantId === variantId)
    );
    const itemKey = variantId ? `${productId}-${variantId}` : productId;
    const isItemUpdating = updatingItems.includes(itemKey);

    if (isItemUpdating) {
      return;
    }

    if (isMercurCartEnabled() && cartId && item?.backendLineItemId) {
      setUpdatingItems((current) => [...current, itemKey]);
      try {
        const mappedCart = await updateMercurCartLineItem({
          cartId,
          lineItemId: item.backendLineItemId,
          quantity: newQuantity,
        });
        syncMercurCart(mappedCart);
      } catch (error) {
        console.error("Error updating Mercur cart line item:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el carrito",
          variant: "destructive",
        });
      } finally {
        setUpdatingItems((current) => current.filter((id) => id !== itemKey));
      }
      return;
    }

    updateQuantity(productId, newQuantity, variantId);
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    const item = items.find((cartItem) => 
      cartItem.productId === productId && 
      (!variantId || cartItem.variantId === variantId)
    );
    const itemKey = variantId ? `${productId}-${variantId}` : productId;
    const isItemUpdating = updatingItems.includes(itemKey);

    if (isItemUpdating) {
      return;
    }

    if (isMercurCartEnabled() && cartId && item?.backendLineItemId) {
      setUpdatingItems((current) => [...current, itemKey]);
      try {
        const mappedCart = await removeMercurCartLineItem({
          cartId,
          lineItemId: item.backendLineItemId,
        });
        syncMercurCart(mappedCart);
        toast({
          title: "Producto eliminado",
          description: "El producto se eliminó del carrito",
        });
      } catch (error) {
        console.error("Error removing Mercur cart line item:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto del carrito",
          variant: "destructive",
        });
      } finally {
        setUpdatingItems((current) => current.filter((id) => id !== itemKey));
      }
      return;
    }

    removeItem(productId, variantId);
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade productos antes de proceder al pago",
        variant: "destructive",
      });
      return;
    }
    
    // Redirigir al nuevo checkout
    router.push('/marketplace/checkout-new');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Button>
          </Link>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explora nuestro catálogo y añade productos a tu carrito
            </p>
            <Link href="/marketplace">
              <Button className="mt-4">
                Ver productos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Carrito de Compra
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length} {items.length === 1 ? "producto" : "productos"} en tu carrito
          </p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir comprando
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {loadingProducts ? (
            // Skeleton loading state
            [...Array(items.length)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            itemsWithDetails.map((item) => {
              const variant = item.product?.variants?.find(v => v.id === item.variantId);
              const stock = variant?.inventory_quantity || 0;
              const supplier = item.product?.supplier;
              const itemKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;

              return (
                <Card key={itemKey}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link href={`/marketplace/products/${item.productId}`}>
                          {item.image || item.product?.thumbnail ? (
                            <img
                              src={item.image || item.product?.thumbnail}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <Link href={`/marketplace/products/${item.productId}`}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                              {item.name}
                              {variant?.title && ` - ${variant.title}`}
                            </h3>
                          </Link>
                          {item.product?.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.product.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Product details */}
                        <div className="flex flex-wrap gap-2 text-sm">
                          {supplier && (
                            <Badge variant="outline" className="text-xs">
                              {supplier.name}
                            </Badge>
                          )}
                          {variant && (
                            <Badge variant="secondary" className="text-xs">
                              SKU: {variant.sku}
                            </Badge>
                          )}
                          {stock > 0 ? (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                stock > 20 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}
                            >
                              Stock: {stock}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Sin stock
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span>Precio unitario: </span>
                          <span className="font-semibold">€{(item.price / 100).toFixed(2)}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const isUpdating = updatingItems.includes(itemKey);
                              return (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={isUpdating}
                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    min="1"
                                    max={stock}
                                    value={item.quantity}
                                    disabled={isUpdating}
                                    onChange={(e) => {
                                      const newQty = parseInt(e.target.value) || 1;
                                      handleUpdateQuantity(item.productId, Math.min(newQty, stock), item.variantId);
                                    }}
                                    className="w-16 text-center"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={isUpdating || item.quantity >= stock}
                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </>
                              );
                            })()}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            disabled={updatingItems.includes(itemKey)}
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          €{((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">IVA (21%)</span>
                <span className="font-semibold">€{iva.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  <span className="font-semibold">€{shipping.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Descuento</span>
                  <span className="font-semibold">-€{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceder al Pago
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clearCart();
                  toast({
                    title: "Carrito vaciado",
                    description: "Se eliminaron todos los productos",
                  });
                }}
              >
                Vaciar carrito
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
