"use client";

/**
 * Layout para Portal del Franquiciado
 */

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FranchiseeSidebar } from "@/components/navigation/FranchiseeSidebar";

export default function FranchiseeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["franchisee", "admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex">
          <FranchiseeSidebar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
