'use client';

import { useState, useEffect } from 'react';
import { PricingQueue } from '@/components/admin/PricingQueue';
import { ProductReviewPanel } from '@/components/admin/ProductReviewPanel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { Product } from '@/types/products-pricing';
import { ArrowLeft, Package } from 'lucide-react';

export default function AdminPricingPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sellerGlobalMarkup, setSellerGlobalMarkup] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch seller's global markup when product is selected
  useEffect(() => {
    if (selectedProduct) {
      fetchSellerMarkup(selectedProduct.seller_id);
    }
  }, [selectedProduct]);

  const fetchSellerMarkup = async (sellerId: string) => {
    try {
      const response = await pricingApi.getSellerMarkup(sellerId);
      setSellerGlobalMarkup(response.data.global_markup_percentage);
    } catch (error) {
      console.error('Error fetching seller markup:', error);
      setSellerGlobalMarkup(0); // Default to 0 if error
    }
  };

  const handleCloseReview = () => {
    setSelectedProduct(null);
  };

  const handleApproveOrReject = () => {
    setSelectedProduct(null);
    setRefreshTrigger(prev => prev + 1); // Trigger queue refresh
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Package className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Aprobación de Productos
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa y aprueba los productos propuestos por los proveedores
          </p>
        </div>
      </div>

      {/* Pricing Queue */}
      <PricingQueue
        key={refreshTrigger}
        onSelectProduct={setSelectedProduct}
      />

      {/* Review Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && handleCloseReview()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Revisar Producto</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseReview}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Cola
              </Button>
            </div>
          </DialogHeader>

          {selectedProduct && (
            <ProductReviewPanel
              product={selectedProduct}
              sellerGlobalMarkup={sellerGlobalMarkup}
              onApprove={handleApproveOrReject}
              onReject={handleApproveOrReject}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
