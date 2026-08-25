'use client';

import { useState, useEffect } from 'react';
import { ProjectDocument, ProjectDocumentsResponse } from '@/types/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { DOCUMENT_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/document-categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Loader2,
  Filter,
  Building2,
  Lightbulb,
  Wind,
  Zap,
  FolderOpen,
  ShoppingCart,
} from 'lucide-react';

interface ProjectDocumentsViewerProps {
  projectId: string;
  canDownload?: boolean; // Para restricciones de acceso
  showCategoryFilter?: boolean;
}

// Mapeo de iconos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Lightbulb,
  Wind,
  Zap,
  Building2,
  FolderOpen,
};

export default function ProjectDocumentsViewer({
  projectId,
  canDownload = true,
  showCategoryFilter = true,
}: ProjectDocumentsViewerProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  useEffect(() => {
    // Aplicar filtro de categoría
    if (selectedCategory === 'all') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(
        documents.filter((doc) => doc.category === selectedCategory)
      );
    }
  }, [selectedCategory, documents]);

  async function loadDocuments() {
    try {
      setLoading(true);
      const response = await openingsApi.getProjectDocuments(projectId);

      if (response.success && response.data) {
        setDocuments(response.data.documents);
        setFilteredDocuments(response.data.documents);
      } else {
        throw new Error(response.error || 'Error al cargar documentos');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los documentos del proyecto',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(doc: ProjectDocument) {
    if (!canDownload) {
      toast({
        variant: 'destructive',
        title: 'Acceso denegado',
        description: 'No tienes permisos para descargar este documento',
      });
      return;
    }

    setDownloadingIds((prev) => new Set(prev).add(doc.id));

    try {
      // En un entorno real, esto llamaría a un endpoint que devuelve una URL firmada
      // Por ahora simulamos la descarga con el file_url mock
      const response = await openingsApi.getDocumentDownloadUrl(projectId, doc.id);

      if (response.success && response.data?.download_url) {
        // Crear un enlace temporal y hacer click para descargar
        const link = document.createElement('a');
        link.href = response.data.download_url;
        link.download = doc.file_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: 'Descarga iniciada',
          description: `Descargando ${doc.name}`,
        });
      } else {
        throw new Error(response.error || 'Error al obtener URL de descarga');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo descargar el documento',
      });
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(doc.id);
        return next;
      });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getCategoryColor(category: string): string {
    const metadata = DOCUMENT_CATEGORIES[category];
    return metadata ? CATEGORY_COLORS[metadata.color] || CATEGORY_COLORS.gray : CATEGORY_COLORS.gray;
  }

  function getCategoryIcon(category: string) {
    const metadata = DOCUMENT_CATEGORIES[category];
    if (!metadata) return FolderOpen;

    const IconComponent = ICON_MAP[metadata.icon];
    return IconComponent || FolderOpen;
  }

  // Contar documentos por categoría
  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Técnicos
          </CardTitle>
          <CardDescription>
            Planos y documentación técnica del proyecto
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            No hay documentos disponibles para este proyecto
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Técnicos
            </CardTitle>
            <CardDescription>
              {documents.length} documento{documents.length !== 1 ? 's' : ''} disponible
              {documents.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>

          {showCategoryFilter && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todas ({documents.length})
                  </SelectItem>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([code, metadata]) => {
                    const count = categoryCounts[code] || 0;
                    if (count === 0) return null;

                    return (
                      <SelectItem key={code} value={code}>
                        {metadata.label} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {filteredDocuments.map((doc) => {
            const Icon = getCategoryIcon(doc.category);
            const isDownloading = downloadingIds.has(doc.id);
            const categoryMeta = DOCUMENT_CATEGORIES[doc.category];

            return (
              <div
                key={doc.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    <Icon className="h-10 w-10 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {doc.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(doc.category)} shrink-0`}
                      >
                        {categoryMeta?.label || doc.category}
                      </Badge>
                    </div>

                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{doc.file_name}</span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                      <span>
                        Subido el{' '}
                        {new Date(doc.uploaded_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                      {doc.version > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          v{doc.version}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(doc)}
                  disabled={!canDownload || isDownloading}
                  size="sm"
                  variant="outline"
                  className="shrink-0 ml-4"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && selectedCategory !== 'all' && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No hay documentos en esta categoría
            </p>
            <Button
              variant="link"
              onClick={() => setSelectedCategory('all')}
              className="mt-2"
            >
              Ver todos los documentos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
