"use client";

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)] p-4">
            <nav className="space-y-2">
              <a href="/supplier/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Dashboard
              </a>
              <a href="/supplier/products" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Mis Productos
              </a>
              <a href="/supplier/orders" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Pedidos
              </a>
              <a href="/supplier/profile" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Mi Perfil
              </a>
            </nav>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
