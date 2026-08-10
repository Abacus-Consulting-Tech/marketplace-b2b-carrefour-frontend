import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Marketplace B2B Carrefour
        </h1>
        <p className="text-center text-muted-foreground">
          Plataforma privada para franquiciados y proveedores
        </p>
        
        {/* Login Button */}
        <div className="flex justify-center mt-8">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Franquiciados</h2>
            <p className="text-sm text-muted-foreground">
              Accede al catálogo de productos y realiza pedidos
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Proveedores</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tu catálogo y procesa pedidos
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
            <p className="text-sm text-muted-foreground">
              Conectamos franquiciados con proveedores aprobados
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
