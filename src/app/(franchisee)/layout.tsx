"use client";

/**
 * Layout para Portal del Franquiciado
 */

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function FranchiseeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["franchisee", "admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
