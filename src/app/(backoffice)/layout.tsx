"use client";

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)] p-4">
            <nav className="space-y-2">
              <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Dashboard
              </a>
              <a href="/admin/suppliers" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Proveedores
              </a>
              <a href="/admin/franchisees" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Franquiciados
              </a>
              <a href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Productos
              </a>
              <a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Pedidos
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
