'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/auth';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { ProposeProductRequest } from '@/types/products-pricing';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
  FileText,
  TrendingUp,
} from 'lucide-react';

// Tipos para los datos del CSV (22 columnas de la plantilla real)
interface CSVRow {
  producto_id: string; // Código común para agrupar variantes
  titulo: string;
  descripcion?: string;
  categoria: string;
  subcategoria?: string;
  marca?: string;
  sku: string; // SKU / Referencia única por variante
  ean?: string; // EAN / Código de barras
  variante?: string; // Nombre legible (ej: "Talla M")
  opcion1?: string; // Nombre de opción 1 (ej: "Talla")
  valor1?: string; // Valor de opción 1 (ej: "M")
  opcion2?: string; // Nombre de opción 2 (ej: "Color")
  valor2?: string; // Valor de opción 2 (ej: "Marino")
  unidades_pack: string;
  precio: string; // Precio proveedor (€)
  iva: string; // IVA (%)
  stock?: string;
  imagen1?: string;
  imagen2?: string;
  imagen3?: string;
  imagen4?: string;
  imagen5?: string;
}

// Producto agrupado (puede tener múltiples variantes)
interface GroupedProduct {
  producto_id: string;
  title: string;
  description?: string;
  category_id: string;
  subcategory?: string;
  marca?: string;
  base_price: number; // Precio de la primera variante o promedio
  units_per_pack: number;
  tax_rate?: number;
  images: string[];
  rows: CSVRow[]; // Todas las filas CSV de este producto
  hasVariants: boolean; // true si tiene más de un SKU
}

interface ParsedProduct {
  producto_id: string; // ID del producto (puede agrupar múltiples filas)
  rowNumbers: number[]; // Filas del CSV que componen este producto
  data: GroupedProduct;
  isValid: boolean;
  errors: string[]; // Errores de validación
  parsedData?: ProposeProductRequest;
}

interface ImportResult {
  row: number;
  title: string;
  status: 'success' | 'error';
  message: string;
}

type UploadStage = 'upload' | 'preview' | 'importing' | 'results';

