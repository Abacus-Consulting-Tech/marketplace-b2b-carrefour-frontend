/**
 * Portal Admin - Detalle de Proyecto de Apertura
 */

'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOpenings } from '@/lib/store/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { ProjectStatusBadge } from '@/components/openings/shared/ProjectStatusBadge';
import { CategoryForm } from '@/components/openings/admin/CategoryForm';
import { CategoryList } from '@/components/openings/admin/CategoryList';
import { InviteSupplierForm } from '@/components/openings/admin/InviteSupplierForm';
import { InvitationsList } from '@/components/openings/admin/InvitationsList';
import DocumentUploadForm from '@/components/openings/admin/DocumentUploadForm';
import DocumentsList from '@/components/openings/admin/DocumentsList';
import OpeningProcessGuide from '@/components/openings/shared/OpeningProcessGuide';
import ProjectWorkflowTimeline from '@/components/openings/shared/ProjectWorkflowTimeline';
import ProjectStatusChanger from '@/components/openings/admin/ProjectStatusChanger';
import StatusHistoryLog from '@/components/openings/shared/StatusHistoryLog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Building2, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/types/openings';
import { useToast } from '@/hooks/use-toast';
import type { ProjectCategory, SupplierInvitation } from '@/types/openings';
import type { MockSupplier } from '@/lib/api/openings-mock';

