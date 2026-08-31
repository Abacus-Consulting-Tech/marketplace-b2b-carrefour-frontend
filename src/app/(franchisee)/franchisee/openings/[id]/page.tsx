'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { openingsApi } from '@/lib/api/openings-client';
import type { OpeningProject, ProjectCategory, QuoteComparisonData } from '@/types/openings';
import { ProjectStatusBadge } from '@/components/openings/shared/ProjectStatusBadge';
import OpeningProcessGuide from '@/components/openings/shared/OpeningProcessGuide';
import { QuoteComparisonTable } from '@/components/openings/shared/QuoteComparisonTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  FileText, 
  ArrowLeft,
  Download,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '@/types/openings';

export default function FranchiseeProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<OpeningProject | null>(null);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [activeComparison, setActiveComparison] = useState<QuoteComparisonData | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Load project details
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoadingProject(true);
        const response = await openingsApi.getProjectById(projectId);
        if (response.success && response.data) {
          setProject(response.data);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await openingsApi.getCategoriesByProject(projectId);
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (projectId) {
      loadCategories();
    }
  }, [projectId]);

  const handleViewQuotes = async (categoryId: string) => {
    try {
      const response = await openingsApi.getQuoteComparison(categoryId);
      if (response.success && response.data) {
        setActiveComparison(response.data);
      }
    } catch (error) {
      console.error('Error loading quote comparison:', error);
    }
  };

  const handleAwardQuote = async (quoteId: string) => {
    try {
      const response = await openingsApi.awardQuote(quoteId);
      if (response.success) {
        // Reload comparison to show updated status
        if (activeComparison) {
          handleViewQuotes(activeComparison.category_id);
        }
        alert('Presupuesto seleccionado correctamente');
      }
    } catch (error) {
      console.error('Error awarding quote:', error);
      alert('Error al seleccionar el presupuesto');
    }
  };

  if (isLoadingProject) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
        <p className="text-gray-600 mb-6">El proyecto que buscas no existe o no tienes acceso.</p>
        <Button onClick={() => router.push('/franchisee/openings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mis Proyectos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/franchisee/openings')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <OpeningProcessGuide currentStatus={project.status} role="franchisee" />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="font-semibold">{project.address.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Apertura Planificada</p>
                <p className="font-semibold">
                  {project.planned_opening_date ? formatDate(project.planned_opening_date) : 'No definida'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="font-semibold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Categorías y Presupuestos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-700">{project.description || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dirección Completa</h4>
                  <p className="text-gray-700">
                    {project.address.street}<br />
                    {project.address.postal_code} {project.address.city}<br />
                    {project.address.province}, {project.address.country}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Detalles de la Tienda</h4>
                  <p className="text-gray-700">
                    <strong>Formato:</strong> {project.store_format || 'No especificado'}<br />
                    <strong>Tamaño:</strong> {project.store_size_sqm ? `${project.store_size_sqm} m²` : 'No especificado'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Datos Fiscales</h4>
                {project.fiscal_data ? (
                  <p className="text-gray-700">
                    <strong>Razón Social:</strong> {project.fiscal_data.company_name}<br />
                    <strong>CIF:</strong> {project.fiscal_data.tax_id}<br />
                    <strong>Contacto:</strong> {project.fiscal_data.contact_name} ({project.fiscal_data.contact_email})
                  </p>
                ) : (
                  <p className="text-gray-700">No disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories & Quotes Tab */}
        <TabsContent value="categories" className="space-y-6">
          {isLoadingCategories ? (
            <div className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay categorías definidas para este proyecto.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {category.quotes_count || 0} presupuesto{category.quotes_count !== 1 ? 's' : ''}
                        </Badge>
                        {category.awarded_quote_id && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Adjudicado
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => router.push(`/franchisee/openings/${projectId}/categories/${category.id}/compare`)}
                        disabled={!category.quotes_count || category.quotes_count === 0}
                      >
                        Comparar Presupuestos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quote Comparison Modal */}
          {activeComparison && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Comparación de Presupuestos - {activeComparison.category_name}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveComparison(null)}>
                    Cerrar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QuoteComparisonTable
                  data={activeComparison}
                  onSelectQuote={handleAwardQuote}
                  canSelectQuote={project.status === 'quotes_received' || project.status === 'pending_selection'}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.floor_plan_url && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Plano del Local</p>
                      <p className="text-sm text-gray-600">PDF</p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <a href={project.floor_plan_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </a>
                  </Button>
                </div>
              )}

              {project.additional_documents && project.additional_documents.length > 0 && (
                project.additional_documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{doc.name || `Documento ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">
                          {doc.size_bytes ? `${(doc.size_bytes / 1024 / 1024).toFixed(2)} MB` : 'Documento'}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </a>
                    </Button>
                  </div>
                ))
              )}

              {!project.floor_plan_url && (!project.additional_documents || project.additional_documents.length === 0) && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay documentos disponibles.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
