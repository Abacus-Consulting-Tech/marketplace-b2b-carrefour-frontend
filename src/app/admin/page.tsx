import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MOCK_ORDERS, MOCK_INVOICES, MOCK_SUPPLIERS, MOCK_ANNUAL_FEES } from "@/lib/mock-data";

export default function AdminPage() {
  const totalRevenue = MOCK_INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = MOCK_INVOICES.filter((i) => i.status === "issued").reduce((s, i) => s + i.amount, 0);
  const totalFees = MOCK_ANNUAL_FEES.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const pendingFees = MOCK_ANNUAL_FEES.filter((f) => f.status === "pending").reduce((s, f) => s + f.amount, 0);

  const stats = [
    { label: "Pedidos totales", value: MOCK_ORDERS.length, sub: "en el sistema", icon: "📦" },
    { label: "Facturas cobradas", value: totalRevenue.toFixed(2) + " €", sub: "volumen procesado", icon: "💰" },
    { label: "Facturación pendiente", value: pendingRevenue.toFixed(2) + " €", sub: "por cobrar", icon: "⏳" },
    { label: "Cuotas anuales cobradas", value: totalFees.toFixed(2) + " €", sub: `Pendientes: ${pendingFees.toFixed(2)} €`, icon: "🏦" },
    { label: "Proveedores activos", value: MOCK_SUPPLIERS.filter((s) => s.status === "active").length, sub: "en el catálogo", icon: "🤝" },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
        <p className="text-gray-500 text-sm mt-1">Información de gestión del marketplace · Operado por Infocus</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick admin links */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-4">Gestión</h2>
          <div className="flex flex-col gap-2">
            {[
              { href: "/suppliers", label: "Gestionar proveedores", icon: "🤝" },
              { href: "/orders", label: "Ver todos los pedidos", icon: "📦" },
              { href: "/invoices", label: "Gestionar facturas", icon: "🧾" },
              { href: "/incidents", label: "Incidencias abiertas", icon: "⚠️" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-[#004A8F]"
              >
                <span>{link.icon}</span>
                {link.label}
                <span className="ml-auto text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Settlements summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-4">Liquidaciones (simulado)</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>Cobros centralizados (Infocus)</span>
              <span className="font-semibold">{(totalRevenue + totalFees).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>Liquidación a proveedores</span>
              <span className="font-semibold">{totalRevenue.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>Cuotas anuales (Infocus)</span>
              <span className="font-semibold">{totalFees.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1">
              <span>Retribución a Abacus (estimada)</span>
              <span>-</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Los flujos de facturación definitivos deben ser confirmados por los asesores jurídicos y fiscales antes del cierre de contratos.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
