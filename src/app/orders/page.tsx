import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MOCK_ORDERS } from "@/lib/mock-data";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", cls: "bg-blue-100 text-blue-800" },
  processing: { label: "En proceso", cls: "bg-purple-100 text-purple-800" },
  shipped: { label: "Enviado", cls: "bg-orange-100 text-orange-800" },
  delivered: { label: "Entregado", cls: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-800" },
};

export default function OrdersPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h1>

      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No tienes pedidos todavía.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => {
            const badge = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-800" };
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-bold text-[#004A8F] hover:underline">
                      {order.id}
                    </Link>
                    <span className="ml-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{item.subtotal.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-500">{order.deliveryAddress}</span>
                  <span className="font-bold text-gray-900">{order.total.toFixed(2)} €</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm text-[#004A8F] font-medium hover:underline"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
