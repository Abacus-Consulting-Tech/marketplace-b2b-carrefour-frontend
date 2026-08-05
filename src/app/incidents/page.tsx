"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { MOCK_INCIDENTS } from "@/lib/mock-data";
import type { Incident } from "@/types";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  open: { label: "Abierta", cls: "bg-red-100 text-red-800" },
  in_progress: { label: "En tramitación", cls: "bg-yellow-100 text-yellow-800" },
  resolved: { label: "Resuelta", cls: "bg-green-100 text-green-800" },
  closed: { label: "Cerrada", cls: "bg-gray-100 text-gray-800" },
};

const TYPE_MAP: Record<string, string> = {
  damage: "Daño en producto",
  missing_item: "Artículo faltante",
  wrong_item: "Artículo incorrecto",
  delay: "Retraso en entrega",
  other: "Otro",
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: "", type: "missing_item" as Incident["type"], description: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newIncident: Incident = {
      id: `INC-2024-${String(incidents.length + 1).padStart(3, "0")}`,
      orderId: form.orderId,
      franchiseeId: "f1",
      type: form.type,
      description: form.description,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setIncidents([newIncident, ...incidents]);
    setForm({ orderId: "", type: "missing_item", description: "" });
    setShowForm(false);
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Incidencias</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#004A8F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors"
        >
          + Nueva incidencia
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Notificar nueva incidencia</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de incidencia</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Incident["type"] })}
                >
                  {Object.entries(TYPE_MAP).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004A8F]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe el problema con el mayor detalle posible..."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#004A8F] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors">
                Enviar incidencia
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {incidents.length === 0 && (
          <p className="text-gray-500 text-center py-16">No hay incidencias registradas.</p>
        )}
        {incidents.map((incident) => {
          const badge = STATUS_MAP[incident.status] ?? { label: incident.status, cls: "bg-gray-100 text-gray-800" };
          return (
            <div key={incident.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{incident.id}</span>
                  <span className="text-xs text-gray-400">· Pedido {incident.orderId}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{TYPE_MAP[incident.type]}</p>
              <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
              {incident.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  <strong>Resolución:</strong> {incident.resolution}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(incident.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
