import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const sections = [
  {
    title: "La Plataforma",
    links: [
      { label: "¿Qué es Infoqus?", href: "#" },
      { label: "Cómo funciona", href: "#" },
      { label: "Acceso franquiciados", href: "/login" },
      { label: "Acceso proveedores", href: "/login" },
      { label: "Registro", href: "/register" },
    ],
  },
  {
    title: "Compras y Pedidos",
    links: [
      { label: "Cómo realizar un pedido", href: "#" },
      { label: "Seguimiento de pedidos", href: "#" },
      { label: "Política de devoluciones", href: "#" },
      { label: "Condiciones de venta", href: "#" },
    ],
  },
  {
    title: "Logística y Entrega",
    links: [
      { label: "Plazos de entrega", href: "#" },
      { label: "Zonas de cobertura", href: "#" },
      { label: "Gestión de incidencias", href: "#" },
      { label: "Proveedores de transporte", href: "#" },
    ],
  },
  {
    title: "Pagos y Facturación",
    links: [
      { label: "Métodos de pago", href: "#" },
      { label: "Seguridad en pagos", href: "#" },
      { label: "Facturación electrónica", href: "#" },
      { label: "Política de precios", href: "#" },
    ],
  },
  {
    title: "Sostenibilidad",
    links: [
      { label: "Compromiso medioambiental", href: "#" },
      { label: "Proveedores responsables", href: "#" },
      { label: "Reducción de embalajes", href: "#" },
      { label: "Huella de carbono", href: "#" },
    ],
  },
  {
    title: "Ayuda y Soporte",
    links: [
      { label: "Centro de ayuda", href: "#" },
      { label: "Preguntas frecuentes", href: "#" },
      { label: "Contacto técnico", href: "#" },
      { label: "Política de privacidad", href: "#" },
      { label: "Aviso legal", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer grid */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/images/logo-express-franquicias-inicio_20180820_tcm5-49264.png.webp"
              alt="Carrefour Express"
              width={130}
              height={46}
              className="object-contain brightness-0 invert mb-4"
            />
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Plataforma B2B exclusiva para franquiciados y proveedores de Carrefour Express.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <span>soporte@infoqus.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <span>+34 900 XXX XXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} Carrefour Express · Todos los derechos reservados
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-400">Infoqus</span>
            <span>·</span>
            <span>
              Powered by{" "}
              <span className="text-blue-400 font-semibold">Abacus Consulting</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
