"use client";

import { useAuthStore } from "@/lib/store/auth";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "franchisee" | "supplier")[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
