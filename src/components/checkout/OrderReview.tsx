"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { completeCart } from "@/lib/api/mercur-store-client";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/types";

interface ShippingAddress {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

interface OrderReviewProps {
  cartId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: { id: string; name: string; price: number };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

export default function OrderReview({
  cartId,
  items,
  shippingAddress,
  shippingMethod,
  subtotal,
  shippingCost,
  tax,
  total,
  onBack,
  onSuccess,
}: OrderReviewProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCompleteOrder = async () => {
    try {
      setProcessing(true);
      setError("");

      // Complete the cart to create the order
      const response = await completeCart(cartId);

      if (response.type === "order" && response.order) {
        // Success! Navigate to success page
        onSuccess(response.order.id);
      } else {
        setError("No se pudo completar el pedido. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Error completing order:", error);
      setError(
        error.response?.data?.message || 
        "Error al completar el pedido. Por favor, intenta de nuevo."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Revisa tu pedido</h3>
        <p className="text-sm text-gray-600 mb-6">
          Verifica que toda la información sea correcta antes de completar tu pedido.
        </p>
      </div>

      {/* Order Items */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos ({items.length})
          </h4>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">
                  €{((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Dirección de Envío</h4>
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {shippingAddress.first_name} {shippingAddress.last_name}
            </p>
            <p>{shippingAddress.address_1}</p>
            {shippingAddress.address_2 && <p>{shippingAddress.address_2}</p>}
            <p>
              {shippingAddress.postal_code} {shippingAddress.city}
              {shippingAddress.province && `, ${shippingAddress.province}`}
            </p>
            <p className="uppercase">{shippingAddress.country_code}</p>
            <p className="pt-2">{shippingAddress.phone}</p>
            <p className="text-gray-600">{shippingAddress.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Método de Envío</h4>
          <div className="flex justify-between items-center">
            <p className="text-sm">{shippingMethod.name}</p>
            <p className="font-medium">
              {shippingMethod.price === 0 ? (
                "GRATIS"
              ) : (
                `€${(shippingMethod.price / 100).toFixed(2)}`
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Resumen del Pedido</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>€{(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span>
                {shippingCost === 0 ? "GRATIS" : `€${(shippingCost / 100).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (incluido)</span>
              <span>€{(tax / 100).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>€{(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          Atrás
        </Button>
        <Button onClick={handleCompleteOrder} disabled={processing} className="flex-1">
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando pedido...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completar Pedido
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
