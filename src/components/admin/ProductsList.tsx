'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products-client';
import type { Product, ProductStatus } from '@/types/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import { featureFlags } from '@/config/feature-flags';

function getStockBadge(product: Product) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
  
  if (totalStock === 0) {
    return <Badge variant="destructive" className="ml-2">Sin Stock</Badge>;
  }
  if (totalStock < 20) {
    return <Badge className="ml-2 bg-yellow-500">Stock Bajo ({totalStock})</Badge>;
  }
  return <Badge variant="secondary" className="ml-2">Stock: {totalStock}</Badge>;
}

function getPrice(product: Product) {
  const price = product.variants[0]?.prices[0]?.amount;
  if (!price) return null;
  return (price / 100).toFixed(2);
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');

  const isMockMode = featureFlags.shouldUseMock('products');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await productsApi.listProducts({});
      if (response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await productsApi.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error('Error:', err);
    }
  }

  function toggleSelection(id: string) {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  }

  function toggleAll() {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map(p => p.id)));
    }
  }

  async function handleBulkStatusUpdate(status: ProductStatus) {
    if (!confirm(`¿Cambiar estado de ${selected.size} producto(s)?`)) return;
    try {
      const product_ids = Array.from(selected);
      await productsApi.bulkUpdateStatus({ product_ids, status });
      await loadProducts();
      setSelected(new Set());
    } catch (err) {
      console.error('Error:', err);
    }
  }

  const allSelected = selected.size === products.length && products.length > 0;

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(search);
      const matchesSubtitle = product.subtitle?.toLowerCase().includes(search);
      const matchesDescription = product.description?.toLowerCase().includes(search);
      const matchesSupplier = product.supplier?.name.toLowerCase().includes(search);
      const matchesCategory = product.categories?.some(cat => cat.name.toLowerCase().includes(search));
      
      const matchesSearch = matchesTitle || matchesSubtitle || matchesDescription || matchesSupplier || matchesCategory;
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false;
    }
    
    // Supplier filter
    if (supplierFilter !== 'all' && product.supplier?.id !== supplierFilter) {
      return false;
    }
    
    return true;
  });

  const uniqueSuppliers = Array.from(
    new Map(products.map(p => p.supplier).filter(Boolean).map(s => [s!.id, s!])).values()
  );

  const lowStockProducts = products.filter(product => {
    const totalStock = product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
    return totalStock > 0 && totalStock <= 20;
  });

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      {isMockMode && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-3">
            <p className="text-sm text-yellow-800">
              🎭 <strong>Modo Mock</strong> - Datos de prueba
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="proposed">Propuesto</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Proveedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proveedores</SelectItem>
            {uniqueSuppliers.map(supplier => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={toggleAll}>
          {allSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
        </Button>
      </div>

      {selected.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selected.size} producto(s) seleccionado(s)
              </p>
              <div className="flex gap-2">
                <Select onValueChange={(value) => handleBulkStatusUpdate(value as ProductStatus)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Cambiar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Cambiar a Borrador</SelectItem>
                    <SelectItem value="proposed">Cambiar a Propuesto</SelectItem>
                    <SelectItem value="published">Cambiar a Publicado</SelectItem>
                    <SelectItem value="rejected">Cambiar a Rechazado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSelected(new Set())}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No se encontraron productos</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Intenta con otros términos de búsqueda
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => {
          const price = getPrice(product);
          const categoryName = product.categories?.[0]?.name;
          const variantCount = product.variants.length;
          
          return (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selected.has(product.id)}
                    onCheckedChange={() => toggleSelection(product.id)}
                  />
                  <Package className="h-12 w-12 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <Link href={`/admin/products/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold text-blue-600">{product.title}</h3>
                    </Link>
                    {product.subtitle && (
                      <p className="text-sm text-gray-500">{product.subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>{product.status}</Badge>
                      {product.supplier && (
                        <Badge variant="outline">{product.supplier.name}</Badge>
                      )}
                      {categoryName && (
                        <Badge variant="outline">{categoryName}</Badge>
                      )}
                      {getStockBadge(product)}
                      {price && (
                        <Badge variant="outline">{price} €</Badge>
                      )}
                      {variantCount > 1 && (
                        <Badge variant="secondary">{variantCount} opciones</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}

      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} con stock bajo
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {lowStockProducts.map((p, idx) => {
                    const totalStock = p.variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
                    return (
                      <span key={p.id}>
                        {idx > 0 && ', '}
                        {p.title} ({totalStock} unidades)
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
