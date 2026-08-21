'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductProposalForm } from '@/components/supplier/ProductProposalForm';
import type { Product } from '@/types/products-pricing';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();

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
      <ProductProposalForm sellerId={user.id} onSuccess={handleSuccess} />
    </div>
  );
}
