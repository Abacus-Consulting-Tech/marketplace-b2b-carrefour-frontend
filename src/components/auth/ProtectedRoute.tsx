"use client";

import { useEffect, useState } from "react";
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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    if (!_hasHydrated) {
      return;
    }

    setIsChecking(false);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user has required role (single role check)
    if (requiredRole && user?.role !== requiredRole) {
      redirectToRoleDashboard(user?.role, router);
      return;
    }

    // Check if user has one of the allowed roles (multiple roles check)
    if (allowedRoles && allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
      redirectToRoleDashboard(user.role, router);
      return;
    }
  }, [isAuthenticated, user, requiredRole, allowedRoles, router, _hasHydrated]);

  // Show loading state while hydrating
  if (!_hasHydrated || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check single required role
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Check allowed roles array
  if (allowedRoles && allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

function redirectToRoleDashboard(role: string | undefined, router: ReturnType<typeof useRouter>) {
  if (role === "admin") {
    router.push("/admin/dashboard");
  } else if (role === "supplier") {
    router.push("/supplier/dashboard");
  } else {
    router.push("/marketplace");
  }
}
