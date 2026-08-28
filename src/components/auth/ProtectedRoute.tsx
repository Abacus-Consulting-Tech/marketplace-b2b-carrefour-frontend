"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "franchisee" | "supplier";
  allowedRoles?: ("admin" | "franchisee" | "supplier")[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (user.role === "supplier") {
      router.replace("/supplier/dashboard");
    } else {
      router.replace("/marketplace");
    }
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (user.role === "supplier") {
      router.replace("/supplier/dashboard");
    } else {
      router.replace("/marketplace");
    }
    return null;
  }

  return <>{children}</>;
}
