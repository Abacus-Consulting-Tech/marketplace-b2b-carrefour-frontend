"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "franchisee" | "supplier";
  allowedRoles?: ("admin" | "franchisee" | "supplier")[];
}

function getRoleRedirectPath(role: ProtectedRouteProps["requiredRole"]) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "supplier") {
    return "/supplier/dashboard";
  }

  return "/marketplace";
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const hasRoleMismatch = Boolean(user && requiredRole && user.role !== requiredRole);
  const hasDisallowedRole = Boolean(user && allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role));

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !user) {
      return;
    }

    if (hasRoleMismatch || hasDisallowedRole) {
      router.replace(getRoleRedirectPath(user.role));
    }
  }, [_hasHydrated, hasDisallowedRole, hasRoleMismatch, isAuthenticated, router, user]);

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

  if (hasRoleMismatch || hasDisallowedRole) {
    return null;
  }

  return <>{children}</>;
}
