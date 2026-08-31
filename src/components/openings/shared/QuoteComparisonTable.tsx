/**
 * Tabla de Comparación de Presupuestos
 * 
 * Muestra presupuestos lado a lado para facilitar la comparación.
 */

import React from 'react';
import type { QuoteComparisonData } from '@/types/openings';
import { formatCurrency, QUOTE_STATUS_LABELS } from '@/types/openings';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

interface QuoteComparisonTableProps {
  data: QuoteComparisonData;
  onSelectQuote?: (quoteId: string) => void;
  onViewQuote?: (quoteId: string) => void;
  canSelectQuote?: boolean;
}

export function QuoteComparisonTable({
  data,
  onSelectQuote,
  onViewQuote,
  canSelectQuote = false,
}: QuoteComparisonTableProps) {
  const { quotes } = data;

  // Ordenar por precio (más bajo primero)
  const sortedQuotes = [...quotes].sort((a, b) => a.amount - b.amount);

  // Encontrar el presupuesto con mejor precio
  const bestPriceQuoteId = sortedQuotes[0]?.id;

  // Encontrar el presupuesto adjudicado
  const awardedQuote = quotes.find((q) => q.status === 'awarded');

  return (
    <div className="space-y-4">
      {/* Información de la categoría */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="font-semibold text-lg">{data.category_name}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{quotes.length} presupuestos recibidos</p>
          {awardedQuote && (
            <Badge className="mt-1 bg-green-600 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Adjudicado
            </Badge>
          )}
        </div>
      </div>

      {/* Tabla de comparación */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Entrega</TableHead>
              <TableHead className="text-center">Garantía</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No hay presupuestos disponibles
                </TableCell>
              </TableRow>
            ) : (
              sortedQuotes.map((quote) => {
                const isBestPrice = quote.id === bestPriceQuoteId;
                const isAwarded = quote.status === 'awarded';
                const isRejected = quote.status === 'rejected';

                return (
                  <TableRow
                    key={quote.id}
                    className={
                      isAwarded
                        ? 'bg-green-50'
                        : isRejected
                        ? 'bg-gray-50 opacity-60'
                        : isBestPrice
                        ? 'bg-yellow-50'
                        : ''
                    }
                  >
                    {/* Proveedor */}
                    <TableCell>
                      <div>
                        <p className="font-medium">{quote.supplier.name}</p>
                        <p className="text-xs text-gray-500">{quote.supplier.email}</p>
                      </div>
                    </TableCell>

                    {/* Precio */}
                    <TableCell className="text-right">
                      <div>
                        <p className="font-semibold text-lg">
                          {formatCurrency(quote.amount)}
                        </p>
                        {isBestPrice && !isAwarded && (
                          <Badge variant="outline" className="text-xs bg-yellow-100">
                            Mejor precio
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Entrega */}
                    <TableCell className="text-center">
                      {quote.delivery_days ? (
                        <span>{quote.delivery_days} días</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Garantía */}
                    <TableCell className="text-center">
                      {quote.warranty_months ? (
                        <span>{quote.warranty_months} meses</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Estado */}
                    <TableCell className="text-center">
                      {isAwarded ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {QUOTE_STATUS_LABELS[quote.status]}
                        </Badge>
                      ) : isRejected ? (
                        <Badge variant="outline" className="text-gray-500">
                          <XCircle className="w-3 h-3 mr-1" />
                          {QUOTE_STATUS_LABELS[quote.status]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">{QUOTE_STATUS_LABELS[quote.status]}</Badge>
                      )}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Ver PDF */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewQuote?.(quote.id)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Ver PDF
                        </Button>

                        {/* Seleccionar (solo si está habilitado y no rechazado) */}
                        {canSelectQuote && !isAwarded && !isRejected && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => onSelectQuote?.(quote.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Seleccionar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resumen de diferencias */}
      {quotes.length > 1 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Análisis de Precios</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Precio más bajo</p>
              <p className="font-semibold text-lg">
                {formatCurrency(Math.min(...quotes.map((q) => q.amount)))}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Precio más alto</p>
              <p className="font-semibold text-lg">
                {formatCurrency(Math.max(...quotes.map((q) => q.amount)))}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Diferencia</p>
              <p className="font-semibold text-lg text-blue-600">
                {formatCurrency(
                  Math.max(...quotes.map((q) => q.amount)) -
                    Math.min(...quotes.map((q) => q.amount))
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
