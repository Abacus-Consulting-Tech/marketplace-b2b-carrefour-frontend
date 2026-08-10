'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building2, Phone, MapPin, Save, Package } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'supplier-profile-data';

export default function SupplierProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getInitialData = () => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    // Default values
    return {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+34 600 000 000',
      company: user?.companyName || 'Productos Gourmet S.L.',
      businessName: 'Productos Gourmet Sociedad Limitada',
      cif: 'B12345678',
      address: 'Polígono Industrial Norte, Nave 5',
      city: 'Valencia',
      postalCode: '46000',
    };
  };

  const [formData, setFormData] = useState(getInitialData());

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = getInitialData();
    setFormData(savedData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
    
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil de Proveedor</h1>
        <p className="text-gray-600 mt-1">
          Gestiona la información de tu empresa y datos de contacto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información de la Empresa</CardTitle>
                  <CardDescription>
                    Datos de tu empresa y contacto comercial
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
                  <Label htmlFor="company">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Nombre Comercial
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
                  <Label htmlFor="cif">CIF / NIF</Label>
                  <Input
                    id="cif"
                    name="cif"
                    value={formData.cif}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessName">Razón Social</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    Persona de Contacto
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tipo de Cuenta</p>
                <p className="font-medium">Proveedor</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-green-600">Aprobada</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Productos</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <p className="font-medium">8 productos activos</p>
                </div>
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
              <a href="/supplier/settings" className="block text-sm text-blue-600 hover:underline">
                Configuración →
              </a>
              <a href="/supplier/dashboard" className="block text-sm text-blue-600 hover:underline">
                Dashboard →
              </a>
              <a href="/supplier/products" className="block text-sm text-blue-600 hover:underline">
                Mis Productos →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
