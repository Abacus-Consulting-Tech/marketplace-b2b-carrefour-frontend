import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/navigation/Footer';
import {
  LogIn, Clock, Zap, ClipboardList,
  ShoppingBag, Users, ShieldCheck,
  ArrowRight, CheckCircle2,
} from 'lucide-react';

const stats = [
  { value: '500+', label: 'Franquiciados activos' },
  { value: '50+',  label: 'Proveedores certificados' },
  { value: '5',    label: 'Categorías disponibles' },
  { value: '24/7', label: 'Disponibilidad total' },
];

const categories = [
  {
    label: 'Uniformes',
    img: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80',
    desc: 'Ropa corporativa y equipación laboral',
  },
  {
    label: 'Folletos',
    img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
    desc: 'Impresión y material gráfico',
  },
  {
    label: 'Señalización en tienda',
    img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    desc: 'Carteles, vinilos y displays',
  },
  {
    label: 'Equipamientos',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    desc: 'Balanzas, expositores y mobiliario',
  },
  {
    label: 'Merchandising',
    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    desc: 'Bolsas, regalos y artículos corporativos',
  },
];

const steps = [
  { n: '01', title: 'Accede a tu cuenta', desc: 'Inicia sesión con tus credenciales de franquiciado Carrefour Express.' },
  { n: '02', title: 'Elige tus productos', desc: 'Navega por el catálogo, filtra por categoría y añade al carrito lo que necesitas.' },
  { n: '03', title: 'Confirma y recibe', desc: 'Paga de forma segura y recibe tu pedido directamente en tu establecimiento.' },
];

const benefits = [
  { icon: Clock,         title: 'Pedidos 24 / 7',   desc: 'Realiza tus compras cuando te venga mejor, sin horarios ni esperas.' },
  { icon: Zap,          title: 'Ahorra Tiempo',     desc: 'Interfaz rápida, clara y optimizada para completar pedidos en minutos.' },
  { icon: ClipboardList, title: 'Control Total',     desc: 'Historial de pedidos y facturación accesibles en todo momento.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003a80] via-[#0055b2] to-[#0077cc] text-white">
        {/* Decorative background circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-white/5 pointer-events-none" />

        <div className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-7 animate-slide-right">
            <Image
              src="/images/logo-express-franquicias-inicio_20180820_tcm5-49264.png.webp"
              alt="Carrefour Express"
              width={180}
              height={64}
              className="object-contain brightness-0 invert"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              El marketplace B2B exclusivo para franquiciados
              <span className="block text-blue-200 mt-1">Carrefour Express</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
              Uniformes, señalización, folletos, equipamientos y merchandising — todo lo que necesita tu establecimiento, en un solo lugar.
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              {['Proveedores certificados por Carrefour', 'Precios negociados exclusivos', 'Entrega directa en tu establecimiento'].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/login">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold px-8 shadow-lg">
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold px-8">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: product image mosaic */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-52">
                <img src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80" alt="Uniformes" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl h-36">
                <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80" alt="Folletos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-36">
                <img src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80" alt="Señalización" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl h-52">
                <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80" alt="Merchandising" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-4xl font-extrabold text-blue-400 mb-1">{value}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Por qué Infoqus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">¿Qué te ofrece esta plataforma?</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Diseñada específicamente para las necesidades operativas de los franquiciados Carrefour Express.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="group flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
              Catálogo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Categorías disponibles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map(({ label, img, desc }, i) => (
              <Link key={label} href="/login">
                <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="h-52">
                    <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm leading-tight">{label}</p>
                    <p className="text-white/70 text-xs mt-0.5">{desc}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Proceso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Así de fácil funciona</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-blue-100" />
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} className="flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200 z-10">
                <span className="text-2xl font-extrabold text-white">{n}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
              Perfiles
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Diseñado para cada perfil</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Franquiciados', color: 'from-blue-500 to-blue-700', desc: 'Accede al catálogo completo, realiza pedidos y lleva el seguimiento de tus compras en un panel personalizado.' },
              { icon: Users,        title: 'Proveedores',   color: 'from-blue-600 to-blue-800', desc: 'Gestiona tu catálogo, procesa pedidos y accede a métricas de ventas desde tu propio panel de control.' },
              { icon: ShieldCheck,  title: 'Administradores', color: 'from-blue-700 to-blue-900', desc: 'Supervisión completa de la plataforma, gestión de proveedores y estadísticas globales en tiempo real.' },
            ].map(({ icon: Icon, title, color, desc }, i) => (
              <div key={title} className="relative overflow-hidden p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-5`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-[#0055b2] text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=60')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">¿Listo para empezar?</h2>
          <p className="text-blue-100 mb-10 max-w-lg mx-auto text-lg">
            Accede a tu cuenta y gestiona todo lo que necesita tu establecimiento desde un solo lugar.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-12 gap-2 shadow-xl text-base h-14">
              <LogIn className="w-5 h-5" />
              Acceder a la plataforma
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}


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
              <Button size="lg" variant="outline" className="border-white text-blue-700 bg-white hover:bg-blue-50 gap-2 font-semibold px-8">
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

      <Footer />

    </main>
  );
}

