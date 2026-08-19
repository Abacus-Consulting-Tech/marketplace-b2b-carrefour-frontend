import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, FileText, Building2 } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Nuevo Pedido',
      description: 'Explorar catálogo de productos',
      icon: ShoppingCart,
      href: '/marketplace',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    {
      title: 'Mis Pedidos',
      description: 'Ver historial de pedidos',
      icon: Package,
      href: '/marketplace/orders',
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
    },
    {
      title: 'Proyectos de Apertura',
      description: 'Gestionar nuevas aperturas',
      icon: Building2,
      href: '/franchisee/openings',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
    {
      title: 'Facturas',
      description: 'Descargar facturas',
      icon: FileText,
      href: '/marketplace/orders',
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-start p-4 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 rounded-lg mb-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm text-left">
                  {action.title}
                </span>
                <span className="text-xs text-gray-500 text-left">
                  {action.description}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
