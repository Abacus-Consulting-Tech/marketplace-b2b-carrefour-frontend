"use client";

import { useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { CartItem } from "@/types";

// Demo initial cart
const INITIAL_CART: CartItem[] = [
  { product: MOCK_PRODUCTS[0], quantity: 2 },
  { product: MOCK_PRODUCTS[3], quantity: 3 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrito de compra</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
          <Link href="/catalog" className="text-[#004A8F] font-medium hover:underline">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center text-2xl flex-shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{item.product.supplierName}</p>
                  <p className="text-[#004A8F] font-bold mt-1">{item.product.price.toFixed(2)} € / {item.product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right min-w-16">
                  <p className="font-bold text-gray-900">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button
                    onClick={() => updateQty(item.product.id, 0)}
                    className="text-red-400 hover:text-red-600 text-xs mt-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit sticky top-4">
            <h2 className="font-bold text-gray-900 mb-4">Resumen del pedido</h2>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                <span className="whitespace-nowrap">{(item.product.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 mb-4">IVA incluido</p>
            <Link
              href="/checkout"
              className="block w-full bg-[#004A8F] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#003870] transition-colors"
            >
              Proceder al pago
            </Link>
            <Link href="/catalog" className="block text-center text-[#004A8F] text-sm mt-3 hover:underline">
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
