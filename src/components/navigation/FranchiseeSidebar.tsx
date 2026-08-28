"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  ClipboardList,
  Truck,
  User,
  BarChart3,
  Building2,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
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

export function FranchiseeSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Special case for catalog - only exact match
    if (path === "/marketplace") {
      return pathname === "/marketplace";
    }
    // Dashboard - exact match
    if (path === "/marketplace/dashboard") {
      return pathname === path;
    }
    // For tracking, check if pathname contains it
    if (path.includes("/tracking")) {
      return pathname.includes("/tracking");
    }
    // For orders (without tracking), check it starts with /marketplace/orders but not tracking
    if (path === "/marketplace/orders") {
      return pathname.startsWith("/marketplace/orders") && !pathname.includes("/tracking");
    }
    // Default: check if pathname starts with the path
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-2">
        {/* Inicio */}
        <NavItem
          href="/marketplace/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Inicio"
          isActive={isActive("/marketplace/dashboard")}
        />

        {/* Tiendas */}
        <NavSection title="Tiendas">
          <NavItem
            href="/marketplace/openings"
            icon={<Building2 className="h-5 w-5" />}
            label="Mis tiendas"
            isActive={isActive("/marketplace/openings")}
          />
        </NavSection>

        {/* Compras */}
        <NavSection title="Compras">
          <NavItem
            href="/marketplace"
            icon={<Package className="h-5 w-5" />}
            label="Catálogo"
            isActive={isActive("/marketplace")}
          />
          <NavItem
            href="/marketplace/cart"
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Mi Carrito"
            isActive={isActive("/marketplace/cart")}
          />
          <NavItem
            href="/marketplace/quotes"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Presupuestos"
            isActive={isActive("/marketplace/quotes")}
          />
        </NavSection>

        {/* Mis Pedidos */}
        <NavSection title="Mis Pedidos">
          <NavItem
            href="/marketplace/orders"
            icon={<ClipboardList className="h-5 w-5" />}
            label="Historial"
            isActive={isActive("/marketplace/orders")}
          />
          <NavItem
            href="/marketplace/orders/tracking"
            icon={<Truck className="h-5 w-5" />}
            label="Seguimiento"
            isActive={isActive("/marketplace/orders/tracking")}
          />
        </NavSection>

        {/* Mi Cuenta */}
        <NavSection title="Mi Cuenta">
          <NavItem
            href="/marketplace/profile"
            icon={<User className="h-5 w-5" />}
            label="Mi Perfil"
            isActive={isActive("/marketplace/profile")}
          />
          <NavItem
            href="/marketplace/stats"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Estadísticas"
            isActive={isActive("/marketplace/stats")}
          />
        </NavSection>
      </nav>
    </aside>
  );
}

