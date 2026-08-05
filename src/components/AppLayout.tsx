import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-[#004A8F] text-white text-center text-xs py-3 mt-auto">
        © {new Date().getFullYear()} Carrefour B2B Marketplace — Operado por Infocus · Desarrollado por Abacus
      </footer>
    </div>
  );
}
