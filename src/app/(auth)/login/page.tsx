"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/store/auth";
import { apiClient } from "@/lib/api/client";
import { mockApi } from "@/lib/api/mock";
import { featureFlags } from "@/config/feature-flags";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, _hasHydrated, setHasHydrated } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMockInfo, setShowMockInfo] = useState(false);

  // Use feature flags to determine mock mode
  const isMockMode = featureFlags.shouldUseMock('auth');

  // Fallback: Force hydration after 2 seconds if not hydrated
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!_hasHydrated) {
        console.log('[Login] Hydration timeout - forcing hydration to true');
        setHasHydrated(true);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [_hasHydrated, setHasHydrated]);

  // NOTE: Removed automatic redirect on mount to prevent infinite loops
  // If user is already authenticated, ProtectedRoute will handle redirects
  // Only redirect happens after successful login form submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('[Login] Form submitted, attempting login...');

    try {
      let user, token;
      if (isMockMode) {
        // Use mock API
        const response = await mockApi.auth.login(email, password);
        user = response.data.user;
        token = response.data.token;
      } else {
        // Use Next.js API proxy to avoid CORS issues
        console.log('[Login] Calling /api/auth/login...');
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('[Login] API error:', error);
          throw new Error(error.message || 'Authentication failed');
        }

        const data = await response.json();
        user = data.user;
        token = data.token;
      }
      
      console.log('[Login] User logged in:', user.email, 'Role:', user.role);
      console.log('[Login] Token received:', token ? 'yes' : 'no');
      
      // Save to store
      login(user, token);
      
      console.log('[Login] Store updated, waiting for persistence...');
      
      // Wait longer for Zustand to persist the state to localStorage
      // This prevents the double-login issue
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('[Login] State persisted, navigating to dashboard...');
      
      // Use router.push instead of window.location.href
      // The ProtectedRoute will handle the authentication check
      if (user.role === "admin") {
        console.log('[Login] Redirecting to /admin/dashboard');
        router.push("/admin/dashboard");
      } else if (user.role === "supplier") {
        console.log('[Login] Redirecting to /supplier/dashboard');
        router.push("/supplier/dashboard");
      } else if (user.role === "franchisee") {
        console.log('[Login] Redirecting to /marketplace');
        router.push("/marketplace");
      } else {
        console.log('[Login] Redirecting to /marketplace');
        router.push("/marketplace");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-sm text-gray-600">Cargando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Accede a tu cuenta de franquiciado o proveedor
        </CardDescription>
        
        {/* Mock credentials helper */}
        {isMockMode && (
          <Alert className="mt-4">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  🧪 Modo Mock
                </span>
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
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {isMockMode ? "Iniciando sesión..." : "Conectando con backend..."}
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
          
          {/* Backend loading warning */}
          {loading && !isMockMode && (
            <Alert className="text-xs">
              <AlertDescription>
                El backend en Render puede tardar hasta 30s en despertar si estaba inactivo.
                Para desarrollo rápido, considera activar NEXT_PUBLIC_MOCK_AUTH=true en .env.local
              </AlertDescription>
            </Alert>
          )}
          
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
