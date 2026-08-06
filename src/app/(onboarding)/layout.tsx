"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}
