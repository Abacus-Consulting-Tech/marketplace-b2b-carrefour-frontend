"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Upload,
  ShoppingBag,
  User,
  FileText,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isHighlight?: boolean;
}

function NavItem({ href, icon, label, isActive, isHighlight }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
          : isHighlight
          ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="pt-4 first:pt-0">
      <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function SupplierSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/supplier/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <NavItem
          href="/supplier/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={isActive("/supplier/dashboard")}
        />

        {/* Productos */}
        <NavSection title="Productos">
          <NavItem
            href="/supplier/products"
            icon={<Package className="h-5 w-5" />}
            label="Mis Productos"
            isActive={isActive("/supplier/products") && !pathname.includes("/bulk-upload")}
          />
          <NavItem
            href="/supplier/products/bulk-upload"
            icon={<Upload className="h-5 w-5" />}
            label="Carga Masiva"
            isActive={pathname.includes("/bulk-upload")}
            isHighlight={true}
          />
        </NavSection>

        {/* Gestión */}
        <NavSection title="Gestión">
          <NavItem
            href="/supplier/openings"
            icon={<FileText className="h-5 w-5" />}
            label="Invitaciones"
            isActive={isActive("/supplier/openings")}
          />
          <NavItem
            href="/supplier/orders"
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Pedidos"
            isActive={isActive("/supplier/orders")}
          />
          <NavItem
            href="/supplier/profile"
            icon={<User className="h-5 w-5" />}
            label="Mi Perfil"
            isActive={isActive("/supplier/profile")}
          />
        </NavSection>
      </nav>
    </aside>
  );
}
