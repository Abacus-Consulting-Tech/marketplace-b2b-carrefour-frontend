"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/lib/api/client";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "franchisee" as "franchisee" | "supplier",
    company: "",
    phone: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Check if mock mode is enabled
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
      
      if (isMockMode) {
        // Use mock API
        const { mockApi } = await import("@/lib/api/mock");
        await mockApi.auth.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.company,
          phone: formData.phone,
        });
      } else {
        // Use real API
        await apiClient.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.company,
          phone: formData.phone,
        });
      }
      
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Regístrate como franquiciado o proveedor
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
            <Label>Tipo de cuenta</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as "franchisee" | "supplier" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="franchisee" id="franchisee" />
                <Label htmlFor="franchisee" className="font-normal cursor-pointer">
                  Franquiciado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplier" id="supplier" />
                <Label htmlFor="supplier" className="font-normal cursor-pointer">
                  Proveedor
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
