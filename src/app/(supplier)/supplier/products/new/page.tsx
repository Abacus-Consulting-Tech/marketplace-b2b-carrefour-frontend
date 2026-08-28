'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductProposalForm } from '@/components/supplier/ProductProposalForm';
import { featureFlags } from '@/config/feature-flags';
import type { Product } from '@/types/products-pricing';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const sellerId = user?.seller_id ?? (featureFlags.shouldUseMock('pricing') ? user?.id : undefined);

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  const handleSuccess = (product: Product) => {
    // Redirect to product detail or products list
    router.push('/supplier/products');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">
            Propón un nuevo producto para aprobación
          </p>
        </div>
      </div>

      {/* Form */}
      {sellerId ? (
        <ProductProposalForm sellerId={sellerId} onSuccess={handleSuccess} />
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No se ha podido identificar la cuenta de proveedor. Cierra sesión y vuelve a iniciar sesión.
        </div>
      )}
    </div>
  );
}
