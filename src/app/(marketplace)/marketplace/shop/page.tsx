"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsApi } from "@/lib/api/products-client";
import { mockSuppliers } from "@/lib/api/products-mock";
import type { Product, ProductCategory } from "@/types/products";
import { Search, ShoppingCart, Filter, Package, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/hooks/use-toast";

interface ShopPageProps {
  searchParams?: { category?: string };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.category || "all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const searchParams_hook = useSearchParams();

  // Sincronizar con URL searchParams
  useEffect(() => {
    const categoryFromUrl = searchParams_hook.get("category") || searchParams?.category || "all";
    setSelectedCategory(categoryFromUrl);
  }, [searchParams_hook, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.listCatalogProducts({});
      setProducts(response.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = products.reduce<ProductCategory[]>((categories, product) => {
    for (const category of product.categories || []) {
      const alreadyIncluded = categories.some(
        (candidate) => candidate.id === category.id || candidate.handle === category.handle
      );

      if (!alreadyIncluded) {
        categories.push(category);
      }
    }

    return categories;
  }, []);

  const effectiveSelectedCategory =
    selectedCategory === "all" ||
    availableCategories.some(
      (category) => category.id === selectedCategory || category.handle === selectedCategory
    )
      ? selectedCategory
      : "all";

  const filteredProducts = products
    .filter((product) => {
      // Only show published products
      if (product.status !== "published") return false;

      // Search filter
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        effectiveSelectedCategory === "all" ||
        product.categories?.some(
          (cat) => cat.id === effectiveSelectedCategory || cat.handle === effectiveSelectedCategory
        );

      // Supplier filter
      const matchesSupplier =
        selectedSupplier === "all" || product.supplier_id === selectedSupplier;

      return matchesSearch && matchesCategory && matchesSupplier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          const priceA = a.variants[0]?.prices[0]?.amount || 0;
          const priceB = b.variants[0]?.prices[0]?.amount || 0;
          return priceA - priceB;
        case "price-desc":
          const priceA2 = a.variants[0]?.prices[0]?.amount || 0;
          const priceB2 = b.variants[0]?.prices[0]?.amount || 0;
          return priceB2 - priceA2;
        case "name":
        default:
          return a.title.localeCompare(b.title);
      }
    });

  // Get current category info for breadcrumb
  const currentCategory = availableCategories.find(
    (category) => category.id === effectiveSelectedCategory || category.handle === effectiveSelectedCategory
  );

  const handleAddToCart = (product: Product) => {
    if (product.variants.length === 0) {
      toast({
        title: "Error",
        description: "Este producto no tiene opciones disponibles",
        variant: "destructive",
      });
      return;
    }

    const variant = product.variants[0];
    const price = variant.prices[0]?.amount || 0;

    addItem({
      productId: product.id,
      name: product.title,
      variantId: variant.id,
      quantity: 1,
      price,
      image: product.thumbnail,
      supplierId: product.supplier_id || product.supplier?.id,
      supplierName: product.supplier?.name,
    });

    toast({
      title: "Producto agregado",
      description: `${product.title} se agregó al carrito`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header con breadcrumb */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/marketplace" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Volver a categorías</span>
              </Link>
            </div>
            <Link href="/marketplace/cart" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Carrito</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {currentCategory && effectiveSelectedCategory !== "all"
              ? currentCategory.name
              : "Todos los productos"}
          </h1>
          {currentCategory && effectiveSelectedCategory !== "all" && (
            <p className="text-slate-600 mt-1">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Buscar productos
              </label>
              <Input
                placeholder="Nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Categoría
              </label>
              <Select value={effectiveSelectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre (A-Z)</SelectItem>
                  <SelectItem value="price-asc">Precio (menor a mayor)</SelectItem>
                  <SelectItem value="price-desc">Precio (mayor a menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div>
          <div className="mb-4 text-sm text-slate-600">
            {loading ? "Cargando..." : `${filteredProducts.length} productos encontrados`}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No hay productos disponibles</p>
              <p className="text-slate-500 text-sm mt-2">Intenta con otros filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
                    {product.subtitle && (
                      <p className="text-xs text-slate-500 mt-1">{product.subtitle}</p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      {product.supplier && (
                        <Badge variant="secondary" className="text-xs">
                          {product.supplier.name}
                        </Badge>
                      )}
                      {product.variants.length > 0 && (
                        <div className="text-sm font-semibold text-slate-900">
                          €
                          {(
                            (product.variants[0]?.prices[0]?.amount || 0) / 100
                          ).toFixed(2)}
                        </div>
                      )}
                      {product.variants.length > 0 && product.variants[0]?.inventory_quantity && (
                        <p className="text-xs text-slate-500">
                          Stock: {product.variants[0].inventory_quantity}
                        </p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Añadir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
