/**
 * Portal Franquiciado - Mis tiendas
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { ProjectListResponse } from '@/types/openings';
import { FranchiseeStore } from '@/types/franchisees';
import { openingsApi } from '@/lib/api/openings-client';
import { franchiseeStoresApi } from '@/lib/api/franchisee-stores-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Building2,
  Calendar,
  FileText,
  ChevronRight,
  Search,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

interface StoreData {
  id: string;
  name: string;
  sapCode: string;
  companyName: string;
  taxId: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

function createEmptyStore(): StoreData {
  return {
    id: `store_${Date.now()}`,
    name: '',
    sapCode: '',
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  };
}

function toEditableStore(store: FranchiseeStore): StoreData {
  return {
    id: store.id,
    name: store.name,
    sapCode: store.sapCode || '',
    companyName: store.companyName || '',
    taxId: store.taxId || '',
    address: store.address,
    city: store.city,
    province: store.province || '',
    postalCode: store.postalCode || '',
  };
}

function toStoredStore(franchiseeId: string, store: StoreData): FranchiseeStore {
  return {
    id: store.id,
    franchiseeId,
    name: store.name,
    sapCode: store.sapCode || undefined,
    companyName: store.companyName || undefined,
    taxId: store.taxId || undefined,
    address: store.address,
    city: store.city,
    province: store.province || undefined,
    postalCode: store.postalCode || undefined,
    createdAt: new Date().toISOString(),
  };
}

export default function FranchiseeOpeningsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<ProjectListResponse[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isStorePanelOpen, setIsStorePanelOpen] = useState(false);
  const [isEditingStores, setIsEditingStores] = useState(false);
  const [isSavingStores, setIsSavingStores] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      if (!user?.id) {
        setStores([]);
        return;
      }

      const response = await franchiseeStoresApi.listStores(user.id);
      setStores(response.stores.map(toEditableStore));
    }

    loadStores();
    loadProjects();
  }, [user?.id]);

  async function loadProjects() {
    try {
      setLoading(true);
      console.log('[FranchiseeOpenings] Cargando proyectos...');
      // En un entorno real, esto cargaría solo los proyectos asignados al franquiciado autenticado
      const response = await openingsApi.getProjects();
      console.log('[FranchiseeOpenings] Response:', response);

      if (response.success && response.data) {
        // response.data ya es el array de proyectos (ProjectListResponse[])
        console.log('[FranchiseeOpenings] Proyectos recibidos:', response.data.length);
        setProjects(response.data);
      } else {
        console.log('[FranchiseeOpenings] No se recibieron datos o fallo:', response);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      preparing_documentation: 'Preparando Documentación',
      requesting_quotes: 'Solicitando Presupuestos',
      quotes_received: 'Presupuestos Recibidos',
      pending_selection: 'Pendiente de Selección',
      comparing_quotes: 'Comparando Ofertas',
      awarded: 'Adjudicado',
      pending_signature: 'Pendiente de Firma',
      signed: 'Firmado',
      pending_financing: 'Pendiente de Financiación',
      financing_approved: 'Financiación Aprobada',
      financing_rejected: 'Financiación Rechazada',
      approved: 'Aprobado',
      in_execution: 'En Ejecución',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      preparing_documentation: 'bg-blue-100 text-blue-800',
      requesting_quotes: 'bg-purple-100 text-purple-800',
      quotes_received: 'bg-indigo-100 text-indigo-800',
      pending_selection: 'bg-amber-100 text-amber-800',
      comparing_quotes: 'bg-yellow-100 text-yellow-800',
      awarded: 'bg-green-100 text-green-800',
      pending_signature: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-emerald-100 text-emerald-800',
      pending_financing: 'bg-orange-100 text-orange-800',
      financing_approved: 'bg-green-100 text-green-800',
      financing_rejected: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      in_execution: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProjects = normalizedSearch
    ? projects.filter((project) => {
        const searchableText = [
          project.name,
          project.franchisee.name,
          project.franchisee.email,
          getStatusLabel(project.status),
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : projects;

  function handleStartEditingStores() {
    setStores((currentStores) => currentStores.length > 0 ? currentStores : [createEmptyStore()]);
    setIsStorePanelOpen(true);
    setIsEditingStores(true);
  }

  function handleOpenStorePanel() {
    setIsStorePanelOpen(true);
  }

  function handleCloseStorePanel() {
    if (user?.id) {
      franchiseeStoresApi.listStores(user.id).then((response) => {
        setStores(response.stores.map(toEditableStore));
      });
    } else {
      setStores([]);
    }

    setIsEditingStores(false);
    setIsStorePanelOpen(false);
  }

  function handleStoreChange(index: number, field: keyof StoreData, value: string) {
    setStores((currentStores) =>
      currentStores.map((store, storeIndex) =>
        storeIndex === index ? { ...store, [field]: value } : store
      )
    );
  }

  function handleAddStore() {
    setStores((currentStores) => [...currentStores, createEmptyStore()]);
  }

  function handleRemoveStore(index: number) {
    setStores((currentStores) => currentStores.filter((_, storeIndex) => storeIndex !== index));
  }

  async function handleSaveStores() {
    if (!user?.id) return;

    setIsSavingStores(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const existingStores = await franchiseeStoresApi.listStores(user.id);
    const createdAtById = new Map(existingStores.stores.map((store) => [store.id, store.createdAt]));
    const nextStores = stores.map((store) => ({
      ...toStoredStore(user.id, store),
      createdAt: createdAtById.get(store.id) || new Date().toISOString(),
    }));

    await franchiseeStoresApi.replaceStores(user.id, nextStores);

    toast({
      title: 'Tiendas actualizadas',
      description: 'Tus tiendas se han guardado correctamente.',
    });

    setIsSavingStores(false);
    setIsEditingStores(false);
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis aperturas</h1>
          <p className="text-gray-600">
            Consulta las aperturas asignadas y gestiona los datos de tienda solo cuando necesites preparar una nueva alta.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" asChild>
            <Link href="/marketplace/openings/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva apertura
            </Link>
          </Button>
          {stores.length > 0 && !isStorePanelOpen && (
            <Button type="button" variant="outline" onClick={handleOpenStorePanel}>
              Gestionar tiendas
            </Button>
          )}
        </div>
      </div>

      {isStorePanelOpen && (
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Datos de tienda para la apertura</CardTitle>
              <CardDescription>
                Registra o edita las tiendas que necesites asociar a una nueva apertura.
              </CardDescription>
            </div>
            {isEditingStores ? (
              <Button type="button" variant="outline" onClick={handleAddStore}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir tienda
              </Button>
            ) : (
              <Button type="button" onClick={handleStartEditingStores}>
                {stores.length > 0 ? 'Editar tiendas' : 'Añadir tienda'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stores.length === 0 ? (
            <div className="text-center py-8 rounded-lg border border-dashed bg-gray-50">
              <Building2 className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-600">Todavía no has dado de alta ninguna tienda</p>
            </div>
          ) : (
            stores.map((store, index) => (
              <div key={store.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Tienda {index + 1}</h3>
                  {isEditingStores && stores.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveStore(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`store-name-${store.id}`}>Nombre de la tienda</Label>
                    <Input
                      id={`store-name-${store.id}`}
                      value={store.name}
                      onChange={(event) => handleStoreChange(index, 'name', event.target.value)}
                      disabled={!isEditingStores}
                      placeholder="Carrefour Express Madrid Centro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-sap-${store.id}`}>Código SAP</Label>
                    <Input
                      id={`store-sap-${store.id}`}
                      value={store.sapCode}
                      onChange={(event) => handleStoreChange(index, 'sapCode', event.target.value)}
                      disabled={!isEditingStores}
                      placeholder="SAP-000123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-company-${store.id}`}>Razón social</Label>
                    <Input
                      id={`store-company-${store.id}`}
                      value={store.companyName}
                      onChange={(event) => handleStoreChange(index, 'companyName', event.target.value)}
                      disabled={!isEditingStores}
                      placeholder="Sociedad de la tienda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-tax-${store.id}`}>CIF/NIF</Label>
                    <Input
                      id={`store-tax-${store.id}`}
                      value={store.taxId}
                      onChange={(event) => handleStoreChange(index, 'taxId', event.target.value)}
                      disabled={!isEditingStores}
                      placeholder="B12345678"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`store-address-${store.id}`}>Dirección</Label>
                    <Input
                      id={`store-address-${store.id}`}
                      value={store.address}
                      onChange={(event) => handleStoreChange(index, 'address', event.target.value)}
                      disabled={!isEditingStores}
                      placeholder="Calle Mayor 123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-city-${store.id}`}>Ciudad</Label>
                    <Input
                      id={`store-city-${store.id}`}
                      value={store.city}
                      onChange={(event) => handleStoreChange(index, 'city', event.target.value)}
                      disabled={!isEditingStores}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-province-${store.id}`}>Provincia</Label>
                    <Input
                      id={`store-province-${store.id}`}
                      value={store.province}
                      onChange={(event) => handleStoreChange(index, 'province', event.target.value)}
                      disabled={!isEditingStores}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-postal-${store.id}`}>Código Postal</Label>
                    <Input
                      id={`store-postal-${store.id}`}
                      value={store.postalCode}
                      onChange={(event) => handleStoreChange(index, 'postalCode', event.target.value)}
                      disabled={!isEditingStores}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {isEditingStores && (
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleCloseStorePanel} disabled={isSavingStores}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveStores} disabled={isSavingStores}>
                <Save className="h-4 w-4 mr-2" />
                {isSavingStores ? 'Guardando...' : 'Guardar tiendas'}
              </Button>
            </div>
          )}

          {!isEditingStores && (
            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setIsStorePanelOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Aperturas y documentación asignada</h2>
        <p className="text-sm text-gray-600 mt-1">
          Consulta las tiendas/proyectos asignados por Carrefour y su documentación técnica.
        </p>
      </div>

      {projects.length > 0 && (
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar tienda, franquiciado o estado"
              className="pl-9"
              aria-label="Buscar tienda"
            />
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              No tienes tiendas asignadas
            </p>
            <p className="text-sm text-gray-400">
              Cuando se te asigne una tienda, aparecerá aquí
            </p>
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No se encontraron tiendas</p>
            <p className="text-sm text-gray-400">
              Prueba con otro nombre, franquiciado o estado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...filteredProjects]
            .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
            .map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/marketplace/openings/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.franchisee.name} - {project.franchisee.email}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Creado:{' '}
                      {new Date(project.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {project.planned_opening_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Apertura prevista:{' '}
                        {new Date(project.planned_opening_date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>{project.categories_count} categorías · {project.quotes_count} presupuestos</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/marketplace/openings/${project.id}`);
                    }}
                  >
                    Ver Detalles
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
