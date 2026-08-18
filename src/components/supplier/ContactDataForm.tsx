'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSupplierRegistration } from '@/lib/store/supplier-registration';

const contactDataSchema = z.object({
  contactName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  contactSurname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  contactPosition: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z
    .string()
    .regex(
      /^(\+?\d{1,3})?[\s\-]?\d{9,12}$/,
      'Teléfono inválido. Ej: +34 600123456'
    ),
});

type ContactDataFormValues = z.infer<typeof contactDataSchema>;

export function ContactDataForm() {
  const { formData, updateContactData, nextStep, prevStep } = useSupplierRegistration();

  const form = useForm<ContactDataFormValues>({
    resolver: zodResolver(contactDataSchema),
    defaultValues: {
      contactName: formData.contactName || '',
      contactSurname: formData.contactSurname || '',
      contactPosition: formData.contactPosition || '',
      contactEmail: formData.contactEmail || '',
      contactPhone: formData.contactPhone || '',
    },
  });

  const onSubmit = (data: ContactDataFormValues) => {
    updateContactData(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Persona de Contacto</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Introduce los datos de la persona responsable que gestionará la cuenta del proveedor
            en el marketplace.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="María" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactSurname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos *</FormLabel>
                  <FormControl>
                    <Input placeholder="García López" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPosition"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cargo en la Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Directora Comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de Contacto *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="maria.garcia@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de Contacto *</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 600 123 456" {...field} />
                  </FormControl>
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
          <Button type="submit">
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
}
