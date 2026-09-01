'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle, PackagePlus } from 'lucide-react';

export default function AdminProductSuccessPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const productName = searchParams.get('productName') || 'Producto sin nombre';
  const status = searchParams.get('status') || 'draft';

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-9 w-9 text-green-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900">Producto creado correctamente</h1>
            <p className="mt-2 text-base text-slate-600">
              El alta se ha registrado y ya puedes continuar con la revisión o volver al catálogo.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <PackagePlus className="h-6 w-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">{productName}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">ID</dt>
                    <dd className="break-all text-right font-medium text-slate-900">{productId || 'No disponible'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Estado inicial</dt>
                    <dd className="text-right font-medium capitalize text-slate-900">{status}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-base font-semibold text-blue-900">Siguientes pasos</h2>
            <ul className="mt-4 space-y-2 text-sm text-blue-800">
              <li>Revisa que el proveedor y la categoría asignados sean correctos.</li>
              <li>Completa imágenes cuando esa carga esté disponible en el flujo admin.</li>
              <li>Valida cómo debe publicarse este producto según el estado devuelto por backend.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {productId && (
              <Link
                href={`/admin/products/${productId}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Ver detalle del producto
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Crear otro producto
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
