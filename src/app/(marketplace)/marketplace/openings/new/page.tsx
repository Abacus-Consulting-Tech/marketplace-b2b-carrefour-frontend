'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Calendar, Loader2, Store } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { openingsApi } from '@/lib/api/openings-client';
import { franchiseeStoresApi } from '@/lib/api/franchisee-stores-client';
import type { FranchiseeStore } from '@/types/franchisees';
import type { CreateProjectRequest } from '@/types/openings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type OpeningFormState = {
  name: string;
  plannedOpeningDate: string;
  selectedStoreId: string;
  storeName: string;
  sapCode: string;
  companyName: string;
  taxId: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

const NEW_STORE_ID = '__new_store__';

function emptyFormState(): OpeningFormState {
  return {
    name: '',
    plannedOpeningDate: '',
    selectedStoreId: NEW_STORE_ID,
    storeName: '',
    sapCode: '',
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  };
}

function toFormState(store: FranchiseeStore): OpeningFormState {
  return {
    name: '',
    plannedOpeningDate: '',
    selectedStoreId: store.id,
    storeName: store.name,
    sapCode: store.sapCode || '',
    companyName: store.companyName || '',
    taxId: store.taxId || '',
    address: store.address,
    city: store.city,
    province: store.province || '',
    postalCode: store.postalCode || '',
  };
}

export default function MarketplaceNewOpeningPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stores, setStores] = useState<FranchiseeStore[]>([]);
  const [form, setForm] = useState<OpeningFormState>(emptyFormState);
  const [loadingStores, setLoadingStores] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStores() {
      if (!user?.id) {
        if (isMounted) {
          setStores([]);
          setLoadingStores(false);
        }
        return;
      }

      const response = await franchiseeStoresApi.listStores(user.id);
      if (!isMounted) return;

      setStores(response.stores);
      if (response.stores.length > 0) {
        setForm((current) => ({
          ...toFormState(response.stores[0]),
          name: current.name,
          plannedOpeningDate: current.plannedOpeningDate,
        }));
      }
      setLoadingStores(false);
    }

    loadStores();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  function handleInputChange(field: keyof OpeningFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleStoreSelection(value: string) {
    if (value === NEW_STORE_ID) {
      setForm((current) => ({
        ...emptyFormState(),
        name: current.name,
        plannedOpeningDate: current.plannedOpeningDate,
        selectedStoreId: NEW_STORE_ID,
      }));
      return;
    }

    const selectedStore = stores.find((store) => store.id === value);
    if (!selectedStore) return;

    setForm((current) => ({
      ...toFormState(selectedStore),
      name: current.name,
      plannedOpeningDate: current.plannedOpeningDate,
    }));
  }

  async function persistStore(): Promise<FranchiseeStore> {
    if (!user?.id) {
      throw new Error('No hay un franquiciado autenticado.');
    }

    const storePayload = {
      name: form.storeName.trim(),
      sapCode: form.sapCode.trim() || undefined,
      companyName: form.companyName.trim() || undefined,
      taxId: form.taxId.trim() || undefined,
      address: form.address.trim(),
      city: form.city.trim(),
      province: form.province.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
    };

    if (form.selectedStoreId === NEW_STORE_ID) {
      const response = await franchiseeStoresApi.createStore(user.id, storePayload);
      setStores((current) => [...current, response.store]);
      return response.store;
    }

    const updatedStores = stores.map((store) =>
      store.id === form.selectedStoreId
        ? {
            ...store,
            ...storePayload,
          }
        : store
    );
    await franchiseeStoresApi.replaceStores(user.id, updatedStores);
    setStores(updatedStores);

    const existingStore = updatedStores.find((store) => store.id === form.selectedStoreId);
    if (!existingStore) {
      throw new Error('No se pudo actualizar la tienda seleccionada.');
    }

    return existingStore;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.id) {
      setError('Debes iniciar sesión como franquiciado para crear una apertura.');
      return;
    }

    if (!form.storeName.trim() || !form.address.trim() || !form.city.trim() || !form.province.trim()) {
      setError('Completa los datos mínimos de la tienda antes de continuar.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const store = await persistStore();
      const request: CreateProjectRequest = {
        franchisee_id: user.id,
        store_sap_code: store.sapCode,
        name: form.name.trim() || `Nueva apertura - ${store.name}`,
        address: {
          street: store.address,
          city: store.city,
          postal_code: store.postalCode || '',
          province: store.province || '',
          country: 'ES',
        },
        fiscal_data: {
          company_name: store.companyName || store.name,
          tax_id: store.taxId || 'PENDING',
          contact_name: user.name,
          contact_email: user.email,
          contact_phone: user.phone,
        },
      };

      if (form.plannedOpeningDate) {
        request.planned_opening_date = new Date(form.plannedOpeningDate);
      }

      const response = await openingsApi.createProject(request);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'No se pudo crear la apertura.');
      }

      router.push('/marketplace/openings');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo crear la apertura.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  if (loadingStores) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando datos de tienda...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/marketplace/openings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a mis aperturas
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Nueva apertura</h1>
        </div>
        <p className="text-muted-foreground">
          Completa los datos de la tienda y genera una nueva apertura en estado borrador.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Tienda asociada
            </CardTitle>
            <CardDescription>
              Usa una tienda existente o completa los datos para crear una nueva antes de abrir el proyecto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectedStore">Tienda</Label>
              <select
                id="selectedStore"
                value={form.selectedStoreId}
                onChange={(event) => handleStoreSelection(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {stores.length > 0 && stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} {store.sapCode ? `· ${store.sapCode}` : ''}
                  </option>
                ))}
                <option value={NEW_STORE_ID}>Crear nueva tienda</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nombre de la tienda</Label>
                <Input id="storeName" value={form.storeName} onChange={(event) => handleInputChange('storeName', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sapCode">Código SAP</Label>
                <Input id="sapCode" value={form.sapCode} onChange={(event) => handleInputChange('sapCode', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Razón social</Label>
                <Input id="companyName" value={form.companyName} onChange={(event) => handleInputChange('companyName', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">CIF/NIF</Label>
                <Input id="taxId" value={form.taxId} onChange={(event) => handleInputChange('taxId', event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={form.address} onChange={(event) => handleInputChange('address', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" value={form.city} onChange={(event) => handleInputChange('city', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input id="province" value={form.province} onChange={(event) => handleInputChange('province', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código postal</Label>
                <Input id="postalCode" value={form.postalCode} onChange={(event) => handleInputChange('postalCode', event.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Datos de la apertura
            </CardTitle>
            <CardDescription>
              Al guardar, la apertura aparecerá en tu listado con estado inicial de borrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openingName">Nombre de la apertura</Label>
              <Input
                id="openingName"
                value={form.name}
                onChange={(event) => handleInputChange('name', event.target.value)}
                placeholder="Nueva apertura - Calle Mayor 123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedOpeningDate">Fecha prevista de apertura</Label>
              <Input
                id="plannedOpeningDate"
                type="date"
                value={form.plannedOpeningDate}
                onChange={(event) => handleInputChange('plannedOpeningDate', event.target.value)}
              />
            </div>
            <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              La nueva apertura se crea como borrador para que puedas revisarla antes de completar documentación y presupuestos.
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/marketplace/openings">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando apertura...' : 'Crear apertura'}
          </Button>
        </div>
      </form>
    </div>
  );
}