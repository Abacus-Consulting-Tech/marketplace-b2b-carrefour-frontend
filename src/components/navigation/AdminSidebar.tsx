"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Store,
  Package,
  ShoppingBag,
  CheckCircle,
  DollarSign,
  Wrench,
  MapPin,
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
          ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
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

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <NavItem
          href="/admin/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={isActive("/admin/dashboard")}
        />

        {/* Gestión */}
        <NavSection title="Gestión">
          <NavItem
            href="/admin/openings"
            icon={<MapPin className="h-5 w-5" />}
            label="Nuevas Aperturas"
            isActive={isActive("/admin/openings")}
          />
          <NavItem
            href="/admin/suppliers"
            icon={<Building2 className="h-5 w-5" />}
            label="Proveedores"
            isActive={isActive("/admin/suppliers")}
          />
          <NavItem
            href="/admin/franchisees"
            icon={<Store className="h-5 w-5" />}
            label="Franquiciados"
            isActive={isActive("/admin/franchisees")}
          />
          <NavItem
            href="/admin/products"
            icon={<Package className="h-5 w-5" />}
            label="Productos"
            isActive={isActive("/admin/products")}
          />
          <NavItem
            href="/admin/orders"
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Pedidos"
            isActive={isActive("/admin/orders")}
          />
        </NavSection>

        {/* Tarificación */}
        <NavSection title="Tarificación">
          <NavItem
            href="/admin/pricing/approval-queue"
            icon={<CheckCircle className="h-5 w-5" />}
            label="Cola de Aprobación"
            isActive={isActive("/admin/pricing/approval-queue")}
          />
          <NavItem
            href="/admin/pricing/markup"
            icon={<DollarSign className="h-5 w-5" />}
            label="Markup Global"
            isActive={isActive("/admin/pricing/markup")}
          />
        </NavSection>

        {/* Development Tools */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <NavItem
            href="/admin/dev-tools"
            icon={<Wrench className="h-5 w-5" />}
            label="Dev Tools"
            isActive={isActive("/admin/dev-tools")}
            isHighlight={true}
          />
        </div>
      </nav>
    </aside>
  );
}
