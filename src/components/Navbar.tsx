"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/orders", label: "Mis pedidos" },
  { href: "/invoices", label: "Facturas" },
  { href: "/incidents", label: "Incidencias" },
  { href: "/returns", label: "Devoluciones" },
  { href: "/fees", label: "Cuota anual" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#004A8F] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <span className="bg-[#F7C200] text-[#004A8F] px-2 py-0.5 rounded font-extrabold text-xl">C</span>
          <span>Marketplace B2B</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative px-3 py-2 rounded hover:bg-white/10 transition-colors text-sm font-medium"
          >
            🛒 Carrito
          </Link>
          <Link
            href="/login"
            className="bg-white text-[#004A8F] px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Cerrar sesión
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#003870] px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium hover:text-[#F7C200]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="block py-2 text-sm font-medium hover:text-[#F7C200]" onClick={() => setMenuOpen(false)}>
            🛒 Carrito
          </Link>
          <Link href="/login" className="block py-2 text-sm font-medium hover:text-[#F7C200]" onClick={() => setMenuOpen(false)}>
            Cerrar sesión
          </Link>
        </div>
      )}
    </header>
  );
}
