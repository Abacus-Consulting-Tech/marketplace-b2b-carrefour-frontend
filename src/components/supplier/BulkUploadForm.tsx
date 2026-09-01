'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/auth';
import { excelImportApi } from '@/lib/api/excel-import-client';
import type { ImportJob, ImportJobError, ImportJobStatus } from '@/types/excel-import';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
  FileText,
  Clock3,
} from 'lucide-react';

type UploadStage = 'upload' | 'importing' | 'results';

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function getStatusLabel(status: ImportJobStatus): string {
  switch (status) {
    case 'queued':
      return 'En cola';
    case 'validating':
      return 'Validando';
    case 'ingesting':
      return 'Importando';
    case 'success':
      return 'Completado';
    case 'failed':
      return 'Fallido';
    default:
      return status;
  }
}

function getStatusVariant(status: ImportJobStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'success':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'ingesting':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatImportErrorLine(line: number): string {
  return line > 0 ? `#${line}` : 'General';
}

function formatImportErrorColumn(column?: string): string {
  return column?.trim() ? column : 'General';
}

function formatImportErrorReason(error: ImportJobError): string {
  if (error.reason.includes('already exists')) {
    return 'El producto ya existe en el catálogo del proveedor. Estás reintentando importar un Excel con handles ya creados.';
  }

  return error.reason;
}

export function BulkUploadForm() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<UploadStage>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const lowerName = file.name.toLowerCase();
    const hasValidExtension = ACCEPTED_EXTENSIONS.some(extension => lowerName.endsWith(extension));

    if (!hasValidExtension) {
      return 'Solo se permiten archivos Excel (.xlsx, .xls).';
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'El archivo supera el máximo permitido de 10 MB.';
    }

    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: 'Archivo no válido',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setCurrentJob(null);
    setStage('upload');
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Solo desactivar si salimos del contenedor principal
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: 'Tipo de archivo inválido',
          description: validationError,
          variant: 'destructive',
        });
        return;
      }
      processFile(file);
    }
  };

  const handleImport = async () => {
    if (!user || !selectedFile) {
      toast({
        title: 'Archivo no disponible',
        description: 'Selecciona un archivo Excel antes de iniciar la carga.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setStage('importing');

    try {
      const uploadResponse = await excelImportApi.uploadExcelVendor({ file: selectedFile });
      setCurrentJob({
        id: uploadResponse.job_id,
        seller_id: user.seller_id || '',
        file_name: selectedFile.name,
        status: uploadResponse.status,
        total_rows: uploadResponse.total_rows,
        processed_rows: 0,
        errors: [],
      });

      const finalJob = await excelImportApi.pollImportJob(
        uploadResponse.job_id,
        false,
        (job) => setCurrentJob(job)
      );

      setCurrentJob(finalJob);
      setStage('results');

      toast({
        title: finalJob.status === 'success' ? 'Importación completada' : 'Importación finalizada con errores',
        description:
          finalJob.status === 'success'
            ? `${finalJob.result?.created_product_ids.length || 0} productos creados correctamente.`
            : finalJob.errors.some(error => error.reason.includes('already exists'))
              ? 'El backend rechazó la importación porque algunos productos ya existen para este proveedor.'
              : `${finalJob.errors.length} errores detectados durante la validación o la ingesta.`,
        variant: finalJob.status === 'success' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Excel import failed:', error);
      toast({
        title: 'Error al importar archivo',
        description: error instanceof Error ? error.message : 'No se pudo completar la carga masiva.',
        variant: 'destructive',
      });
      setStage('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      setIsProcessing(true);
      const blob = await excelImportApi.downloadTemplateVendor();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'product-import-template.xlsx';
      anchor.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Plantilla descargada',
        description: 'Se descargó la plantilla oficial del backend para la carga masiva.',
      });
    } catch (error) {
      console.error('Template download failed:', error);
      toast({
        title: 'No se pudo descargar la plantilla',
        description: error instanceof Error ? error.message : 'Error desconocido al descargar la plantilla.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStage('upload');
    setFileName('');
    setSelectedFile(null);
    setCurrentJob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createdCount = currentJob?.result?.created_product_ids.length || 0;
  const processedPercentage = currentJob?.total_rows
    ? Math.round((currentJob.processed_rows / currentJob.total_rows) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {stage === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Archivo Excel
            </CardTitle>
            <CardDescription>
              Envía un archivo Excel al backend para crear un job de importación asíncrono
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Download className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-800">
                  Descarga la plantilla oficial y usa el mismo formato que valida el backend
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="ml-4"
                  disabled={isProcessing}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </AlertDescription>
            </Alert>

            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5 border-solid' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileSpreadsheet className={`h-16 w-16 mx-auto mb-4 transition-colors ${
                  isDragging ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium mb-2 transition-colors ${
                  isDragging ? 'text-primary' : ''
                }`}>
                  {isDragging ? '¡Suelta el archivo aquí!' : 'Click para seleccionar archivo'}
                </p>
                <p className="text-sm text-gray-500">
                  o arrastra y suelta aquí
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Excel (.xlsx, .xls) - Máximo 10 MB
                </p>
              </label>
            </div>

            {selectedFile && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <AlertDescription className="text-green-900">
                  Archivo seleccionado: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Flujo Real del Backend
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Descarga la plantilla oficial del backend.</p>
                <p>2. Selecciona un archivo Excel con extensión .xlsx o .xls.</p>
                <p>3. El backend crea un job y procesa el archivo de forma asíncrona.</p>
                <p>4. Esta pantalla consulta el estado del job hasta completarse o fallar.</p>
                <p>5. Si falla, se muestran errores por línea para corregir el archivo y reintentar.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                Limpiar
              </Button>
              <Button onClick={handleImport} disabled={!selectedFile || isProcessing} className="bg-green-600 hover:bg-green-700">
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                Iniciar Carga Masiva
              </Button>
            </div>

            {!user && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Debes iniciar sesión como proveedor para lanzar la importación.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {stage === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando Importación
            </CardTitle>
            <CardDescription>
              El backend está validando y procesando el Excel de forma asíncrona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentJob && (
              <>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm text-gray-500">Archivo</p>
                    <p className="font-medium">{currentJob.file_name || fileName}</p>
                  </div>
                  <Badge variant={getStatusVariant(currentJob.status)}>
                    <Clock3 className="h-3 w-3 mr-1" />
                    {getStatusLabel(currentJob.status)}
                  </Badge>
                </div>

                <Progress value={processedPercentage} className="w-full" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{currentJob.processed_rows} filas procesadas</span>
                  <span>{currentJob.total_rows} filas totales</span>
                </div>
              </>
            )}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No cierres esta ventana mientras el job siga en cola, validando o importando.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {stage === 'results' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentJob?.status === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Resultado de la Importación
            </CardTitle>
            <CardDescription>
              Revisa el estado final devuelto por el backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getStatusVariant(currentJob?.status || 'failed')}>
                    {getStatusLabel(currentJob?.status || 'failed')}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Productos creados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {createdCount}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Errores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-700">
                    {currentJob?.errors.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {currentJob?.errors.length ? <ImportErrorsTable errors={currentJob.errors} /> : null}

            {currentJob?.status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <AlertDescription className="text-green-900">
                  El backend completó la importación. Revisa los productos propuestos en la sección de Mis Productos.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Cargar Otro Archivo
              </Button>
              <Button onClick={() => window.location.href = '/supplier/products'}>
                Ver Mis Productos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ImportErrorsTable({ errors }: { errors: ImportJobError[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Línea</TableHead>
            <TableHead className="w-40">Columna</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="w-48">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((error, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm">
                {formatImportErrorLine(error.line)}
              </TableCell>
              <TableCell>{formatImportErrorColumn(error.column)}</TableCell>
              <TableCell className="text-sm text-red-700">{formatImportErrorReason(error)}</TableCell>
              <TableCell className="font-mono text-xs text-gray-600">{error.value || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
