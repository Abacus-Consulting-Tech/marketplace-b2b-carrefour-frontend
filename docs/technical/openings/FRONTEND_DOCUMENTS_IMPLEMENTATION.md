# 📄 Implementación Frontend - Sistema de Documentos Múltiples

## 🎯 Objetivo

Implementar en el frontend el soporte para **múltiples planos técnicos categorizados** en lugar del sistema actual de un solo `floor_plan`.

El sistema debe permitir:
- ✅ Subir múltiples documentos categorizados (equipamientos, iluminación, clima, electricidad, obras generales)
- ✅ Listar documentos con filtros por categoría
- ✅ Descargar documentos
- ✅ Eliminar documentos
- ✅ Vista organizada por categorías con subcategorías

---

## 📋 Checklist de Implementación

### 1. Tipos TypeScript (types/openings.ts)
- [ ] Crear tipo `ProjectDocument`
- [ ] Crear tipo `DocumentCategory`
- [ ] Crear tipo `UploadDocumentRequest`
- [ ] Actualizar `OpeningProject` (opcional: deprecated `floor_plan_url`)

### 2. API Client (lib/api/openings-client.ts)
- [ ] `uploadProjectDocument()` - Subir nuevo documento
- [ ] `getProjectDocuments()` - Listar documentos con filtros
- [ ] `getDocumentDownloadUrl()` - Obtener URL de descarga
- [ ] `deleteProjectDocument()` - Eliminar documento

### 3. Mock Data (lib/api/openings-mock.ts)
- [ ] Array `mockProjectDocuments`
- [ ] Funciones helper para CRUD de documentos mock

### 4. Componentes React
- [ ] `DocumentUploadForm.tsx` - Formulario de upload
- [ ] `DocumentsList.tsx` - Lista de documentos con categorías
- [ ] `DocumentCategoryTabs.tsx` - Tabs por categoría
- [ ] `DocumentCard.tsx` - Card individual de documento

### 5. Integración en Páginas
- [ ] Admin: `/admin/openings/[id]` - Tab de Documentos mejorado
- [ ] Admin: `/admin/openings/new` - Sección de documentos en crear proyecto
- [ ] Franchisee: Vista de documentos del proyecto
- [ ] Supplier: Vista de documentos al recibir invitación

---

## 📝 1. Tipos TypeScript

### Archivo: `src/types/openings.ts`

Añadir estos tipos al archivo existente:

```typescript
/**
 * Categorías de documentos de proyecto
 */
export type DocumentCategory = 
  | 'equipamientos'
  | 'obras_iluminacion'
  | 'obras_clima'
  | 'obras_electricidad'
  | 'obras_general'
  | 'otros';

/**
 * Documento técnico de un proyecto
 */
export interface ProjectDocument {
  id: string;
  project_id: string;
  category: DocumentCategory;
  subcategory?: string | null;
  name: string;
  description?: string | null;
  file_url: string;
  file_name: string;
  file_size_bytes: number;
  file_mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  is_active: boolean;
  version: number;
}

/**
 * Request para subir documento
 */
export interface UploadDocumentRequest {
  category: DocumentCategory;
  subcategory?: string;
  name: string;
  description?: string;
  file: File;
}

/**
 * Respuesta de lista de documentos con estadísticas
 */
export interface ProjectDocumentsResponse {
  project_id: string;
  documents: ProjectDocument[];
  total_documents: number;
  categories: Record<DocumentCategory, number>;
}

/**
 * Metadatos de categorías de documentos
 */
export interface DocumentCategoryMetadata {
  code: DocumentCategory;
  label: string;
  description: string;
  icon: string; // Nombre del icono de lucide-react
  color: string; // Clase de Tailwind para color
}
```

---

## 🔌 2. API Client

### Archivo: `src/lib/api/openings-client.ts`

Añadir estos métodos al objeto `openingsApi`:

```typescript
// --------------------------------------------------------------------------
// Documents
// --------------------------------------------------------------------------

/**
 * Subir documento/plano técnico a un proyecto
 */
async uploadProjectDocument(
  projectId: string,
  data: UploadDocumentRequest
): Promise<ApiResponse<ProjectDocument>> {
  if (isMockMode) {
    const newDoc: ProjectDocument = {
      id: `doc_${Date.now()}`,
      project_id: projectId,
      category: data.category,
      subcategory: data.subcategory || null,
      name: data.name,
      description: data.description || null,
      file_url: `https://storage.example.com/docs/${data.category}_${projectId}_${Date.now()}.pdf`,
      file_name: data.file.name,
      file_size_bytes: data.file.size,
      file_mime_type: data.file.type,
      uploaded_by: 'admin_user_id',
      uploaded_at: new Date().toISOString(),
      is_active: true,
      version: 1,
    };

    // Añadir a mockProjectDocuments
    addMockDocument(newDoc);

    return mockDelay({
      success: true,
      data: newDoc,
      message: 'Documento subido exitosamente',
    });
  }

  // Modo real: llamada al backend
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('category', data.category);
  if (data.subcategory) formData.append('subcategory', data.subcategory);
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);

  const response = await apiClient.post<ApiResponse<ProjectDocument>>(
    `/admin/openings/projects/${projectId}/documents`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
},

