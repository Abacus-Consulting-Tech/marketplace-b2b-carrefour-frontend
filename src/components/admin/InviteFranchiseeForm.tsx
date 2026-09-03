'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { FranchiseeInvitation } from '@/types/franchisees';
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
import { ArrowLeft, Send, CheckCircle2, Copy } from 'lucide-react';

const inviteSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteFranchiseeForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<FranchiseeInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data: InviteFormValues) => {
    try {
      setSending(true);
      setError(null);

      const response = await franchiseesApi.inviteFranchisee(data);

      if (response.data?.invitation) {
        setInvitation(response.data.invitation);
      }
    } catch (err) {
      console.error('Error inviting franchisee:', err);
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

  const handleInviteAnother = () => {
    setInvitation(null);
    form.reset();
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/franchisees">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Invitar Franquiciado</h1>
          <p className="text-muted-foreground mt-1">
            Solo el nombre y el email — el franquiciado rellenará el resto de sus datos
          </p>
        </div>
      </div>

      {invitation ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle>Invitación enviada</CardTitle>
            </div>
            <CardDescription>
              Se ha simulado el envío de un email a <strong>{invitation.email}</strong> con el
              enlace de registro. Como aún no hay servicio de email real, aquí tienes el enlace
              por si quieres enviarlo tú mismo:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={invitation.registrationUrl} className="font-mono text-xs" />
              <Button type="button" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleInviteAnother}>Invitar a otro franquiciado</Button>
              <Link href="/admin/franchisees">
                <Button variant="outline">Volver al Listado</Button>
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
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="María García" {...field} />
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

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={sending}>
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Enviando...' : 'Enviar Invitación'}
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
