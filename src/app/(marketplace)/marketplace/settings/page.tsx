'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Bell, Mail, Eye, EyeOff, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    productAlerts: true,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido cambiada correctamente.',
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });

    toast({
      title: 'Preferencia actualizada',
      description: 'Tus preferencias de notificación han sido guardadas.',
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Cambia tu contraseña y gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Cambiar Contraseña
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="showPasswords"
                      checked={showPasswords}
                      onCheckedChange={(checked) => setShowPasswords(checked as boolean)}
                    />
                    <Label htmlFor="showPasswords" className="text-sm cursor-pointer">
                      Mostrar contraseñas
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handlePasswordSave}>
                      Guardar Contraseña
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Actualizaciones de Pedidos</Label>
                  <p className="text-sm text-gray-500">
                    Recibe notificaciones sobre el estado de tus pedidos
                  </p>
                </div>
                <Checkbox
                  checked={notifications.orderUpdates}
                  onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Promociones y Ofertas</Label>
                  <p className="text-sm text-gray-500">
                    Recibe ofertas especiales y descuentos
                  </p>
                </div>
                <Checkbox
                  checked={notifications.promotions}
                  onCheckedChange={() => handleNotificationToggle('promotions')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Boletín Informativo</Label>
                  <p className="text-sm text-gray-500">
                    Recibe nuestro boletín mensual
                  </p>
                </div>
                <Checkbox
                  checked={notifications.newsletter}
                  onCheckedChange={() => handleNotificationToggle('newsletter')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Productos</Label>
                  <p className="text-sm text-gray-500">
                    Notificaciones cuando productos vuelvan a estar disponibles
                  </p>
                </div>
                <Checkbox
                  checked={notifications.productAlerts}
                  onCheckedChange={() => handleNotificationToggle('productAlerts')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Preferencias de Email
              </CardTitle>
              <CardDescription>
                Gestiona la frecuencia de emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="emailFrequency">Frecuencia de Emails</Label>
                <select
                  id="emailFrequency"
                  className="w-full p-2 border rounded-md"
                  defaultValue="immediate"
                >
                  <option value="immediate">Inmediatamente</option>
                  <option value="daily">Resumen diario</option>
                  <option value="weekly">Resumen semanal</option>
                  <option value="never">Nunca</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-red-800 mb-3">
                  Cerrar sesión de tu cuenta
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Cuenta</p>
                <p className="font-medium text-sm capitalize">
                  {user?.role === 'franchisee' ? 'Franquiciado' : user?.role}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
