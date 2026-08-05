"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { MOCK_ANNUAL_FEES } from "@/lib/mock-data";
import type { AnnualFee } from "@/types";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Pagada", cls: "bg-green-100 text-green-800" },
  overdue: { label: "Vencida", cls: "bg-red-100 text-red-800" },
};

export default function FeesPage() {
  const [fees] = useState<AnnualFee[]>(MOCK_ANNUAL_FEES);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [showCard, setShowCard] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  function startPay(id: string) {
    setPayingId(id);
    setShowCard(true);
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (payingId) {
      setPaid((prev) => new Set([...prev, payingId]));
    }
    setShowCard(false);
    setPayingId(null);
    setCard({ number: "", name: "", expiry: "", cvv: "" });
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuota anual</h1>
      <p className="text-gray-500 text-sm mb-6">
        El pago de la cuota anual habilita el acceso al marketplace durante el ejercicio correspondiente. El cobro es gestionado por Infocus como operador del marketplace.
      </p>

      {/* Payment modal */}
      {showCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Pago de cuota anual</h2>
            <form onSubmit={handlePay} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowCard(false); setPayingId(null); }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#004A8F] text-white py-2.5 rounded-lg font-semibold hover:bg-[#003870] transition-colors"
                >
                  Pagar {fees.find((f) => f.id === payingId)?.amount.toFixed(2)} €
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {fees.map((fee) => {
          const isPaid = paid.has(fee.id) || fee.status === "paid";
          const status = isPaid ? "paid" : fee.status;
          const badge = STATUS_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-800" };
          return (
            <div key={fee.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Cuota {fee.year}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Franquicia: {fee.franchiseeName}</p>
                  <p className="text-sm text-gray-500">Vencimiento: {new Date(fee.dueAt).toLocaleDateString("es-ES")}</p>
                  {fee.paidAt && (
                    <p className="text-sm text-green-600">Pagado el: {new Date(fee.paidAt).toLocaleDateString("es-ES")}</p>
                  )}
                  {isPaid && !fee.paidAt && (
                    <p className="text-sm text-green-600">Pagado hoy</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#004A8F]">{fee.amount.toFixed(2)} €</p>
                  {!isPaid && (
                    <button
                      onClick={() => startPay(fee.id)}
                      className="mt-2 bg-[#004A8F] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors"
                    >
                      Pagar ahora
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
