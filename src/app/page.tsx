import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogIn, Clock, Zap, ClipboardList, ShoppingBag, Users, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center gap-8">
          <Image
            src="/images/logo-express-franquicias-inicio_20180820_tcm5-49264.png.webp"
            alt="Carrefour Express"
            width={200}
            height={72}
            className="object-contain brightness-0 invert"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            El marketplace B2B exclusivo para franquiciados Carrefour Express
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Uniformes, señalización, folletos, equipamientos y merchandising — todo lo que necesitas para tu establecimiento, en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold px-8">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 gap-2 font-semibold px-8">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Qué te ofrece esta plataforma? */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          ¿Qué te ofrece esta plataforma?
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Diseñada específicamente para las necesidades operativas de los franquiciados Carrefour Express.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pedidos 24 / 7</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Realiza tus compras cuando te venga mejor. Sin horarios, sin esperas, con confirmación inmediata.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ahorra Tiempo</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Interfaz rápida, clara y optimizada. Encuentra lo que necesitas en segundos y completa tu pedido en minutos.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <ClipboardList className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Control Total</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Historial de pedidos y facturación accesible en todo momento. Consulta el estado de cualquier pedido en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Categorías disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Uniformes', emoji: '👔' },
              { label: 'Folletos', emoji: '📄' },
              { label: 'Señalización en tienda', emoji: '🪧' },
              { label: 'Equipamientos', emoji: '⚙️' },
              { label: 'Merchandising', emoji: '🎁' },
            ].map(({ label, emoji }) => (
              <Link key={label} href="/login">
                <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                  <span className="text-4xl">{emoji}</span>
                  <span className="text-sm font-semibold text-gray-700 text-center">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Diseñado para cada perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Franquiciados</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Accede al catálogo completo, realiza pedidos y lleva el seguimiento de tus compras en un panel personalizado.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Proveedores</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Gestiona tu catálogo de productos, procesa pedidos y accede a métricas de ventas desde tu propio panel.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Administradores</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Supervisión completa de la plataforma, gestión de proveedores y acceso a estadísticas globales en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Accede a tu cuenta y gestiona todo lo que necesita tu establecimiento desde un solo lugar.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 gap-2">
              <LogIn className="w-4 h-4" />
              Acceder a la plataforma
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="border-t py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Carrefour Express · Marketplace B2B · Todos los derechos reservados
      </footer>

    </main>
  );
}

