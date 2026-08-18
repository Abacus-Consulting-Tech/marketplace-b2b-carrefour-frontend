"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import Link from "next/link";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart when order is successful
    clearCart();
  }, []);

  if (!orderId) {
    router.push("/marketplace");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardContent className="p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Gracias por tu compra. Tu pedido ha sido procesado correctamente.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Número de pedido
            </p>
            <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
              {orderId}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Package className="h-5 w-5" />
              Próximos Pasos
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Te notificaremos cuando tu pedido sea enviado</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Puedes ver el estado de tu pedido en tu panel de usuario</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/marketplace">
              <Button variant="outline" className="w-full sm:w-auto">
                Volver al Catálogo
              </Button>
            </Link>
            <Link href="/marketplace/orders">
              <Button className="w-full sm:w-auto">
                Ver Mis Pedidos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
