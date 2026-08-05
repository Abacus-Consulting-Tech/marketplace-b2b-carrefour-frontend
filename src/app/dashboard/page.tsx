import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MOCK_ORDERS, MOCK_ANNUAL_FEES } from "@/lib/mock-data";

const quickLinks = [
  { href: "/catalog", label: "Catálogo", icon: "🛍️", desc: "Explora productos y servicios" },
  { href: "/orders", label: "Mis pedidos", icon: "📦", desc: "Seguimiento de tus pedidos" },
  { href: "/invoices", label: "Facturas", icon: "🧾", desc: "Consulta y descarga facturas" },
  { href: "/incidents", label: "Incidencias", icon: "⚠️", desc: "Gestiona incidencias abiertas" },
  { href: "/returns", label: "Devoluciones", icon: "↩️", desc: "Solicita devoluciones" },
  { href: "/fees", label: "Cuota anual", icon: "💳", desc: "Estado y pago de tu cuota" },
];

export default function DashboardPage() {
  const pendingFee = MOCK_ANNUAL_FEES.find((f) => f.status === "pending");
  const recentOrders = MOCK_ORDERS.slice(0, 3);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, Franquicia Madrid Centro</h1>
        <p className="text-gray-500 text-sm mt-1">Código de franquicia: F-MAD-001</p>
      </div>

      {/* Annual fee alert */}
      {pendingFee && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-yellow-800">Cuota anual {pendingFee.year} pendiente</p>
            <p className="text-yellow-700 text-sm">
              Importe: <strong>{pendingFee.amount.toFixed(2)} €</strong> — Vence el{" "}
              {new Date(pendingFee.dueAt).toLocaleDateString("es-ES")}
            </p>
          </div>
          <Link
            href="/fees"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors whitespace-nowrap"
          >
            Pagar ahora
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#004A8F] transition-all group"
          >
            <div className="text-3xl mb-2">{link.icon}</div>
            <div className="font-semibold text-gray-900 group-hover:text-[#004A8F]">{link.label}</div>
            <div className="text-xs text-gray-500 mt-1">{link.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
          <Link href="/orders" className="text-[#004A8F] text-sm hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-left">
                <th className="pb-2 font-medium">Referencia</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5">
                    <Link href={`/orders/${order.id}`} className="text-[#004A8F] font-medium hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-2.5 font-medium">{order.total.toFixed(2)} €</td>
                  <td className="py-2.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-2.5 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmado", cls: "bg-blue-100 text-blue-800" },
    processing: { label: "En proceso", cls: "bg-purple-100 text-purple-800" },
    shipped: { label: "Enviado", cls: "bg-orange-100 text-orange-800" },
    delivered: { label: "Entregado", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-800" },
  };
  const entry = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${entry.cls}`}>
      {entry.label}
    </span>
  );
}
