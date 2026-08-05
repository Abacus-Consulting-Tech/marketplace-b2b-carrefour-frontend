"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { MOCK_RETURNS } from "@/lib/mock-data";
import type { Return } from "@/types";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  requested: { label: "Solicitada", cls: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Aprobada", cls: "bg-blue-100 text-blue-800" },
  rejected: { label: "Rechazada", cls: "bg-red-100 text-red-800" },
  completed: { label: "Completada", cls: "bg-green-100 text-green-800" },
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(MOCK_RETURNS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: "", productName: "", quantity: "1", reason: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newReturn: Return = {
      id: `DEV-2024-${String(returns.length + 1).padStart(3, "0")}`,
      orderId: form.orderId,
      franchiseeId: "f1",
      items: [{ productId: "unknown", productName: form.productName, quantity: Number(form.quantity), unitPrice: 0 }],
      reason: form.reason,
      status: "requested",
      createdAt: new Date().toISOString(),
    };
    setReturns([newReturn, ...returns]);
    setForm({ orderId: "", productName: "", quantity: "1", reason: "" });
    setShowForm(false);
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Devoluciones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#004A8F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors"
        >
          + Solicitar devolución
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Nueva solicitud de devolución</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de pedido</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={form.orderId}
                  onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  placeholder="ORD-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la devolución</label>
              <textarea
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#004A8F] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors">
                Enviar solicitud
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {returns.length === 0 && (
          <p className="text-gray-500 text-center py-16">No hay devoluciones registradas.</p>
        )}
        {returns.map((ret) => {
          const badge = STATUS_MAP[ret.status] ?? { label: ret.status, cls: "bg-gray-100 text-gray-800" };
          return (
            <div key={ret.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{ret.id}</span>
                  <span className="text-xs text-gray-400">· Pedido {ret.orderId}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {ret.items.map((item, i) => (
                  <span key={i}>{item.productName} × {item.quantity}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2"><strong>Motivo:</strong> {ret.reason}</p>
              {ret.refundAmount !== undefined && (
                <p className="text-sm text-green-700 font-medium">Reembolso: {ret.refundAmount.toFixed(2)} €</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{new Date(ret.createdAt).toLocaleDateString("es-ES")}</p>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