export function BulkUploadForm() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<UploadStage>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Validar un producto agrupado (puede tener múltiples variantes)
  const validateProduct = (grouped: GroupedProduct, rowNumbers: number[]): ParsedProduct => {
    const errors: string[] = [];
    
    // Validaciones del producto principal
    if (!grouped.title || grouped.title.trim().length < 3) {
      errors.push('Título debe tener al menos 3 caracteres');
    }
    
    if (!grouped.category_id || grouped.category_id.trim().length === 0) {
      errors.push('Categoría es obligatoria');
    }
    
    if (grouped.base_price <= 0) {
      errors.push('Precio debe ser mayor a 0');
    }
    
    if (grouped.units_per_pack < 1) {
      errors.push('Unidades por pack debe ser al menos 1');
    }

    if (grouped.tax_rate !== undefined && (grouped.tax_rate < 0 || grouped.tax_rate > 100)) {
      errors.push('IVA debe estar entre 0 y 100');
    }

    // Validar imágenes
    grouped.images.forEach((img, idx) => {
      if (img && !isValidURL(img)) {
        errors.push(`Imagen ${idx + 1} tiene URL inválida`);
      }
    });

    // Validar SKUs únicos en variantes
    if (grouped.hasVariants) {
      const skus = grouped.rows.map(r => r.sku);
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        errors.push('SKUs duplicados en las variantes');
      }
    }

    // Crear objeto parsedData si es válido
    let parsedData: ProposeProductRequest | undefined;
    if (errors.length === 0 && user) {
      // Crear array de variantes si es necesario
      const variants = grouped.hasVariants ? grouped.rows.map(row => {
        const options: Record<string, string> = {};
        if (row.opcion1 && row.valor1) options[row.opcion1] = row.valor1;
        if (row.opcion2 && row.valor2) options[row.opcion2] = row.valor2;

        return {
          title: row.variante || row.sku,
          sku: row.sku,
          base_price: parseFloat(row.precio),
          inventory_quantity: row.stock ? parseInt(row.stock) : undefined,
          manage_inventory: !!row.stock,
          options,
        };
      }) : undefined;

      parsedData = {
        sellerId: user.id,
        title: grouped.title.trim(),
        description: grouped.description?.trim(),
        base_price: grouped.base_price,
        units_per_pack: grouped.units_per_pack,
        category_id: grouped.category_id.trim(),
        subcategory: grouped.subcategory?.trim(),
        thumbnail: grouped.images[0],
        images: grouped.images.filter(Boolean),
        variants,
        ean: grouped.rows[0].ean?.trim(),
        tax_rate: grouped.tax_rate,
      };
    }

    return {
      producto_id: grouped.producto_id,
      rowNumbers,
      data: grouped,
      isValid: errors.length === 0,
      errors,
      parsedData,
    };
  };

  // Helper: Validar URL
  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Parsear archivo CSV y agrupar por Producto ID
  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return [];
    }

    // Parsear filas CSV
    const csvRows: Array<{ row: CSVRow; rowNumber: number }> = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      // Parser simple que maneja comillas
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim()); // Último valor

      // Mapear a CSVRow (esperamos 22 columnas)
      if (values.length >= 15) { // Al menos las columnas obligatorias
        const row: CSVRow = {
          producto_id: values[0] || '',
          titulo: values[1] || '',
          descripcion: values[2],
          categoria: values[3] || '',
          subcategoria: values[4],
          marca: values[5],
          sku: values[6] || '',
          ean: values[7],
          variante: values[8],
          opcion1: values[9],
          valor1: values[10],
          opcion2: values[11],
          valor2: values[12],
          unidades_pack: values[13] || '1',
          precio: values[14] || '0',
          iva: values[15] || '21',
          stock: values[16],
          imagen1: values[17],
          imagen2: values[18],
          imagen3: values[19],
          imagen4: values[20],
          imagen5: values[21],
        };

        csvRows.push({ row, rowNumber: i + 1 });
      }
    }

    // Agrupar por Producto ID
    const grouped = new Map<string, Array<{ row: CSVRow; rowNumber: number }>>();
    csvRows.forEach(({ row, rowNumber }) => {
      const pid = row.producto_id.trim();
      if (!pid) return; // Ignorar filas sin producto_id
      
      if (!grouped.has(pid)) {
        grouped.set(pid, []);
      }
      grouped.get(pid)!.push({ row, rowNumber });
    });

    // Convertir grupos a ParsedProduct
    const parsedProducts: ParsedProduct[] = [];
    grouped.forEach((rows, producto_id) => {
      // Usar datos de la primera fila para el producto principal
      const firstRow = rows[0].row;
      const allImages = [
        firstRow.imagen1,
        firstRow.imagen2,
        firstRow.imagen3,
        firstRow.imagen4,
        firstRow.imagen5,
      ].filter(Boolean) as string[];

      const groupedProduct: GroupedProduct = {
        producto_id,
        title: firstRow.titulo,
        description: firstRow.descripcion,
        category_id: firstRow.categoria,
        subcategory: firstRow.subcategoria,
        marca: firstRow.marca,
        base_price: parseFloat(firstRow.precio) || 0,
        units_per_pack: parseInt(firstRow.unidades_pack) || 1,
        tax_rate: parseFloat(firstRow.iva),
        images: allImages,
        rows: rows.map(r => r.row),
        hasVariants: rows.length > 1,
      };

      const rowNumbers = rows.map(r => r.rowNumber);
      const validated = validateProduct(groupedProduct, rowNumbers);
      parsedProducts.push(validated);
    });

    return parsedProducts;
  };

  // Procesar archivo seleccionado
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      
      setParsedProducts(parsed);
      setStage('preview');
      
      toast({
        title: '✅ Archivo procesado',
        description: `${parsed.length} productos encontrados. ${parsed.filter(p => p.isValid).length} válidos, ${parsed.filter(p => !p.isValid).length} con errores.`,
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: 'Error al procesar archivo',
        description: 'No se pudo leer el archivo. Verifica que sea un CSV válido.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
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
      // Validar tipo de archivo
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        toast({
          title: 'Tipo de archivo inválido',
          description: 'Solo se permiten archivos CSV o Excel (.csv, .xlsx)',
          variant: 'destructive',
        });
        return;
      }
      await processFile(file);
    }
  };

  // Importar productos
  const handleImport = async () => {
    if (!user) return;

    const validProducts = parsedProducts.filter(p => p.isValid && p.parsedData);
    if (validProducts.length === 0) {
      toast({
        title: 'No hay productos válidos',
        description: 'Corrige los errores antes de importar.',
        variant: 'destructive',
      });
      return;
    }

    setStage('importing');
    setImportProgress(0);
    const results: ImportResult[] = [];

    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i];
      
      try {
        await pricingApi.proposeProduct(product.parsedData!);
        results.push({
          row: product.rowNumbers[0], // Primera fila del grupo
          title: product.data.title,
          status: 'success',
          message: product.data.hasVariants 
            ? `Producto con ${product.data.rows.length} variantes propuesto correctamente`
            : 'Producto propuesto correctamente',
        });
      } catch (error) {
        results.push({
          row: product.rowNumbers[0],
          title: product.data.title,
          status: 'error',
          message: error instanceof Error ? error.message : 'Error desconocido',
        });
      }

      // Actualizar progreso
      setImportProgress(Math.round(((i + 1) / validProducts.length) * 100));
      
      // Pequeño delay para evitar saturar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setImportResults(results);
    setStage('results');

    const successCount = results.filter(r => r.status === 'success').length;
    toast({
      title: '✅ Importación completada',
      description: `${successCount} de ${validProducts.length} productos importados correctamente.`,
    });
  };

  // Descargar template CSV
  const downloadTemplate = () => {
    const template = `Producto ID,Título producto,Descripción,Categoría general,Subcategoría,Marca,SKU / Referencia,EAN / Código de barras,Variante,Opción 1,Valor 1,Opción 2,Valor 2,Unidades por pack,Precio proveedor (€),IVA (%),Stock,Imagen 1 URL,Imagen 2 URL,Imagen 3 URL,Imagen 4 URL,Imagen 5 URL
PANT-H-MAR,Pantalón hombre marino con logo,Pantalón de uniforme color marino con logo corporativo,Uniformes,Confección,Pomares,FPANH-38,1234567890123,Talla S,Talla,S,Color,Marino,1,18.70,21,20,https://placehold.co/400x400,https://placehold.co/400x400/blue,,,
PANT-H-MAR,Pantalón hombre marino con logo,Pantalón de uniforme color marino con logo corporativo,Uniformes,Confección,Pomares,FPANH-40,1234567890124,Talla M,Talla,M,Color,Marino,1,18.70,21,15,https://placehold.co/400x400,https://placehold.co/400x400/blue,,,
PREIMP-001,Super Precio Express,Preimpreso promocional para tienda,Preimpresos,Material,Altavia,67524,9876543210987,Pack 250,Formato,18.5x9.5cm,,,250,7.77,21,100,https://placehold.co/400x400,,,,`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: '📥 Template descargado',
      description: 'Usa este archivo como plantilla para importar tus productos.',
    });
  };

  // Reset
  const handleReset = () => {
    setStage('upload');
    setFileName('');
    setParsedProducts([]);
    setImportProgress(0);
    setImportResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedProducts.filter(p => p.isValid).length;
  const invalidCount = parsedProducts.filter(p => !p.isValid).length;
  const successCount = importResults.filter(r => r.status === 'success').length;
  const errorCount = importResults.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Stage: Upload */}
      {stage === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Archivo CSV
            </CardTitle>
            <CardDescription>
              Importa múltiples productos desde un archivo CSV o Excel (.csv, .xlsx)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Download */}
            <Alert className="bg-blue-50 border-blue-200">
              <Download className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-800">
                  ¿Primera vez? Descarga la plantilla para ver el formato correcto
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="ml-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </AlertDescription>
            </Alert>

            {/* File Upload */}
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
                accept=".csv,.xlsx"
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
                  CSV o Excel (.csv, .xlsx) - Máximo 1000 filas
                </p>
              </label>
            </div>

            {/* Format Guide */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Formato del Archivo (22 columnas)
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">📋 Columnas del Producto Principal:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code className="bg-white px-1 rounded">Producto ID</code> - Código común para agrupar variantes (ej: PANT-H-MAR)</li>
                    <li><code className="bg-white px-1 rounded">Título producto</code> - Nombre del producto (mín. 3 caracteres) <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">Descripción</code> - Descripción completa del producto</li>
                    <li><code className="bg-white px-1 rounded">Categoría general</code> - Categoría principal <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">Subcategoría</code> - Subcategoría o tipo de producto</li>
                    <li><code className="bg-white px-1 rounded">Marca</code> - Marca o fabricante</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-700 mb-1">🏷️ Identificadores y Variantes:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code className="bg-white px-1 rounded">SKU / Referencia</code> - Código único de variante <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">EAN / Código de barras</code> - Código de barras del producto</li>
                    <li><code className="bg-white px-1 rounded">Variante</code> - Nombre legible (ej: &quot;Talla M&quot;, &quot;Pack 250&quot;)</li>
                    <li><code className="bg-white px-1 rounded">Opción 1</code> - Nombre de opción (ej: &quot;Talla&quot;, &quot;Color&quot;)</li>
                    <li><code className="bg-white px-1 rounded">Valor 1</code> - Valor de opción 1 (ej: &quot;M&quot;, &quot;Azul&quot;)</li>
                    <li><code className="bg-white px-1 rounded">Opción 2</code> - Segunda opción si aplica</li>
                    <li><code className="bg-white px-1 rounded">Valor 2</code> - Valor de opción 2</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-700 mb-1">💰 Precios y Stock:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code className="bg-white px-1 rounded">Unidades por pack</code> - Cantidad de unidades por pack (entero &gt;= 1) <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">Precio proveedor (€)</code> - Precio neto del proveedor (número &gt; 0) <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">IVA (%)</code> - Tipo de IVA: 0, 10 o 21 <span className="text-red-600">*</span></li>
                    <li><code className="bg-white px-1 rounded">Stock</code> - Unidades disponibles (opcional)</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-700 mb-1">🖼️ Imágenes (URLs públicas HTTPS):</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li><code className="bg-white px-1 rounded">Imagen 1 URL</code> - Imagen principal (recomendada)</li>
                    <li><code className="bg-white px-1 rounded">Imagen 2-5 URL</code> - Imágenes adicionales (opcionales)</li>
                  </ul>
                </div>

                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Sistema de Variantes:</strong> Múltiples filas con el mismo <code className="bg-white px-1">Producto ID</code> se agrupan 
                    automáticamente como variantes del mismo producto. Perfecto para tallas, colores o formatos.
                  </p>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-red-600">*</span> Campos obligatorios
                </p>
              </div>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span className="text-gray-600">Procesando archivo...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage: Preview */}
      {stage === 'preview' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Vista Previa - {fileName}
                </CardTitle>
                <CardDescription>
                  Revisa los datos antes de importar
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleReset}>
                Cambiar Archivo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Filas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parsedProducts.length}</div>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700">
                    Válidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">
                    {validCount}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700">
                    Con Errores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    {invalidCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Table with Tabs */}
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  Todos ({parsedProducts.length})
                </TabsTrigger>
                <TabsTrigger value="valid">
                  Válidos ({validCount})
                </TabsTrigger>
                <TabsTrigger value="invalid">
                  Errores ({invalidCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ProductsPreviewTable products={parsedProducts} />
              </TabsContent>

              <TabsContent value="valid" className="mt-4">
                <ProductsPreviewTable 
                  products={parsedProducts.filter(p => p.isValid)} 
                />
              </TabsContent>

              <TabsContent value="invalid" className="mt-4">
                <ProductsPreviewTable 
                  products={parsedProducts.filter(p => !p.isValid)} 
                />
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={validCount === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Importar {validCount} Producto{validCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stage: Importing */}
      {stage === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Importando Productos...
            </CardTitle>
            <CardDescription>
              Por favor espera mientras se importan los productos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={importProgress} className="w-full" />
            <p className="text-center text-lg font-medium">
              {importProgress}% completado
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No cierres esta ventana hasta que la importación termine
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Stage: Results */}
      {stage === 'results' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Importación Completada
            </CardTitle>
            <CardDescription>
              Revisa los resultados de la importación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Results Summary */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Exitosos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {successCount}
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
                    {errorCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Fila</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                    <TableHead>Mensaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        #{result.row}
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.title}
                      </TableCell>
                      <TableCell>
                        {result.status === 'success' ? (
                          <Badge className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Éxito
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {result.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Importar Más Productos
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

// Component: Products Preview Table
function ProductsPreviewTable({ products }: { products: ParsedProduct[] }) {
  if (products.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay productos en esta categoría
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Producto ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="w-20">Variantes</TableHead>
            <TableHead className="w-32">Precio</TableHead>
            <TableHead className="w-24">Unid/Pack</TableHead>
            <TableHead className="w-32">Estado</TableHead>
            <TableHead>Errores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm">
                {product.producto_id || <span className="text-gray-400">—</span>}
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  {product.data.title || <span className="text-gray-400">Sin título</span>}
                  {product.data.subcategoria && (
                    <div className="text-xs text-gray-500 mt-1">
                      {product.data.category_id} › {product.data.subcategoria}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {product.data.hasVariants ? (
                  <Badge variant="outline" className="text-xs">
                    {product.data.rows.length} SKUs
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">1 SKU</span>
                )}
              </TableCell>
              <TableCell>
                €{product.data.base_price.toFixed(2)}
              </TableCell>
              <TableCell>
                {product.data.units_per_pack}
              </TableCell>
              <TableCell>
                {product.isValid ? (
                  <Badge className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Válido
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {product.errors.length > 0 ? (
                  <ul className="text-xs text-red-600 space-y-1">
                    {product.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
