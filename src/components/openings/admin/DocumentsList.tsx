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
