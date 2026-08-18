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
import { useSupplierRegistration } from '@/lib/store/supplier-registration';

// Validación NIF/CIF español
const nifCifRegex = /^([0-9]{8}[A-Za-z]|[A-HJ-NP-SUVW][0-9]{7}[0-9A-J])$/;

// Validación IBAN español
const ibanEsRegex = /^ES\d{22}$/;

const legalDataSchema = z.object({
  businessName: z.string().min(2, 'El nombre comercial debe tener al menos 2 caracteres'),
  legalName: z.string().min(2, 'La razón social debe tener al menos 2 caracteres'),
  nifCif: z
    .string()
    .regex(nifCifRegex, 'Introduce un NIF (12345678Z) o CIF (B12345678) válido, sin espacios'),
  fiscalAddress: z.string().min(10, 'La dirección fiscal debe ser completa'),
  municipality: z.string().min(2, 'El municipio es obligatorio'),
  postalCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  country: z.string().min(2, 'Selecciona un país'),
  iban: z
    .string()
    .regex(ibanEsRegex, 'Formato IBAN ES: ES + 22 dígitos (sin espacios)')
    .transform((val) => val.replace(/\s/g, '')), // Eliminar espacios
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .regex(
      /^(\+?\d{1,3})?[\s\-]?\d{9,12}$/,
      'Teléfono inválido. Ej: +34 600123456'
    ),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
});

type LegalDataFormValues = z.infer<typeof legalDataSchema>;

export function LegalDataForm() {
  const { formData, updateLegalData, nextStep } = useSupplierRegistration();

  const form = useForm<LegalDataFormValues>({
    resolver: zodResolver(legalDataSchema),
    defaultValues: {
      businessName: formData.businessName || '',
      legalName: formData.legalName || '',
      nifCif: formData.nifCif || '',
      fiscalAddress: formData.fiscalAddress || '',
      municipality: formData.municipality || '',
      postalCode: formData.postalCode || '',
      country: formData.country || 'España',
      iban: formData.iban || '',
      email: formData.email || '',
      phone: formData.phone || '',
      website: formData.website || '',
    },
  });

  const onSubmit = (data: LegalDataFormValues) => {
    updateLegalData(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Información de la Empresa</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Comercial *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Infoqus Aliado Empresarial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Infoqus Aliado Empresarial, S.L." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nifCif"
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email General *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="info@empresa.com" {...field} />
                  </FormControl>
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

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Datos Bancarios y Contacto</h3>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Principal *</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 600 123 456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Sitio Web (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
}
