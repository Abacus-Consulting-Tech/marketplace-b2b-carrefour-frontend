"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, LogOut, User } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">Carrefour</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">B2B</span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              {user?.role === "franchisee" && (
                <>
                  <Link href="/marketplace/dashboard" className="text-sm font-medium hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/marketplace" className="text-sm font-medium hover:text-blue-600">
                    Catálogo
                  </Link>
                  <Link href="/marketplace/orders" className="text-sm font-medium hover:text-blue-600">
                    Mis Pedidos
                  </Link>
                </>
              )}
              
              {user?.role === "supplier" && (
                <>
                  <Link href="/supplier/dashboard" className="text-sm font-medium hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/supplier/products" className="text-sm font-medium hover:text-blue-600">
                    Mis Productos
                  </Link>
                  <Link href="/supplier/orders" className="text-sm font-medium hover:text-blue-600">
                    Pedidos
                  </Link>
                </>
              )}
              
              {user?.role === "admin" && (
                <>
                  <Link href="/admin/suppliers" className="text-sm font-medium hover:text-blue-600">
                    Proveedores
                  </Link>
                  <Link href="/admin/franchisees" className="text-sm font-medium hover:text-blue-600">
                    Franquiciados
                  </Link>
                  <Link href="/admin/products" className="text-sm font-medium hover:text-blue-600">
                    Productos
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart (only for franchisees) */}
                {user?.role === "franchisee" && (
                  <Link href="/marketplace/cart">
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}

                {/* User menu */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 border rounded-md">
                    <Link 
                      href={
                        user?.role === 'franchisee' ? '/marketplace/profile' :
                        user?.role === 'supplier' ? '/supplier/profile' :
                        '/admin/profile'
                      }
                    >
                      <Button variant="ghost" size="icon" title="Mi Perfil">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </Link>
                    <Link 
                      href={
                        user?.role === 'franchisee' ? '/marketplace/settings' :
                        user?.role === 'supplier' ? '/supplier/settings' :
                        '/admin/settings'
                      }
                    >
                      <Button variant="ghost" size="icon" title="Configuración">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar Sesión">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
