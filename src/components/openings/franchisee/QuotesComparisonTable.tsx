'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Download, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';

interface Quote {
  id: string;
  category_id: string;
  supplier_id: string;
  supplier?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
  delivery_days: number;
  warranty_months: number;
  payment_terms: string;
  notes?: string;
  pdf_url?: string;
  status: 'draft' | 'submitted' | 'awarded' | 'rejected';
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

interface QuotesComparisonTableProps {
  categoryId: string;
  categoryName: string;
  categoryDescription?: string;
  budgetEstimate: number;
  quotes: Quote[];
  onAward: (quoteId: string) => void;
  onRevert?: (quoteId: string) => void;
  isAwarding?: boolean;
}

export default function QuotesComparisonTable({
  categoryId,
  categoryName,
  categoryDescription,
  budgetEstimate,
  quotes,
  onAward,
  onRevert,
  isAwarding = false,
}: QuotesComparisonTableProps) {
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Ordenar presupuestos por importe (menor a mayor)
  const sortedQuotes = [...quotes].sort((a, b) => a.amount - b.amount);

  // Calcular el presupuesto más bajo
  const lowestAmount = sortedQuotes.length > 0 ? sortedQuotes[0].amount : 0;

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  // Calcular porcentaje de ahorro/aumento vs presupuesto estimado
  const getSavingsPercentage = (amount: number) => {
    if (budgetEstimate === 0) return 0;
    const diff = budgetEstimate - amount;
    return Math.round((diff / budgetEstimate) * 100);
  };

  // Manejar clic en adjudicar
  const handleAwardClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setAwardDialogOpen(true);
  };

  // Manejar clic en revertir
  const handleRevertClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setRevertDialogOpen(true);
  };

  // Confirmar adjudicación
  const handleConfirmAward = () => {
    if (selectedQuote) {
      onAward(selectedQuote.id);
      setAwardDialogOpen(false);
      setSelectedQuote(null);
    }
  };

  // Confirmar reversión
  const handleConfirmRevert = () => {
    if (selectedQuote && onRevert) {
      onRevert(selectedQuote.id);
      setRevertDialogOpen(false);
      setSelectedQuote(null);
    }
  };

  // Obtener el badge según el estado
  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="default">Enviado</Badge>;
      case 'awarded':
        return <Badge className="bg-green-600 hover:bg-green-700">Adjudicado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazado</Badge>;
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Si no hay presupuestos, mostrar mensaje
  if (sortedQuotes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay presupuestos recibidos
            </h3>
            <p className="text-gray-600">
              Aún no se han recibido presupuestos para esta categoría.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Comparación de Presupuestos</CardTitle>
              <CardDescription className="mt-1">
                {categoryName}
                {categoryDescription && (
                  <span className="block text-sm text-gray-500 mt-1">
                    {categoryDescription}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Presupuesto estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(budgetEstimate)}
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-600 font-medium">
                Presupuestos recibidos
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {quotes.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Mejor oferta
              </p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(lowestAmount)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-purple-600 font-medium">
                Ahorro potencial
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {getSavingsPercentage(lowestAmount) > 0 ? '+' : ''}
                {getSavingsPercentage(lowestAmount)}%
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Proveedor</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Plazo</TableHead>
                  <TableHead>Garantía</TableHead>
                  <TableHead>Condiciones de Pago</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedQuotes.map((quote) => {
                  const isLowest = quote.amount === lowestAmount;
                  const isAwarded = quote.status === 'awarded';
                  const savings = getSavingsPercentage(quote.amount);

                  return (
                    <TableRow 
                      key={quote.id}
                      className={isLowest ? 'bg-green-50' : ''}
                    >
                      {/* Proveedor */}
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {quote.supplier?.name || 'Proveedor'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {quote.supplier?.email}
                          </p>
                          {quote.supplier?.phone && (
                            <p className="text-sm text-gray-500">
                              📞 {quote.supplier.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Importe */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {formatCurrency(quote.amount)}
                          </span>
                          {isLowest && (
                            <Badge className="bg-green-600 text-white text-xs">
                              Mejor oferta
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          {savings > 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                {savings}% ahorro
                              </span>
                            </>
                          ) : savings < 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                {Math.abs(savings)}% sobre presupuesto
                              </span>
                            </>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Plazo de entrega */}
                      <TableCell>
                        <span className="text-gray-900">
                          {quote.delivery_days} días
                        </span>
                      </TableCell>

                      {/* Garantía */}
                      <TableCell>
                        <span className="text-gray-900">
                          {quote.warranty_months} meses
                        </span>
                      </TableCell>

                      {/* Condiciones de pago */}
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4 mr-1" />
                                Ver condiciones
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p className="text-sm">{quote.payment_terms}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      {/* PDF */}
                      <TableCell>
                        {quote.pdf_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(quote.pdf_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No disponible
                          </span>
                        )}
                      </TableCell>

                      {/* Estado */}
                      <TableCell>
                        {getStatusBadge(quote.status)}
                      </TableCell>

                      {/* Acción */}
                      <TableCell className="text-right">
                        {isAwarded ? (
                          onRevert && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevertClick(quote)}
                              disabled={isAwarding}
                            >
                              Revertir
                            </Button>
                          )
                        ) : quote.status === 'submitted' ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAwardClick(quote)}
                            disabled={isAwarding}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Adjudicar
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Notas adicionales */}
          {sortedQuotes.some(q => q.notes) && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Notas adicionales</h4>
              {sortedQuotes
                .filter(q => q.notes)
                .map(quote => (
                  <div key={quote.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {quote.supplier?.name}
                    </p>
                    <p className="text-sm text-gray-700">{quote.notes}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación para adjudicación */}
      <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar adjudicación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas adjudicar esta categoría a {selectedQuote?.supplier?.name}?
              Esta acción marcará los demás presupuestos como rechazados.
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Proveedor:</span>
                <span className="text-sm font-semibold">{selectedQuote.supplier?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Importe:</span>
                <span className="text-sm font-semibold">{formatCurrency(selectedQuote.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Plazo:</span>
                <span className="text-sm font-semibold">{selectedQuote.delivery_days} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Garantía:</span>
                <span className="text-sm font-semibold">{selectedQuote.warranty_months} meses</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAwardDialogOpen(false)}
              disabled={isAwarding}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAward}
              disabled={isAwarding}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAwarding ? 'Adjudicando...' : 'Confirmar adjudicación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para reversión */}
      {onRevert && (
        <Dialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revertir adjudicación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas revertir la adjudicación de {selectedQuote?.supplier?.name}?
                Esto devolverá el presupuesto al estado &quot;Enviado&quot; y los demás presupuestos también volverán a estar disponibles.
              </DialogDescription>
            </DialogHeader>
            {selectedQuote && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Proveedor:</span>
                  <span className="text-sm font-semibold">{selectedQuote.supplier?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Importe:</span>
                  <span className="text-sm font-semibold">{formatCurrency(selectedQuote.amount)}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRevertDialogOpen(false)}
                disabled={isAwarding}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmRevert}
                disabled={isAwarding}
                variant="destructive"
              >
                {isAwarding ? 'Revirtiendo...' : 'Confirmar reversión'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
