'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductsPage() {
  // Mock data for preview
  const mockProducts = [
    { 
      id: '1', 
      name: 'Aceite de Oliva Virgen Extra', 
      category: 'Alimentación', 
      supplier: 'Alimentos Frescos S.L.',
      stock: 150,
      price: 12.50,
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Arroz Integral 1kg', 
      category: 'Alimentación', 
      supplier: 'Distribuciones Norte',
      stock: 8,
      price: 3.20,
      status: 'low_stock' 
    },
    { 
      id: '3', 
      name: 'Detergente Ecológico', 
      category: 'Limpieza', 
      supplier: 'Productos de Calidad',
      stock: 0,
      price: 8.99,
      status: 'out_of_stock' 
    },
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Disponible',
    low_stock: 'Stock Bajo',
    out_of_stock: 'Sin Stock',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestión del catálogo completo de productos de la plataforma
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Package className="h-5 w-5" />
            Funcionalidad en Desarrollo
          </CardTitle>
          <CardDescription className="text-blue-700">
            El módulo completo de gestión de productos incluirá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Alta, edición y baja de productos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Gestión de categorías y etiquetas
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Control de inventario y stock
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Asignación de proveedores
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Aprobación de productos nuevos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Importación/Exportación masiva
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, categoría, proveedor..."
            className="pl-10"
            disabled
          />
        </div>
        <Button variant="outline" disabled>
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Products Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos del Catálogo (Vista Previa)</CardTitle>
          <CardDescription>
            Muestra de productos - La tabla completa incluirá imágenes, más detalles y funciones de edición
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.category} • {product.supplier}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500 min-w-[80px]">
                    Stock: {product.stock}
                  </div>
                  <p className="font-semibold text-gray-900 min-w-[80px] text-right">
                    {product.price.toFixed(2)} €
                  </p>
                  <Badge
                    variant="secondary"
                    className={statusColors[product.status as keyof typeof statusColors]}
                  >
                    {statusLabels[product.status as keyof typeof statusLabels]}
                  </Badge>
                  <Button size="sm" variant="ghost" disabled>
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts Card */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <AlertCircle className="h-5 w-5" />
            Alertas de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-800">
          <p>1 producto sin stock • 1 producto con stock bajo</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500 mt-1">Total Productos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Stock Bajo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Categorías</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-center pt-4">
        <Link href="/admin/dashboard">
          <Button variant="outline">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
