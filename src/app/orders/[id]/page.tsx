import Link from "next/link";
import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { MOCK_ORDERS } from "@/lib/mock-data";

const STATUS_MAP: Record<string, { label: string; cls: string; step: number }> = {
  pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-800", step: 0 },
  confirmed: { label: "Confirmado", cls: "bg-blue-100 text-blue-800", step: 1 },
  processing: { label: "En proceso", cls: "bg-purple-100 text-purple-800", step: 2 },
  shipped: { label: "Enviado", cls: "bg-orange-100 text-orange-800", step: 3 },
  delivered: { label: "Entregado", cls: "bg-green-100 text-green-800", step: 4 },
  cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-800", step: -1 },
};

const STEPS = ["Pendiente", "Confirmado", "En proceso", "Enviado", "Entregado"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  const badge = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-800", step: 0 };

  return (
    <AppLayout>
      <div className="mb-4">
        <Link href="/orders" className="text-[#004A8F] text-sm hover:underline">← Volver a mis pedidos</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {/* Progress tracker */}
      {order.status !== "cancelled" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Seguimiento del pedido</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0" />
            <div
              className="absolute left-0 top-4 h-1 bg-[#004A8F] z-0 transition-all"
              style={{ width: `${(badge.step / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    i <= badge.step
                      ? "bg-[#004A8F] border-[#004A8F] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {i < badge.step ? "✓" : i + 1}
                </div>
                <span className="text-xs mt-1 text-center text-gray-600 hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-4">Artículos del pedido</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-2 text-left font-medium">Producto</th>
                <th className="pb-2 text-right font-medium">Cant.</th>
                <th className="pb-2 text-right font-medium">Precio unit.</th>
                <th className="pb-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-b border-gray-50">
                  <td className="py-2">
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    <div className="text-xs text-gray-400">{item.supplierName}</div>
                  </td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{item.unitPrice.toFixed(2)} €</td>
                  <td className="py-2 text-right font-semibold">{item.subtotal.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-right font-bold text-gray-900">Total</td>
                <td className="pt-3 text-right font-bold text-gray-900">{order.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-4">Información del pedido</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Fecha de pedido</dt>
              <dd className="font-medium">{new Date(order.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Última actualización</dt>
              <dd className="font-medium">{new Date(order.updatedAt).toLocaleDateString("es-ES")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Dirección de entrega</dt>
              <dd className="font-medium text-right max-w-48">{order.deliveryAddress}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2 mt-6">
            <Link href="/incidents" className="text-sm text-[#004A8F] hover:underline">
              ⚠️ Notificar incidencia
            </Link>
            <Link href="/returns" className="text-sm text-[#004A8F] hover:underline">
              ↩️ Solicitar devolución
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
