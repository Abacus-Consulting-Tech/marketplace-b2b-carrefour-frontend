'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BulkUploadForm } from '@/components/supplier/BulkUploadForm';
import { ArrowLeft, Upload } from 'lucide-react';

export default function BulkUploadPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/supplier/products')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Productos
          </Button>
          <h1 className="text-3xl font-bold">Carga Masiva de Productos</h1>
          <p className="text-gray-500 mt-2">
            Importa múltiples productos desde un archivo CSV o Excel
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <BulkUploadForm />
    </div>
  );
}
