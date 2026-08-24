"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Presupuestos</h1>
        <p className="text-muted-foreground">
          Solicita y gestiona presupuestos personalizados
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <MessageSquare className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Presupuestos Personalizados</CardTitle>
          <CardDescription>
            Próximamente podrás solicitar presupuestos a proveedores
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Funcionalidad en desarrollo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
