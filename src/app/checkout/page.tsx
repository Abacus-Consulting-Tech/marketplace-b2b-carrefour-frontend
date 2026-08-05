"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [address, setAddress] = useState({
    street: "Calle Gran Vía 28",
    city: "Madrid",
    zip: "28013",
    notes: "",
  });
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  function handleConfirm() {
    setProcessing(true);
    setTimeout(() => {
      router.push("/orders/ORD-2024-003");
    }, 2000);
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar pedido</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium">
        {(["address", "payment", "confirm"] as const).map((s, i) => {
          const labels = ["Dirección de entrega", "Pago con tarjeta", "Confirmación"];
          const active = s === step;
          const done =
            (step === "payment" && i === 0) ||
            (step === "confirm" && i <= 1);
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="h-px w-8 bg-gray-300" />}
              <div className={`flex items-center gap-1.5 ${active ? "text-[#004A8F]" : done ? "text-green-600" : "text-gray-400"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${active ? "border-[#004A8F] bg-[#004A8F] text-white" : done ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}>
                  {done ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{labels[i]}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-lg">
        {step === "address" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Dirección de entrega</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calle y número</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas de entrega (opcional)</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                />
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full bg-[#004A8F] text-white py-2.5 rounded-lg font-semibold hover:bg-[#003870] transition-colors"
              >
                Continuar al pago
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-1">Pago con tarjeta</h2>
            <p className="text-xs text-gray-500 mb-4">El cobro es centralizado por Infocus como operador del marketplace.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input
                  type="text"
                  placeholder="NOMBRE APELLIDO"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de caducidad</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("address")}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 bg-[#004A8F] text-white py-2.5 rounded-lg font-semibold hover:bg-[#003870] transition-colors"
                >
                  Revisar pedido
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Confirmar pedido</h2>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Dirección de entrega:</span>
                <span>{address.street}, {address.zip} {address.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Método de pago:</span>
                <span>Tarjeta •••• {card.number.slice(-4) || "****"}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total a pagar:</span>
                <span>166.47 €</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("payment")}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {processing ? "Procesando..." : "Confirmar y pagar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
