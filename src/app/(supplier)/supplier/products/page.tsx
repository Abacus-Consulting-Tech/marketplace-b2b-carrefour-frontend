'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { ProductsList } from '@/components/supplier/ProductsList';

export default function SupplierProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu catálogo de productos propuestos
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => router.push('/supplier/products/bulk-upload')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Carga Masiva
          </Button>
          <Button onClick={() => router.push('/supplier/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Products List */}
      <ProductsList sellerId={user.id} />
    </div>
  );
}
