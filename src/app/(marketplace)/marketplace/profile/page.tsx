'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building2, Phone, MapPin, Save, Store, Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import { franchiseeStoresApi } from '@/lib/api/franchisee-stores-client';
import { franchiseeInvoicesApi } from '@/lib/api/franchisee-invoices-client';
import type { FranchiseeInvoice, FranchiseeStore } from '@/types/franchisees';

const PROFILE_STORAGE_KEY = 'franchisee-profile-data';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  taxId: string;
  fiscalAddress: string;
  fiscalCity: string;
  fiscalProvince: string;
  fiscalPostalCode: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const quickLinks = {
    settings:
      user?.role === 'supplier' ? '/supplier/settings' :
      user?.role === 'admin' ? '/admin/settings' :
      '/marketplace/settings',
    orders:
      user?.role === 'supplier' ? '/supplier/orders' :
      user?.role === 'admin' ? '/admin/orders' :
      '/marketplace/orders',
    stores:
      user?.role === 'franchisee' ? '/franchisee/openings' :
      '/marketplace/openings',
  };

  const getInitialData = useCallback((): ProfileData => {
    const defaultData: ProfileData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+34 600 000 000',
      company: '',
      taxId: '',
      fiscalAddress: '',
      fiscalCity: '',
      fiscalProvince: '',
      fiscalPostalCode: '',
    };

    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
          ...defaultData,
          ...parsedData,
        };
      }
    }
    
    return defaultData;
  }, [user?.email, user?.name, user?.phone]);

  const [formData, setFormData] = useState(getInitialData());

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = getInitialData();
    setFormData(savedData);
  }, [getInitialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsedData = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...parsedData, ...formData }));
    
    toast({
      title: 'Perfil actualizado',
      description: 'Tus datos han sido guardados correctamente.',
    });
    
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to saved values from localStorage
    setFormData(getInitialData());
    setIsEditing(false);
  };

  // ==========================================================================
  // Stores (a franchisee can own several physical stores)
  // ==========================================================================
  const [stores, setStores] = useState<FranchiseeStore[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showAddStore, setShowAddStore] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', taxId: '', address: '', city: '', postalCode: '' });
  const [invoices, setInvoices] = useState<FranchiseeInvoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    franchiseeStoresApi.listStores(user.id).then((response) => {
      setStores(response.stores);
      setLoadingStores(false);
    });

    franchiseeInvoicesApi.listInvoices(user.id).then((response) => {
      setInvoices(response.invoices);
      setLoadingInvoices(false);
    });
  }, [user?.id]);

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleAddStore = async () => {
    if (!user?.id || !newStore.name.trim() || !newStore.address.trim() || !newStore.city.trim()) {
      toast({
        title: 'Faltan datos',
        description: 'Nombre, dirección y ciudad son obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    setSavingStore(true);
    const response = await franchiseeStoresApi.createStore(user.id, newStore);
    setStores((prev) => [...prev, response.store]);
    setNewStore({ name: '', taxId: '', address: '', city: '', postalCode: '' });
    setShowAddStore(false);
    setSavingStore(false);

    toast({ title: 'Tienda añadida', description: `${response.store.name} se ha añadido a tu perfil.` });
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!user?.id) return;

    await franchiseeStoresApi.deleteStore(user.id, storeId);
    setStores((prev) => prev.filter((s) => s.id !== storeId));
    toast({ title: 'Tienda eliminada' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tus datos de contacto y fiscales de la sociedad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Datos del franquiciado</CardTitle>
                  <CardDescription>
                    Actualiza los datos de contacto y fiscales de la sociedad
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Razón social
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">CIF/NIF</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="B12345678"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fiscalAddress">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Dirección fiscal
                  </Label>
                  <Input
                    id="fiscalAddress"
                    name="fiscalAddress"
                    value={formData.fiscalAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalCity">Ciudad</Label>
                  <Input
                    id="fiscalCity"
                    name="fiscalCity"
                    value={formData.fiscalCity}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalProvince">Provincia</Label>
                  <Input
                    id="fiscalProvince"
                    name="fiscalProvince"
                    value={formData.fiscalProvince}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalPostalCode">Código Postal</Label>
                  <Input
                    id="fiscalPostalCode"
                    name="fiscalPostalCode"
                    value={formData.fiscalPostalCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stores Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mis Tiendas</CardTitle>
                  <CardDescription>
                    Un franquiciado puede tener varias tiendas. Añade los datos básicos de cada una.
                  </CardDescription>
                </div>
                {!showAddStore && (
                  <Button variant="outline" onClick={() => setShowAddStore(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Tienda
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddStore && (
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Nombre de la Tienda *</Label>
                      <Input
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        placeholder="Tienda Centro"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>CIF/NIF de la tienda</Label>
                      <Input
                        value={newStore.taxId}
                        onChange={(e) => setNewStore({ ...newStore, taxId: e.target.value })}
                        placeholder="B12345678"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label>Dirección *</Label>
                      <Input
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                        placeholder="Gran Vía 1"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Ciudad *</Label>
                      <Input
                        value={newStore.city}
                        onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                        placeholder="Madrid"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Código Postal</Label>
                      <Input
                        value={newStore.postalCode}
                        onChange={(e) => setNewStore({ ...newStore, postalCode: e.target.value })}
                        placeholder="28013"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddStore} disabled={savingStore}>
                      {savingStore ? 'Guardando...' : 'Guardar Tienda'}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={savingStore}
                      onClick={() => {
                        setShowAddStore(false);
                        setNewStore({ name: '', taxId: '', address: '', city: '', postalCode: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {loadingStores ? (
                <p className="text-sm text-muted-foreground">Cargando tiendas...</p>
              ) : stores.length === 0 ? (
                <p className="text-sm text-muted-foreground">Todavía no has añadido ninguna tienda.</p>
              ) : (
                <div className="space-y-3">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Store className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {store.address}, {store.city}
                            {store.postalCode ? ` (${store.postalCode})` : ''}
                          </p>
                          {store.taxId && (
                            <p className="text-xs text-muted-foreground">CIF/NIF: {store.taxId}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStore(store.id)}
                        aria-label={`Eliminar ${store.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mis Facturas</CardTitle>
                  <CardDescription>
                    Histórico de cuotas y facturas emitidas para tu sociedad.
                  </CardDescription>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingInvoices ? (
                <p className="text-sm text-muted-foreground">Cargando facturas...</p>
              ) : invoices.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Todavía no hay facturas disponibles. Cuando backend exponga el endpoint de lectura,
                  aparecerán aquí automáticamente.
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.issueDate)} · {formatCurrency(invoice.amount, invoice.currencyCode)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Estado: <span className="font-medium">{invoice.status}</span>
                        </p>
                      </div>
                      {invoice.pdfUrl ? (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:underline"
                        >
                          Ver PDF
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Account Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tipo de Cuenta</p>
                <p className="font-medium capitalize">{user?.role === 'franchisee' ? 'Franquiciado' : user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-green-600">Activa</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Miembro desde</p>
                <p className="font-medium">Enero 2026</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enlaces Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={quickLinks.settings} className="block text-sm text-blue-600 hover:underline">
                Configuración →
              </Link>
              <Link href={quickLinks.orders} className="block text-sm text-blue-600 hover:underline">
                Mis Pedidos →
              </Link>
              <Link href={quickLinks.stores} className="block text-sm text-blue-600 hover:underline">
                Mis tiendas →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
