'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useFranchiseeRegistration } from '@/lib/store/franchisee-registration';

// Validación IBAN genérica (soporta ES, PT, FR y otros países SEPA):
// 2 letras de país + 2 dígitos de control + 11-30 caracteres alfanuméricos
const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;

// Validación SWIFT/BIC: 8 u 11 caracteres alfanuméricos
const swiftBicRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const financialDataSchema = z.object({
  iban: z
    .string()
    .transform((val) => val.replace(/\s/g, '').toUpperCase())
    .refine((val) => ibanRegex.test(val), 'IBAN inválido. Ej: ES1234567890123456789012'),
  bankHolderName: z.string().min(2, 'El titular de la cuenta es obligatorio'),
  swiftBic: z
    .string()
    .optional()
    .transform((val) => (val ? val.replace(/\s/g, '').toUpperCase() : val))
    .refine((val) => !val || swiftBicRegex.test(val), {
      message: 'Formato SWIFT/BIC inválido. Ej: CAIXESBB',
    }),
});

type FinancialDataFormValues = z.infer<typeof financialDataSchema>;

export function FinancialDataForm() {
  const { formData, updateFinancialData, nextStep, prevStep } = useFranchiseeRegistration();

  const form = useForm<FinancialDataFormValues>({
    resolver: zodResolver(financialDataSchema),
    defaultValues: {
      iban: formData.iban || '',
      bankHolderName: formData.bankHolderName || '',
      swiftBic: formData.swiftBic || '',
    },
  });

  const onSubmit = (data: FinancialDataFormValues) => {
    updateFinancialData(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Datos Financieros</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Estos datos se usarán para las liquidaciones periódicas (no para la cuota de alta,
            que se paga con tarjeta en el siguiente paso).
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN *</FormLabel>
                  <FormControl>
                    <Input placeholder="ES1234567890123456789012" {...field} />
                  </FormControl>
                  <FormDescription>Sin espacios</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titular de la Cuenta *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre igual que en el banco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="swiftBic"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>SWIFT / BIC (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="CAIXESBB" {...field} />
                  </FormControl>
                  <FormDescription>
                    Recomendado si tu cuenta no es española (Portugal, Francia...)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep}>
            Anterior
          </Button>
          <Button type="submit" size="lg">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
}
