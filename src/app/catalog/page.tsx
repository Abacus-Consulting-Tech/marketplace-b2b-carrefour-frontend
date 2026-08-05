"use client";

import { useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const categories = ["Todas", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchCat = category === "Todas" || p.category === category;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function addToCart(productId: string) {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
    const name = MOCK_PRODUCTS.find((p) => p.id === productId)?.name ?? "";
    setToast(`"${name}" añadido al carrito`);
    setTimeout(() => setToast(""), 3000);
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <AppLayout>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#004A8F] text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50 animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
        <Link
          href="/cart"
          className="flex items-center gap-2 bg-[#004A8F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors"
        >
          🛒 Carrito
          {cartCount > 0 && (
            <span className="bg-[#F7C200] text-[#004A8F] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4 text-4xl">
                📦
              </div>
              <div className="flex-1">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded mb-2 font-medium">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                <p className="text-xs text-gray-400">Proveedor: {product.supplierName}</p>
                <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Stock: {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">{product.stock} disponibles</span>
                  ) : (
                    <span className="text-red-500 font-medium">Sin stock</span>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xl font-bold text-[#004A8F]">{product.price.toFixed(2)} €</span>
                  <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
                </div>
                <button
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product.id)}
                  className="bg-[#004A8F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