/**
 * Obtener lista de documentos de un proyecto
 */
async getProjectDocuments(
  projectId: string,
  filters?: {
    category?: DocumentCategory;
    subcategory?: string;
  }
): Promise<ApiResponse<ProjectDocumentsResponse>> {
  if (isMockMode) {
    let documents = getMockDocumentsByProject(projectId);

    // Aplicar filtros
    if (filters?.category) {
      documents = documents.filter((d) => d.category === filters.category);
    }
    if (filters?.subcategory) {
      documents = documents.filter((d) => d.subcategory === filters.subcategory);
    }

    // Calcular estadísticas por categoría
    const categories: Record<string, number> = {};
    documents.forEach((doc) => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
    });

    return mockDelay({
      success: true,
      data: {
        project_id: projectId,
        documents,
        total_documents: documents.length,
        categories: categories as Record<DocumentCategory, number>,
      },
    });
  }

  // Modo real: llamada al backend
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.subcategory) params.append('subcategory', filters.subcategory);

  const queryString = params.toString();
  const url = `/admin/openings/projects/${projectId}/documents${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<ApiResponse<ProjectDocumentsResponse>>(url);
  return response.data;
},

/**
 * Obtener URL de descarga de un documento específico
 */
async getDocumentDownloadUrl(
  projectId: string,
  documentId: string
): Promise<ApiResponse<{ download_url: string; expires_at: string }>> {
  if (isMockMode) {
    const doc = getMockDocumentById(documentId);
    
    if (!doc) {
      return mockDelay({
        success: false,
        error: 'Documento no encontrado',
      });
    }

    return mockDelay({
      success: true,
      data: {
        download_url: doc.file_url,
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hora
      },
    });
  }

  // Modo real: llamada al backend
  const response = await apiClient.get<ApiResponse<{ download_url: string; expires_at: string }>>(
    `/admin/openings/projects/${projectId}/documents/${documentId}`
  );
  return response.data;
},

/**
 * Eliminar un documento del proyecto
 */
async deleteProjectDocument(
  projectId: string,
  documentId: string
): Promise<ApiResponse<void>> {
  if (isMockMode) {
    deleteMockDocument(documentId);

    return mockDelay({
      success: true,
      data: undefined,
      message: 'Documento eliminado exitosamente',
    });
  }

  // Modo real: llamada al backend
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/openings/projects/${projectId}/documents/${documentId}`
  );
  return response.data;
},
```

---

## 🗃️ 3. Mock Data

### Archivo: `src/lib/api/openings-mock.ts`

Añadir al final del archivo:

```typescript
// ============================================================================
// MOCK: Project Documents
// ============================================================================

