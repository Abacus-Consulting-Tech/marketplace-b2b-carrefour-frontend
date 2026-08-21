"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "franchisee" | "supplier";
  allowedRoles?: ("admin" | "franchisee" | "supplier")[];
}

function redirectToRoleDashboard(role: string | undefined, router: ReturnType<typeof useRouter>) {
  if (role === "admin") {
    router.replace("/admin/dashboard");
  } else if (role === "supplier") {
    router.replace("/supplier/dashboard");
  } else {
    router.replace("/marketplace/dashboard");
  }
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect if hydration is complete and user is not authenticated
    if (_hasHydrated && !isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated after hydration, redirecting to login');
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated after hydration, show nothing (redirect is in progress)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    console.log('[ProtectedRoute] Role mismatch. Required:', requiredRole, 'Got:', user.role);
    redirectToRoleDashboard(user.role, router);
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('[ProtectedRoute] Role not allowed. Allowed:', allowedRoles, 'Got:', user.role);
    redirectToRoleDashboard(user.role, router);
    return null;
  }

  // User is authenticated and authorized - render content
  console.log('[ProtectedRoute] ✅ Rendering protected content for', user.email, 'role:', user.role);
  return <>{children}</>;
}