export default function AdminOpeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { toast } = useToast();

  const { selectedProject, selectProject, isLoadingProjects, setLoadingProjects } = useOpenings();
  const [error, setError] = React.useState<string | null>(null);
  
  // Categories state
  const [categories, setCategories] = React.useState<ProjectCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ProjectCategory | undefined>();
  const [savingCategory, setSavingCategory] = React.useState(false);

  // Invitations state
  const [invitations, setInvitations] = React.useState<SupplierInvitation[]>([]);
  const [suppliers, setSuppliers] = React.useState<MockSupplier[]>([]);
  const [loadingInvitations, setLoadingInvitations] = React.useState(false);
  const [inviteFormOpen, setInviteFormOpen] = React.useState(false);
  const [savingInvitation, setSavingInvitation] = React.useState(false);

  // Documents state
  const [documentsRefreshTrigger, setDocumentsRefreshTrigger] = React.useState(0);

  // Workflow state
  const [workflowRefreshTrigger, setWorkflowRefreshTrigger] = React.useState(0);

  useEffect(() => {
    async function loadProject() {
      try {
        console.log('[AdminOpeningDetail] Loading project:', projectId);
        setLoadingProjects(true);
        setError(null);
        const response = await openingsApi.getProjectById(projectId);
        console.log('[AdminOpeningDetail] Response:', response);
        
        if (response.success && response.data) {
          selectProject(response.data);
        } else {
          console.error('[AdminOpeningDetail] Failed to load project:', response.error);
          setError(response.error || 'Error al cargar el proyecto');
        }
      } catch (error) {
        console.error('[AdminOpeningDetail] Error loading project:', error);
        setError('Error al cargar el proyecto');
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProject();
  }, [projectId, selectProject, setLoadingProjects]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      if (!projectId) return;
      
      try {
        setLoadingCategories(true);
        const response = await openingsApi.getCategoriesByProject(projectId);
        
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('[AdminOpeningDetail] Error loading categories:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las categorías',
        });
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, [projectId, toast]);

  // Load invitations
  useEffect(() => {
    async function loadInvitations() {
      if (!projectId) return;
      
      try {
        setLoadingInvitations(true);
        const response = await openingsApi.getInvitationsByProject(projectId);
        
        if (response.success && response.data) {
          setInvitations(response.data);
        }
      } catch (error) {
        console.error('[AdminOpeningDetail] Error loading invitations:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las invitaciones',
        });
      } finally {
        setLoadingInvitations(false);
      }
    }

    loadInvitations();
  }, [projectId, toast]);

  // Load suppliers
  useEffect(() => {
    async function loadSuppliers() {
      try {
        const response = await openingsApi.getSuppliers();
        
        if (response.success && response.data) {
          setSuppliers(response.data);
        }
      } catch (error) {
        console.error('[AdminOpeningDetail] Error loading suppliers:', error);
      }
    }

    loadSuppliers();
  }, []);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: ProjectCategory) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await openingsApi.deleteCategory(categoryId);
      
      if (response.success) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast({
          title: 'Categoría eliminada',
          description: 'La categoría se ha eliminado correctamente',
        });
      } else {
        throw new Error(response.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('[AdminOpeningDetail] Error deleting category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la categoría',
      });
    }
  };

  const handleSubmitCategory = async (data: any) => {
    try {
      setSavingCategory(true);

      if (editingCategory) {
        // Update existing category
        const response = await openingsApi.updateCategory(editingCategory.id, data);
        
        if (response.success && response.data) {
          setCategories(prev => prev.map(c => 
            c.id === editingCategory.id ? response.data! : c
          ));
          toast({
            title: 'Categoría actualizada',
            description: 'Los cambios se han guardado correctamente',
          });
        }
      } else {
        // Create new category
        const response = await openingsApi.createCategory(projectId, data);
        
        if (response.success && response.data) {
          setCategories(prev => [...prev, response.data!]);
          toast({
            title: 'Categoría creada',
            description: 'La categoría se ha añadido correctamente',
          });
        }
      }

      setCategoryFormOpen(false);
      setEditingCategory(undefined);
    } catch (error) {
      console.error('[AdminOpeningDetail] Error saving category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la categoría',
      });
    } finally {
      setSavingCategory(false);
    }
  };

  // Invitation handlers
  const handleInviteSuppliers = () => {
    setInviteFormOpen(true);
  };

  const handleSubmitInvitation = async (data: {
    category_id: string;
    supplier_ids: string[];
    message?: string;
    deadline_days: number;
  }) => {
    try {
      setSavingInvitation(true);

      const response = await openingsApi.createInvitation(data);
      
      if (response.success && response.data) {
        setInvitations(prev => [...prev, ...response.data!]);
        toast({
          title: 'Invitaciones enviadas',
          description: `${response.data.length} proveedor(es) invitado(s) correctamente`,
        });
        setInviteFormOpen(false);
      } else {
        throw new Error(response.error || 'Error al crear invitaciones');
      }
    } catch (error) {
      console.error('[AdminOpeningDetail] Error creating invitations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron enviar las invitaciones',
      });
    } finally {
      setSavingInvitation(false);
    }
  };

  // Group invitations by category
  const invitationsByCategory = React.useMemo(() => {
    return invitations.reduce((acc, inv) => {
      if (!acc[inv.category_id]) {
        acc[inv.category_id] = [];
      }
      acc[inv.category_id].push(inv);
      return acc;
    }, {} as Record<string, SupplierInvitation[]>);
  }, [invitations]);

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Cargando proyecto...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => router.push('/admin/openings')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-600 mb-4">Proyecto no encontrado</div>
        <Button onClick={() => router.push('/admin/openings')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
            <p className="text-gray-600 mt-1">{selectedProject.description || 'Sin descripción'}</p>
          </div>
          <ProjectStatusBadge status={selectedProject.status} />
        </div>
      </div>

      <OpeningProcessGuide currentStatus={selectedProject.status} role="admin" />

      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Franquiciado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{selectedProject.franchisee?.name || 'No disponible'}</p>
            <p className="text-sm text-gray-600">{selectedProject.franchisee?.email || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{selectedProject.address.street}</p>
            <p className="text-sm text-gray-600">
              {selectedProject.address.postal_code} {selectedProject.address.city}
            </p>
            <p className="text-sm text-gray-600">{selectedProject.address.province}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Apertura Planificada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">
              {selectedProject.planned_opening_date
                ? formatDate(selectedProject.planned_opening_date)
                : 'No definida'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="quotes">Presupuestos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Descripción</h4>
                <p className="text-gray-600">{selectedProject.description || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Superficie</h4>
                  <p className="text-gray-600">
                    {selectedProject.store_size_sqm
                      ? `${selectedProject.store_size_sqm} m²`
                      : 'No especificada'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Formato</h4>
                  <p className="text-gray-600">
                    {selectedProject.store_format || 'No especificado'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Datos Fiscales</h4>
                {selectedProject.fiscal_data ? (
                  <>
                    <p className="text-gray-600">
                      CIF: {selectedProject.fiscal_data.tax_id}
                    </p>
                    <p className="text-gray-600">
                      {selectedProject.fiscal_data.company_name}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600">No disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {/* Timeline del Workflow */}
          <ProjectWorkflowTimeline
            currentStatus={selectedProject.status}
            showProgress={true}
          />

          {/* Control de Estado (Admin) */}
          <ProjectStatusChanger
            project={selectedProject}
            onStatusChanged={(updatedProject) => {
              selectProject(updatedProject);
              setWorkflowRefreshTrigger((prev) => prev + 1);
            }}
          />

          {/* Historial de Cambios */}
          <StatusHistoryLog
            projectId={selectedProject.id}
            refreshTrigger={workflowRefreshTrigger}
          />
        </TabsContent>

        <TabsContent value="categories">
          {loadingCategories ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Cargando categorías...</span>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-4 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-950">Paso 1: prepara las categorías antes de invitar</h3>
                  <p className="mt-1 text-sm text-blue-800">
                    Cada categoría debe tener alcance, requisitos y documentos suficientes para que el proveedor cotice sin idas y vueltas.
                  </p>
                </CardContent>
              </Card>
              <CategoryList
                categories={categories}
                onAdd={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                isLoading={savingCategory}
              />
              <CategoryForm
                open={categoryFormOpen}
                onOpenChange={setCategoryFormOpen}
                onSubmit={handleSubmitCategory}
                category={editingCategory}
                isLoading={savingCategory}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="suppliers">
          {loadingInvitations ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Cargando invitaciones...</span>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-950">Paso 2: invita proveedores por categoría</h3>
                  <p className="mt-1 text-sm text-blue-800">
                    Selecciona la categoría, el proveedor y la fecha límite. El proveedor verá los documentos técnicos y podrá presentar su presupuesto.
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Proveedores Invitados</h3>
                  <p className="text-sm text-gray-600">
                    {invitations.length} invitación(es) enviada(s)
                  </p>
                </div>
                <Button onClick={handleInviteSuppliers} disabled={categories.length === 0}>
                  Invitar Proveedores
                </Button>
              </div>

              <InvitationsList
                categories={categories}
                invitationsByCategory={invitationsByCategory}
              />

              <InviteSupplierForm
                open={inviteFormOpen}
                onOpenChange={setInviteFormOpen}
                onSubmit={handleSubmitInvitation}
                categories={categories}
                suppliers={suppliers}
                isLoading={savingInvitation}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Presupuestos Recibidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funcionalidad en desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

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
      </Tabs>
    </div>
  );
}
