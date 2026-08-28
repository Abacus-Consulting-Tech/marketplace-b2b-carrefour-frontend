'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building2, Phone, MapPin, Save } from 'lucide-react';

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

  const getInitialData = (): ProfileData => {
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
              <a href="/marketplace/settings" className="block text-sm text-blue-600 hover:underline">
                Configuración →
              </a>
              <a href="/marketplace/orders" className="block text-sm text-blue-600 hover:underline">
                Mis Pedidos →
              </a>
              <a href="/marketplace/openings" className="block text-sm text-blue-600 hover:underline">
                Mis tiendas →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
