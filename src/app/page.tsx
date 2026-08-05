import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#004A8F] text-white px-4">
      <div className="bg-white text-[#004A8F] rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="bg-[#004A8F] text-white px-3 py-1 rounded font-extrabold text-3xl">C</span>
          <span className="font-bold text-2xl">Marketplace B2B</span>
        </div>
        <p className="text-gray-600 mb-8 text-sm">
          Plataforma privada para franquiciados Carrefour. Accede con tus credenciales para gestionar tus compras y servicios.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full bg-[#004A8F] text-white py-3 rounded-lg font-semibold hover:bg-[#003870] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="w-full border border-[#004A8F] text-[#004A8F] py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Solicitar acceso
          </Link>
        </div>
      </div>
      <p className="mt-6 text-blue-200 text-xs">
        Operado por Infocus · Desarrollado por Abacus
      </p>
    </div>
  );
}
