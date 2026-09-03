"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { productsApi } from "@/lib/api/products-client";
import { mockCategories } from "@/lib/api/products-mock";
import { ShoppingCart, Package, Users, Megaphone, Signpost, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import type { Product, ProductCategory } from "@/types/products";

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5 text-blue-600" />,
  Megaphone: <Megaphone className="w-5 h-5 text-blue-600" />,
  Signpost: <Signpost className="w-5 h-5 text-blue-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-blue-600" />,
  Package: <Package className="w-5 h-5 text-blue-600" />,
};

export default function MarketplaceLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories);
  const cart = useCartStore((state) => state.items);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsApi.listCatalogProducts({});
        const publishedProducts = (response.data?.products || []).filter(
          (product: Product) => product.status === "published"
        );

        const derivedCategories = publishedProducts.reduce<ProductCategory[]>((result, product) => {
          for (const category of product.categories || []) {
            const exists = result.some(
              (candidate) => candidate.id === category.id || candidate.handle === category.handle
            );

            if (!exists) {
              const visualMatch = mockCategories.find(
                (candidate) =>
                  candidate.id === category.id ||
                  candidate.handle === category.handle ||
                  candidate.name.toLowerCase() === category.name.toLowerCase()
              );

              result.push({
                ...visualMatch,
                ...category,
                imageUrl: category.imageUrl || visualMatch?.imageUrl,
                icon: category.icon || visualMatch?.icon,
              });
            }
          }

          return result;
        }, []);

        if (derivedCategories.length > 0) {
          setCategories(derivedCategories);
        }
      } catch (error) {
        console.error("Error fetching marketplace categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Marketplace Carrefour</h1>
              <p className="text-slate-600 mt-2">Encuentra todo lo que necesita tu tienda</p>
            </div>
            <Link
              href="/marketplace/cart"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">
                Carrito {cart.length > 0 && `(${cart.length})`}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Explora nuestras categorías
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Selecciona una categoría para ver todos nuestros productos y hacer tu pedido
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {categories.map((category) => {
            const iconName = (category.icon || "Package") as keyof typeof ICON_MAP;
            const Icon = ICON_MAP[iconName];
            return (
              <Link key={category.id} href={`/marketplace/shop?category=${category.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer h-full">
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {category.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-image-element
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition" />
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {Icon}
                      <h3 className="font-bold text-lg text-slate-900">{category.name}</h3>
                    </div>
                    {category.description && (
                      <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                    )}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Ver productos
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {!isLoading && categories.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-slate-600 mb-16">
            No hay categorías disponibles en el catálogo.
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Contacta con nuestro equipo de ventas para solicitar productos personalizados o consultar disponibilidad
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100"
          >
            Contactar soporte
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Compra fácil</h4>
            <p className="text-slate-600">Interfaz intuitiva y proceso de compra simplificado</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Entrega rápida</h4>
            <p className="text-slate-600">Productos entregados en el menor tiempo posible</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Precios competitivos</h4>
            <p className="text-slate-600">Las mejores ofertas para tu negocio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
