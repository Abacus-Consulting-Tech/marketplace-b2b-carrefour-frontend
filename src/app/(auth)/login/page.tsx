"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/store/auth";
import { apiClient } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMockInfo, setShowMockInfo] = useState(false);

  // Use mock API if NEXT_PUBLIC_MOCK_AUTH is true OR if no API URL is configured
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use mock API if NEXT_PUBLIC_MOCK_AUTH is true OR if no API URL is configured
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_API_URL;
      
      let response;
      if (isMockMode) {
        // Use mock API
        const { mockApi } = await import("@/lib/api/mock");
        response = await mockApi.auth.login(email, password);
      } else {
        // Use real API
        response = await apiClient.post("/auth/login", { email, password });
      }
      
      const { token, user } = response.data;
      
      login(user, token);
      
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "supplier") {
        router.push("/supplier/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        {isMockMode && (
          <Alert className="mt-4">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-sm">🧪 Modo de prueba activado</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMockInfo(!showMockInfo)}
                  type="button"
                >
                  {showMockInfo ? "Ocultar" : "Ver credenciales"}
                </Button>
              </div>
              {showMockInfo && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <strong>Admin:</strong> admin@test.com / admin123
                  </div>
                  <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <strong>Franchisee:</strong> franchisee@test.com / franchisee123
                  </div>
                  <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <strong>Supplier:</strong> supplier@test.com / supplier123
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Accede a tu cuenta de franquiciado o proveedor
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
