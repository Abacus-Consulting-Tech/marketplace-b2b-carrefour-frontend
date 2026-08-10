'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Bell, LogOut, Shield, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminSettingsPage() {
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
    systemAlerts: true,
    supplierApprovals: true,
    orderIssues: true,
    dailyReports: false,
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
      description: 'Tus preferencias han sido guardadas.',
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Administrador</h1>
        <p className="text-gray-600 mt-1">
          Gestiona la seguridad y preferencias del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones Administrativas
              </CardTitle>
              <CardDescription>
                Configura las alertas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas del Sistema</Label>
                  <p className="text-sm text-gray-500">
                    Notificaciones sobre errores críticos y problemas
                  </p>
                </div>
                <Checkbox
                  checked={notifications.systemAlerts}
                  onCheckedChange={() => handleNotificationToggle('systemAlerts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aprobaciones de Proveedores</Label>
                  <p className="text-sm text-gray-500">
                    Alertas cuando hay nuevas solicitudes pendientes
                  </p>
                </div>
                <Checkbox
                  checked={notifications.supplierApprovals}
                  onCheckedChange={() => handleNotificationToggle('supplierApprovals')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Problemas con Pedidos</Label>
                  <p className="text-sm text-gray-500">
                    Notificaciones de pedidos con incidencias
                  </p>
                </div>
                <Checkbox
                  checked={notifications.orderIssues}
                  onCheckedChange={() => handleNotificationToggle('orderIssues')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Informes Diarios</Label>
                  <p className="text-sm text-gray-500">
                    Resumen diario de actividad de la plataforma
                  </p>
                </div>
                <Checkbox
                  checked={notifications.dailyReports}
                  onCheckedChange={() => handleNotificationToggle('dailyReports')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-900">Modo API</span>
                <span className="text-sm font-medium text-amber-900">Mock (Desarrollo)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-900">Base de Datos</span>
                <span className="text-sm font-medium text-amber-900">LocalStorage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-900">Versión</span>
                <span className="text-sm font-medium text-amber-900">1.0.0 Beta</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
                <p className="text-sm text-gray-600">Rol</p>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <p className="font-medium text-sm text-red-600">Administrador</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