export let mockProjectDocuments: ProjectDocument[] = [
  {
    id: 'doc_001',
    project_id: 'proj_test_001',
    category: 'equipamientos',
    subcategory: null,
    name: 'Layout Mobiliario Principal',
    description: 'Distribución de estanterías, mostradores y equipos refrigerados. Escala 1:50',
    file_url: 'https://storage.example.com/docs/equipamientos_proj_test_001_001.pdf',
    file_name: 'layout_mobiliario.pdf',
    file_size_bytes: 2458624,
    file_mime_type: 'application/pdf',
    uploaded_by: 'admin_user_id',
    uploaded_at: '2026-01-15T10:30:00Z',
    is_active: true,
    version: 1,
  },
  {
    id: 'doc_002',
    project_id: 'proj_test_001',
    category: 'obras_iluminacion',
    subcategory: 'circuitos',
    name: 'Esquema de Circuitos de Iluminación',
    description: 'Plano eléctrico de circuitos lumínicos con tipos de luminarias y potencias',
    file_url: 'https://storage.example.com/docs/obras_iluminacion_proj_test_001_002.pdf',
    file_name: 'circuitos_iluminacion.pdf',
    file_size_bytes: 3145728,
    file_mime_type: 'application/pdf',
    uploaded_by: 'admin_user_id',
    uploaded_at: '2026-01-15T11:00:00Z',
    is_active: true,
    version: 1,
  },
  {
    id: 'doc_003',
    project_id: 'proj_test_001',
    category: 'obras_clima',
    subcategory: 'hvac',
    name: 'Sistema de Climatización HVAC',
    description: 'Distribución de conductos, difusores y equipos de climatización',
    file_url: 'https://storage.example.com/docs/obras_clima_proj_test_001_003.pdf',
    file_name: 'hvac_climatizacion.pdf',
    file_size_bytes: 4194304,
    file_mime_type: 'application/pdf',
    uploaded_by: 'admin_user_id',
    uploaded_at: '2026-01-15T11:30:00Z',
    is_active: true,
    version: 1,
  },
  {
    id: 'doc_004',
    project_id: 'proj_test_001',
    category: 'obras_electricidad',
    subcategory: 'cuadros',
    name: 'Esquema Cuadros Eléctricos',
    description: 'Diagrama unifilar de cuadros eléctricos generales y secundarios',
    file_url: 'https://storage.example.com/docs/obras_electricidad_proj_test_001_004.pdf',
    file_name: 'cuadros_electricos.pdf',
    file_size_bytes: 2621440,
    file_mime_type: 'application/pdf',
    uploaded_by: 'admin_user_id',
    uploaded_at: '2026-01-15T12:00:00Z',
    is_active: true,
    version: 1,
  },
  {
    id: 'doc_005',
    project_id: 'proj_test_001',
    category: 'obras_general',
    subcategory: 'planta',
    name: 'Plano Planta General',
    description: 'Distribución general de espacios: zona comercial, almacén, baños, oficina',
    file_url: 'https://storage.example.com/docs/obras_general_proj_test_001_005.pdf',
    file_name: 'planta_general.pdf',
    file_size_bytes: 5242880,
    file_mime_type: 'application/pdf',
    uploaded_by: 'admin_user_id',
    uploaded_at: '2026-01-15T12:30:00Z',
    is_active: true,
    version: 1,
  },
];

// Helpers
export function getMockDocumentsByProject(projectId: string): ProjectDocument[] {
  return mockProjectDocuments.filter((d) => d.project_id === projectId && d.is_active);
}

export function getMockDocumentById(documentId: string): ProjectDocument | undefined {
  return mockProjectDocuments.find((d) => d.id === documentId);
}

export function addMockDocument(document: ProjectDocument): void {
  mockProjectDocuments.push(document);
}

export function deleteMockDocument(documentId: string): void {
  const index = mockProjectDocuments.findIndex((d) => d.id === documentId);
  if (index !== -1) {
    mockProjectDocuments[index].is_active = false; // Soft delete
  }
}
```

---

## 🎨 4. Componentes React

### 4.1. Constantes de Categorías

**Archivo:** `src/lib/constants/document-categories.ts` (nuevo)

```typescript
import { FileText, Lightbulb, Wind, Zap, Building2, FolderOpen } from 'lucide-react';
import type { DocumentCategoryMetadata } from '@/types/openings';

export const DOCUMENT_CATEGORIES: Record<string, DocumentCategoryMetadata> = {
  equipamientos: {
    code: 'equipamientos',
    label: 'Equipamientos',
    description: 'Planos de distribución y equipamiento comercial',
    icon: 'ShoppingCart',
    color: 'blue',
  },
  obras_iluminacion: {
    code: 'obras_iluminacion',
    label: 'Iluminación',
    description: 'Planos del sistema de iluminación',
    icon: 'Lightbulb',
    color: 'yellow',
  },
  obras_clima: {
    code: 'obras_clima',
    label: 'Climatización',
    description: 'Planos de climatización y ventilación',
    icon: 'Wind',
    color: 'cyan',
  },
  obras_electricidad: {
    code: 'obras_electricidad',
    label: 'Electricidad',
    description: 'Planos eléctricos y cableado',
    icon: 'Zap',
    color: 'orange',
  },
  obras_general: {
    code: 'obras_general',
    label: 'Obras Generales',
    description: 'Planos generales de construcción',
    icon: 'Building2',
    color: 'gray',
  },
  otros: {
    code: 'otros',
    label: 'Otros',
    description: 'Otros documentos técnicos',
    icon: 'FolderOpen',
    color: 'purple',
  },
};

