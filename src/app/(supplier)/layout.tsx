"use client";

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SupplierSidebar } from "@/components/navigation/SupplierSidebar";
import { usePathname } from "next/navigation";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/supplier/register") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex">
          <SupplierSidebar />
          
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
