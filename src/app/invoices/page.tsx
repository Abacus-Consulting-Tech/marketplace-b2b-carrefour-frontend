import AppLayout from "@/components/AppLayout";
import { MOCK_INVOICES } from "@/lib/mock-data";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  issued: { label: "Emitida", cls: "bg-blue-100 text-blue-800" },
  paid: { label: "Pagada", cls: "bg-green-100 text-green-800" },
  overdue: { label: "Vencida", cls: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelada", cls: "bg-gray-100 text-gray-800" },
};

export default function InvoicesPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Facturas</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Nº Factura</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Proveedor</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Pedido</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Importe</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Emisión</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Vencimiento</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_INVOICES.map((invoice) => {
              const badge = STATUS_MAP[invoice.status] ?? { label: invoice.status, cls: "bg-gray-100 text-gray-800" };
              return (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-4 py-3 text-gray-600">{invoice.supplierName}</td>
                  <td className="px-4 py-3 text-[#004A8F]">{invoice.orderId}</td>
                  <td className="px-4 py-3 text-right font-semibold">{invoice.amount.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(invoice.issuedAt).toLocaleDateString("es-ES")}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(invoice.dueAt).toLocaleDateString("es-ES")}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-[#004A8F] text-xs font-medium hover:underline">
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total facturado", value: MOCK_INVOICES.reduce((s, i) => s + i.amount, 0).toFixed(2) + " €", cls: "bg-white" },
          { label: "Pendiente de pago", value: MOCK_INVOICES.filter((i) => i.status === "issued").reduce((s, i) => s + i.amount, 0).toFixed(2) + " €", cls: "bg-yellow-50 border-yellow-200" },
          { label: "Pagado", value: MOCK_INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0).toFixed(2) + " €", cls: "bg-green-50 border-green-200" },
        ].map((stat) => (
          <div key={stat.label} className={`border rounded-xl p-4 ${stat.cls}`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
