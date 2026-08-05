import AppLayout from "@/components/AppLayout";
import { MOCK_SUPPLIERS } from "@/lib/mock-data";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active: { label: "Activo", cls: "bg-green-100 text-green-800" },
  inactive: { label: "Inactivo", cls: "bg-gray-100 text-gray-800" },
  pending: { label: "Pendiente de validación", cls: "bg-yellow-100 text-yellow-800" },
};

export default function SuppliersPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">Proveedores registrados en el marketplace</p>
        </div>
        <button className="bg-[#004A8F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003870] transition-colors">
          + Añadir proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_SUPPLIERS.map((supplier) => {
          const badge = STATUS_MAP[supplier.status] ?? { label: supplier.status, cls: "bg-gray-100 text-gray-800" };
          return (
            <div key={supplier.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#004A8F]/10 flex items-center justify-center text-xl font-bold text-[#004A8F]">
                  {supplier.name.charAt(0)}
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{supplier.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{supplier.email}</p>
              <p className="text-sm text-gray-500 mb-3">{supplier.phone}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {supplier.categories.map((cat) => (
                  <span key={cat} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                    {cat}
                  </span>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span className="text-gray-500">Productos activos</span>
                <span className="font-semibold text-gray-900">{supplier.totalProducts}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 text-xs text-[#004A8F] border border-[#004A8F] py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Ver productos
                </button>
                <button className="flex-1 text-xs text-gray-700 border border-gray-300 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
