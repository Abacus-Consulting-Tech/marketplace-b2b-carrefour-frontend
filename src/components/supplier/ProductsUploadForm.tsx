'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, FileText, FileArchive, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useSupplierRegistration } from '@/lib/store/supplier-registration';
import { cn } from '@/lib/utils';

export function ProductsUploadForm() {
  const { productsCsv, imagesZip, setProductsCsv, setImagesZip, prevStep, isStepValid } =
    useSupplierRegistration();

  const [csvError, setCsvError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  const form = useForm();

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setCsvError('Formato no válido. Solo se aceptan archivos CSV o XLSX.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCsvError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setCsvError(null);
    setProductsCsv(file);
  };

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.zip') && file.type !== 'application/zip') {
      setZipError('Formato no válido. Solo se aceptan archivos ZIP.');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setZipError('El archivo es demasiado grande. Máximo 50MB.');
      return;
    }

    setZipError(null);
    setImagesZip(file);
  };

  const handleSubmit = async () => {
    if (!isStepValid(2)) {
      return;
    }

    // TODO: Submit to API
    // const formData = new FormData();
    // formData.append('csv', productsCsv);
    // formData.append('zip', imagesZip);
    // await submitSupplierRegistration(formData);

    alert('Registro completado. Pendiente de integración con API.');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* CSV Upload */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Catálogo de Productos (CSV/XLSX)</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sube el archivo CSV o XLSX con tu listado de productos.
              </p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                productsCsv
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              )}
            >
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleCsvUpload}
                className="absolute inset-0 cursor-pointer opacity-0"
                id="csv-upload"
              />

              {productsCsv ? (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{productsCsv.name}</p>
                    <p className="text-sm text-green-700">
                      {formatFileSize(productsCsv.size)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Haz clic o arrastra el archivo CSV/XLSX aquí
                  </p>
                  <p className="text-xs text-muted-foreground">Máximo 5MB</p>
                </div>
              )}
            </div>

            {csvError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{csvError}</p>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium">Estructura requerida del CSV:</p>
              <p className="mt-1 font-mono text-xs">
                PROVEEDOR, IMAGEN, NOMBRE, DESCRIPCIÓN, CARACTERISTICAS, COSTE UNITARIO, PCB,
                IMPORTE, IVA, PLAZO ENTREGA
              </p>
            </div>
          </div>
        </div>

        {/* ZIP Upload */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Imágenes de Productos (ZIP)</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sube un archivo ZIP con las imágenes de tus productos (formato PNG).
              </p>
            </div>
            <FileArchive className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                imagesZip
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              )}
            >
              <input
                type="file"
                accept=".zip"
                onChange={handleZipUpload}
                className="absolute inset-0 cursor-pointer opacity-0"
                id="zip-upload"
              />

              {imagesZip ? (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{imagesZip.name}</p>
                    <p className="text-sm text-green-700">
                      {formatFileSize(imagesZip.size)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Haz clic o arrastra el archivo ZIP aquí
                  </p>
                  <p className="text-xs text-muted-foreground">Máximo 50MB</p>
                </div>
              )}
            </div>

            {zipError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{zipError}</p>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium">Requisitos de las imágenes:</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Formato: PNG únicamente</li>
                <li>Nombres deben coincidir con la columna IMAGEN del CSV</li>
                <li>Ejemplo: si en el CSV pones "producto-001.png", el ZIP debe contener ese archivo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep}>
            Anterior
          </Button>
          <Button
            type="submit"
            disabled={!isStepValid(2)}
            size="lg"
          >
            Enviar Solicitud
          </Button>
        </div>

        {productsCsv && imagesZip && (
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-medium">Archivos listos para enviar</p>
                <p className="mt-1">
                  Tu solicitud será revisada por nuestro equipo. Recibirás un email cuando tu
                  cuenta sea activada.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
