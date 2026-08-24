'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Save, Upload, FileText, X } from 'lucide-react';
import type { Quote, SupplierInvitation } from '@/types/openings';


const quoteFormSchema = z.object({
  amount: z.number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .max(10000000, 'El monto máximo es 10,000,000 EUR'),
  delivery_days: z.number()
    .min(1, 'Mínimo 1 día')
    .max(365, 'Máximo 365 días')
    .optional(),
  warranty_months: z.number()
    .min(0, 'Mínimo 0 meses')
    .max(120, 'Máximo 120 meses')
    .optional(),
  payment_terms: z.string().max(500, 'Máximo 500 caracteres').optional(),
  notes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  invitation: SupplierInvitation;
  existingQuote?: Quote;
  onSubmit: (data: QuoteFormData, isDraft: boolean, file?: File) => Promise<void>;
  isLoading?: boolean;
}

export function QuoteForm({
  invitation,
  existingQuote,
  onSubmit,
  isLoading = false,
}: QuoteFormProps) {
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [fileError, setFileError] = useState<string>('');

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      amount: existingQuote ? existingQuote.amount / 100 : undefined,
      delivery_days: existingQuote?.delivery_days || 30,
      warranty_months: existingQuote?.warranty_months || 12,
      payment_terms: existingQuote?.payment_terms || '',
      notes: existingQuote?.notes || '',
    },
  });

  // Calculate budget estimate for reference
  const budgetEstimate = invitation.category?.budget_estimate
    ? invitation.category.budget_estimate / 100
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setPdfFile(undefined);
      return;
    }

    // Validar tipo de archivo
    if (file.type !== 'application/pdf') {
      setFileError('Solo se permiten archivos PDF');
      setPdfFile(undefined);
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      setFileError('El archivo no debe superar los 10MB');
      setPdfFile(undefined);
      return;
    }

    setPdfFile(file);
  };

  const handleRemoveFile = () => {
    setPdfFile(undefined);
    setFileError('');
    // Resetear el input file
    const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (data: QuoteFormData, isDraft: boolean) => {
    await onSubmit(data, isDraft, pdfFile);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {existingQuote ? 'Editar Presupuesto' : 'Enviar Presupuesto'}
        </h3>
        <p className="text-sm text-muted-foreground">
          Complete los detalles de su presupuesto para{' '}
          <strong>{invitation.category?.name}</strong>
        </p>
      </div>

      <div className="p-6 pt-0">
        <Form {...form}>
          <form className="space-y-6">
            {/* Budget Reference */}
            {budgetEstimate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Presupuesto estimado:</strong>{' '}
                  {budgetEstimate.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Esta es una referencia. Su presupuesto puede ser diferente.
                </p>
              </div>
            )}

            {/* Amount */
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Importe Total *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="text-lg font-semibold pr-12"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        EUR
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Importe total del presupuesto (IVA incluido)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Days */}
              <FormField
                control={form.control}
                name="delivery_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plazo de Entrega</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? undefined : parseInt(value));
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          días
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Días desde la confirmación del pedido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Warranty Months */}
              <FormField
                control={form.control}
                name="warranty_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantía</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="120"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? undefined : parseInt(value));
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          meses
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Periodo de garantía ofrecido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Terms */}
            <FormField
              control={form.control}
              name="payment_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones de Pago</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: 50% anticipo, 50% a la entrega"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Especifique las condiciones de pago propuestas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre el presupuesto (instalación, transporte, etc.)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalles adicionales sobre su oferta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PDF Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Archivo PDF del Presupuesto
              </label>
              
              {existingQuote?.pdf_url && !pdfFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      Presupuesto actual subido
                    </p>
                    <a
                      href={existingQuote.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:underline"
                    >
                      Ver PDF actual
                    </a>
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                {!pdfFile ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="pdf-file-input"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500"
                      >
                        <span>Seleccionar archivo</span>
                        <input
                          id="pdf-file-input"
                          name="pdf-file"
                          type="file"
                          className="sr-only"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                      </label>
                      <p className="pl-1">o arrastrar aquí</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 mt-2">
                      PDF hasta 10MB
                    </p>
                    {!existingQuote?.pdf_url && (
                      <p className="text-xs leading-5 text-gray-500 mt-1">
                        Opcional - Puede enviar el presupuesto sin archivo PDF
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="text-sm text-red-600">{fileError}</p>
              )}

              <p className="text-sm text-muted-foreground">
                Suba el presupuesto detallado en formato PDF
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit((data) => handleSubmit(data, true))}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Borrador
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit((data) => handleSubmit(data, false))}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar Presupuesto
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              * Los campos marcados con asterisco son obligatorios
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

