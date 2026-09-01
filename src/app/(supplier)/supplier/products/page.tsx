'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Upload } from 'lucide-react';
import { ProductsList } from '@/components/supplier/ProductsList';
import { featureFlags } from '@/config/feature-flags';

export default function SupplierProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const sellerId = user?.seller_id ?? (featureFlags.shouldUseMock('pricing') ? user?.id : undefined);

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

      {!featureFlags.shouldUseMock('pricing') && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertDescription>
            Si acabas de hacer una carga masiva y no ves los productos aqui, el import puede haber terminado bien pero el listado supplier del backend sigue desalineado en DEV. Revisa el resultado del job de importacion antes de repetir la carga.
          </AlertDescription>
        </Alert>
      )}

      {/* Products List */}
      {sellerId ? (
        <ProductsList sellerId={sellerId} />
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No se ha podido identificar la cuenta de proveedor. Cierra sesión y vuelve a iniciar sesión.
        </div>
      )}
    </div>
  );
}
