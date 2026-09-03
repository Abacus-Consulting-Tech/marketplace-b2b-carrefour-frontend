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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFranchiseeRegistration } from '@/lib/store/franchisee-registration';

// Validación NIF/CIF español
const nifCifRegex = /^([0-9]{8}[A-Za-z]|[A-HJ-NP-SUVW][0-9]{7}[0-9A-J])$/;

const companyDataSchema = z.object({
  companyName: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
  taxId: z
    .string()
    .regex(nifCifRegex, 'Introduce un NIF (12345678Z) o CIF (B12345678) válido, sin espacios'),
  fiscalAddress: z.string().min(10, 'La dirección fiscal debe ser completa'),
  municipality: z.string().min(2, 'El municipio es obligatorio'),
  postalCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  country: z.string().min(2, 'Selecciona un país'),
});

type CompanyDataFormValues = z.infer<typeof companyDataSchema>;

export function CompanyDataForm() {
  const { formData, updateCompanyData, nextStep, prevStep } = useFranchiseeRegistration();

  const form = useForm<CompanyDataFormValues>({
    resolver: zodResolver(companyDataSchema),
    defaultValues: {
      companyName: formData.companyName || '',
      taxId: formData.taxId || '',
      fiscalAddress: formData.fiscalAddress || '',
      municipality: formData.municipality || '',
      postalCode: formData.postalCode || '',
      country: formData.country || 'España',
    },
  });

  const onSubmit = (data: CompanyDataFormValues) => {
    updateCompanyData(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Datos de la Empresa</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Carrefour Express Barcelona Sur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF / CIF *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: B12345678 o 12345678Z" {...field} />
                  </FormControl>
                  <FormDescription>Sin espacios ni guiones</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Dirección Fiscal</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="fiscalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección Completa *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Calle, número, piso, puerta..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipio *</FormLabel>
                    <FormControl>
                      <Input placeholder="Madrid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal *</FormLabel>
                    <FormControl>
                      <Input placeholder="28001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="España">España</SelectItem>
                        <SelectItem value="Portugal">Portugal</SelectItem>
                        <SelectItem value="Francia">Francia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
