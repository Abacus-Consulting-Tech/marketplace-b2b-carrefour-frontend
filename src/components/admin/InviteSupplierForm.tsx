'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supplierRegistrationApi } from '@/lib/api/supplier-registration-client';
import type { SupplierInvitation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, CheckCircle2, Copy, Send } from 'lucide-react';

const inviteSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteSupplierForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<SupplierInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data: InviteFormValues) => {
    try {
      setSending(true);
      setError(null);
      const response = await supplierRegistrationApi.inviteSupplier(data.name, data.email);
      setInvitation(response.invitation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la invitación');
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    if (!invitation) return;
    await navigator.clipboard.writeText(invitation.registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/suppliers">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Invitar Proveedor</h1>
          <p className="mt-1 text-muted-foreground">
            Solo nombre y email. El proveedor completará su solicitud después.
          </p>
        </div>
      </div>

      {invitation ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle>Invitación preparada</CardTitle>
            </div>
            <CardDescription>
              Se ha generado el enlace para <strong>{invitation.email}</strong>. Mientras no haya
              servicio de email real, puedes copiarlo y enviarlo manualmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={invitation.registrationUrl} className="font-mono text-xs" />
              <Button type="button" variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setInvitation(null); form.reset(); }}>Invitar a otro proveedor</Button>
              <Link href="/admin/suppliers">
                <Button variant="outline">Volver al listado</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Datos de la invitación</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Distribuciones Ejemplo S.L." {...field} />
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
                        <Input type="email" placeholder="contacto@proveedor.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={sending}>
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? 'Enviando...' : 'Enviar invitación'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}