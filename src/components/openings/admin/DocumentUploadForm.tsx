'use client';

import { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { openingsApi } from '@/lib/api/openings-client';
import { DOCUMENT_CATEGORIES } from '@/lib/constants/document-categories';
import type { DocumentCategory, UploadDocumentRequest } from '@/types/openings';

interface DocumentUploadFormProps {
  projectId: string;
  onUploadSuccess?: () => void;
}

export default function DocumentUploadForm({ projectId, onUploadSuccess }: DocumentUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [fileError, setFileError] = useState<string>('');

  const [formData, setFormData] = useState({
    category: '' as DocumentCategory | '',
    subcategory: '',
    name: '',
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setSelectedFile(undefined);
      return;
    }

    // Validar tipo
    if (file.type !== 'application/pdf') {
      setFileError('Solo se permiten archivos PDF');
      setSelectedFile(undefined);
      return;
    }

    // Validar tamaño (15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('El archivo no debe superar los 15MB');
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
    setFileError('');
    const fileInput = document.getElementById('document-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes seleccionar una categoría',
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes ingresar un nombre para el documento',
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes seleccionar un archivo PDF',
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadData: UploadDocumentRequest = {
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        name: formData.name,
        description: formData.description || undefined,
        file: selectedFile,
      };

      const response = await openingsApi.uploadProjectDocument(projectId, uploadData);

      if (response.success) {
        toast({
          title: 'Documento subido',
          description: 'El documento se ha subido correctamente',
        });

        // Resetear formulario
        setFormData({
          category: '',
          subcategory: '',
          name: '',
          description: '',
        });
        setSelectedFile(undefined);
        const fileInput = document.getElementById('document-file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // Callback
        onUploadSuccess?.();
      } else {
        throw new Error(response.error || 'Error al subir documento');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo subir el documento',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Documento Técnico</CardTitle>
        <CardDescription>Planos y documentación técnica del proyecto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as DocumentCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DOCUMENT_CATEGORIES).map((cat) => (
                  <SelectItem key={cat.code} value={cat.code}>
                    {cat.label} - {cat.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategoría (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">
              Subcategoría <span className="text-sm text-gray-500">(Opcional)</span>
            </Label>
            <Input
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="Ej: circuitos, hvac, cuadros..."
            />
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Documento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Esquema de Circuitos Principales"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-sm text-gray-500">(Opcional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del documento..."
              rows={3}
            />
          </div>

          {/* Upload de archivo */}
          <div className="space-y-2">
            <Label>Archivo PDF *</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="document-file-input"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Haz clic para seleccionar
                    <input
                      id="document-file-input"
                      name="document-file"
                      type="file"
                      className="sr-only"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">PDF hasta 15MB</p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {fileError && <p className="text-sm text-red-600">{fileError}</p>}
          </div>

          {/* Botón Submit */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
