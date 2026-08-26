'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, FileText, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupplierQuoteSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const categoryId = params.categoryId as string;
  const quoteId = searchParams.get('quoteId');

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Presupuesto enviado
        </h1>
        <p className="mt-2 text-gray-600">
          Tu presupuesto se ha enviado correctamente para revisión.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen del envío</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Proyecto</p>
              <p className="font-medium text-gray-900">{projectId}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Categoría</p>
              <p className="font-medium text-gray-900">{categoryId}</p>
              {quoteId && (
                <p className="text-sm text-gray-600 mt-1">Referencia: {quoteId}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            El equipo de Carrefour revisará la propuesta. Podrás consultar el estado desde tus invitaciones.
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/supplier/openings">
            Volver a invitaciones
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/supplier/openings/${projectId}`}>
            Ver proyecto
          </Link>
        </Button>
      </div>
    </div>
  );
}