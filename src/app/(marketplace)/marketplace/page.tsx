"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { mockSuppliers, mockCategories } from "@/lib/api/products-mock";
import type { Product } from "@/types/products";
import { Search, ShoppingCart, Filter, Package } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.listProducts({});
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

  const filteredProducts = products
    .filter((product) => {
      // Only show published products
      if (product.status !== 'published') return false;
      
      // Search filter
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        product.categories?.some((cat) => cat.id === selectedCategory);
      
      // Supplier filter
      const matchesSupplier =
        selectedSupplier === "all" ||
        product.supplier_id === selectedSupplier;
      
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

  const handleAddToCart = (product: Product) => {
    const firstVariant = product.variants[0];
    if (!firstVariant) {
      toast({
        title: "Error",
        description: "Producto sin variantes disponibles",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.title,
      price: firstVariant.prices[0]?.amount || 0,
      quantity: 1,
      image: product.thumbnail,
      variantId: firstVariant.id,
    });
    
    toast({
      title: "Producto agregado",
      description: `${product.title} se agregó al carrito`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catálogo de Productos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explora y ordena productos de nuestros proveedores
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros:
            </span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proveedores</SelectItem>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ordenar:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre (A-Z)</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {searchQuery || selectedCategory !== "all" || selectedSupplier !== "all"
                ? "No se encontraron productos con los filtros seleccionados"
                : "No hay productos disponibles"}
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedSupplier !== "all") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedSupplier("all");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const firstVariant = product.variants[0];
            const price = firstVariant?.prices[0]?.amount || 0;
            const stock = firstVariant?.inventory_quantity || 0;
            
            return (
              <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        €{(price / 100).toFixed(2)}
                      </span>
                      {product.metadata?.units_per_pack && product.metadata.units_per_pack > 1 && (
                        <span className="text-sm text-gray-500">
                          / pack {product.metadata.units_per_pack}
                        </span>
                      )}
                    </div>
                    
                    {/* Unit price */}
                    {product.metadata?.units_per_pack && product.metadata.units_per_pack > 1 && (
                      <p className="text-sm text-gray-500">
                        (€{(price / 100 / product.metadata.units_per_pack).toFixed(2)} / unidad)
                      </p>
                    )}
                    
                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                      {product.supplier && (
                        <Badge variant="outline" className="text-xs">
                          {product.supplier.name}
                        </Badge>
                      )}
                      <Badge
                        variant={stock > 20 ? "default" : stock > 0 ? "secondary" : "destructive"}
                        className={
                          stock > 20
                            ? "bg-green-100 text-green-800"
                            : stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                      >
                        {stock > 20 ? "En Stock" : stock > 0 ? `Stock Bajo (${stock})` : "Sin Stock"}
                      </Badge>
                    </div>
                    
                    {/* Variants count */}
                    {product.variants.length > 1 && (
                      <p className="text-xs text-gray-500">
                        {product.variants.length} variantes disponibles
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/marketplace/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalle
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleAddToCart(product)} 
                    className="flex-1"
                    disabled={stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {stock === 0 ? "Sin Stock" : "Agregar"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
