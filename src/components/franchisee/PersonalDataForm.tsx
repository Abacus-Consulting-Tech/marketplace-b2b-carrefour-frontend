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
import { useFranchiseeRegistration } from '@/lib/store/franchisee-registration';

const personalDataSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Debes repetir la contraseña'),
  phone: z
    .string()
    .regex(/^(\+?\d{1,3})?[\s\-]?\d{9,12}$/, 'Teléfono inválido. Ej: +34 600123456'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

export function PersonalDataForm() {
  const { formData, updatePersonalData, nextStep } = useFranchiseeRegistration();

  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      password: formData.password || '',
      confirmPassword: formData.password || '',
      phone: formData.phone || '',
    },
  });

  const onSubmit = (data: PersonalDataFormValues) => {
    updatePersonalData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Datos Personales</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Introduce los datos de la persona responsable que gestionará la cuenta de
            franquiciado.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
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
              name="lastName"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="maria.garcia@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir Contraseña *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Repite tu contraseña" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 600 123 456" {...field} />
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
