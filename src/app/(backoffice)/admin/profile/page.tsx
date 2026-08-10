'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Save, Shield } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'admin-profile-data';

export default function AdminProfilePage() {
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
      phone: user?.phone || '+34 900 000 000',
      department: 'Administración Marketplace',
      role: 'Administrador del Sistema',
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
        <h1 className="text-3xl font-bold text-gray-900">Perfil de Administrador</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tu información de administrador
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Datos de acceso y contacto
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
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Rol en el Sistema
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled
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
              <CardTitle>Permisos de Administrador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nivel de Acceso</p>
                <p className="font-medium text-red-600">Acceso Total</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-green-600">Activo</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Último Acceso</p>
                <p className="font-medium">Hoy, {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/admin/settings" className="block text-sm text-blue-600 hover:underline">
                Configuración →
              </a>
              <a href="/admin/dashboard" className="block text-sm text-blue-600 hover:underline">
                Dashboard →
              </a>
              <a href="/admin/suppliers" className="block text-sm text-blue-600 hover:underline">
                Proveedores →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
