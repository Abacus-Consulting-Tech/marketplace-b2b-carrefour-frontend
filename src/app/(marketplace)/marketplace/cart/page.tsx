"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  isMercurCartEnabled,
  removeMercurCartLineItem,
  updateMercurCartLineItem,
} from "@/lib/api/mercur-cart";
import { useCartStore } from "@/lib/store/cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { cartId, items, summary, syncMercurCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const { toast } = useToast();

  const subtotal = summary?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const iva = summary?.tax ?? subtotal * 0.21;
  const shipping = summary?.shipping ?? 0;
  const discount = summary?.discount ?? 0;
  const total = summary?.total ?? subtotal + iva + shipping - discount;

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    const item = items.find((cartItem) => cartItem.productId === productId);
    const isItemUpdating = updatingItems.includes(productId);

    if (isItemUpdating) {
      return;
    }

    if (isMercurCartEnabled() && cartId && item?.backendLineItemId) {
      setUpdatingItems((current) => [...current, productId]);
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
        setUpdatingItems((current) => current.filter((id) => id !== productId));
      }
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    const item = items.find((cartItem) => cartItem.productId === productId);
    const isItemUpdating = updatingItems.includes(productId);

    if (isItemUpdating) {
      return;
    }

    if (isMercurCartEnabled() && cartId && item?.backendLineItemId) {
      setUpdatingItems((current) => [...current, productId]);
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
        setUpdatingItems((current) => current.filter((id) => id !== productId));
      }
      return;
    }

    removeItem(productId);
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
    
    // Redirigir al checkout
    router.push('/checkout');
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
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Precio unitario: €{item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const isUpdating = updatingItems.includes(item.productId);

                          return (
                            <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          disabled={isUpdating}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
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
                        disabled={updatingItems.includes(item.productId)}
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