export const CATEGORY_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
};
```

### 4.2. Componente: DocumentUploadForm

**Archivo:** `src/components/openings/admin/DocumentUploadForm.tsx` (nuevo)

```typescript
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
```

### 4.3. Componente: DocumentsList

**Archivo:** `src/components/openings/admin/DocumentsList.tsx` (nuevo)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Download, Trash2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { openingsApi } from '@/lib/api/openings-client';
import { DOCUMENT_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/document-categories';
import type { ProjectDocument, DocumentCategory } from '@/types/openings';

interface DocumentsListProps {
  projectId: string;
  refreshTrigger?: number; // Para forzar refresh
}

export default function DocumentsList({ projectId, refreshTrigger }: DocumentsListProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [documentToDelete, setDocumentToDelete] = useState<ProjectDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [projectId, refreshTrigger]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await openingsApi.getProjectDocuments(projectId);
      if (response.success && response.data) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los documentos',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: ProjectDocument) => {
    try {
      const response = await openingsApi.getDocumentDownloadUrl(projectId, doc.id);
      if (response.success && response.data) {
        window.open(response.data.download_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo descargar el documento',
      });
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await openingsApi.deleteProjectDocument(projectId, documentToDelete.id);
      if (response.success) {
        toast({
          title: 'Documento eliminado',
          description: 'El documento se ha eliminado correctamente',
        });
        setDocumentToDelete(null);
        loadDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el documento',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocuments =
    selectedCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No hay documentos</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sube documentos técnicos del proyecto usando el formulario arriba
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCategory(value as DocumentCategory | 'all')}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">
            Todos ({documents.length})
          </TabsTrigger>
          {Object.values(DOCUMENT_CATEGORIES).map((cat) => {
            const count = documents.filter((d) => d.category === cat.code).length;
            return (
              <TabsTrigger key={cat.code} value={cat.code}>
                {cat.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => {
              const category = DOCUMENT_CATEGORIES[doc.category];
              const colorClass = CATEGORY_COLORS[category?.color] || CATEGORY_COLORS.gray;

              return (
                <Card key={doc.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {doc.name}
                        </CardTitle>
                        {doc.subcategory && (
                          <CardDescription className="mt-1">
                            Subcategoría: {doc.subcategory}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={colorClass} variant="outline">
                        {category?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                      <span>
                        {new Date(doc.uploaded_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDocumentToDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El documento "{documentToDelete?.name}" será
              eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---

## 🔗 5. Integración en Páginas Existentes

### 5.1. Admin - Página de Detalles del Proyecto

**Archivo:** `src/app/(backoffice)/admin/openings/[id]/page.tsx`

Actualizar la sección del tab "Documentos":

```typescript
// Importar componentes nuevos
import DocumentUploadForm from '@/components/openings/admin/DocumentUploadForm';
import DocumentsList from '@/components/openings/admin/DocumentsList';

// Dentro del componente, añadir estado para refresh
const [documentsRefreshTrigger, setDocumentsRefreshTrigger] = useState(0);

// Reemplazar el TabsContent de "documents"
<TabsContent value="documents">
  <div className="space-y-6">
    {/* Formulario de Upload */}
    <DocumentUploadForm
      projectId={selectedProject.id}
      onUploadSuccess={() => setDocumentsRefreshTrigger((prev) => prev + 1)}
    />

    {/* Lista de Documentos */}
    <DocumentsList
      projectId={selectedProject.id}
      refreshTrigger={documentsRefreshTrigger}
    />
  </div>
</TabsContent>
```

---

## ✅ Testing del Sistema de Documentos

### Flujo completo de prueba:

1. **Crear proyecto** (Admin)
2. **Ir a detalles del proyecto** → Tab "Documentos"
3. **Subir documento**:
   - Categoría: `obras_iluminacion`
   - Subcategoría: `circuitos`
   - Nombre: "Esquema Circuitos Principales"
   - Archivo: PDF de prueba
4. **Verificar que aparece** en la lista
5. **Filtrar por categoría** usando los tabs
6. **Descargar documento**
7. **Eliminar documento**

---

## 📝 Resumen de Cambios

| Componente | Archivo | Status |
|------------|---------|--------|
| Tipos TypeScript | `types/openings.ts` | ✅ Añadir |
| Constantes | `lib/constants/document-categories.ts` | ✅ Crear |
| API Client | `lib/api/openings-client.ts` | ✅ Añadir 4 métodos |
| Mock Data | `lib/api/openings-mock.ts` | ✅ Añadir datos y helpers |
| Upload Form | `components/openings/admin/DocumentUploadForm.tsx` | ✅ Crear |
| Documents List | `components/openings/admin/DocumentsList.tsx` | ✅ Crear |
| Admin Page | `app/(backoffice)/admin/openings/[id]/page.tsx` | ✅ Actualizar tab |

---

## 🚀 Próximos Pasos

1. Implementar todos los tipos en `types/openings.ts`
2. Crear constantes de categorías
3. Añadir métodos al API client
4. Añadir mock data
5. Crear componentes `DocumentUploadForm` y `DocumentsList`
6. Integrar en página de admin
7. Testing completo

**¡Todo listo para implementar el sistema de documentos múltiples en el frontend!** 📄✨
