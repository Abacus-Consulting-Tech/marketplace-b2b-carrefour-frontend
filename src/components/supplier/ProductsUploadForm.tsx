'use client';

import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupplierRegistration } from '@/lib/store/supplier-registration';

export function ProductsUploadForm() {
  const { formData, prevStep, submit, status, error } = useSupplierRegistration();

  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revisa tu solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-medium">Empresa</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Nombre comercial</dt>
                  <dd>{formData.businessName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Razón social</dt>
                  <dd>{formData.legalName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">NIF/CIF</dt>
                  <dd>{formData.nifCif}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{formData.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd>{formData.phone}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-medium">Contacto principal</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Nombre</dt>
                  <dd>
                    {formData.contactName} {formData.contactSurname}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cargo</dt>
                  <dd>{formData.contactPosition}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{formData.contactEmail}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd>{formData.contactPhone}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-medium">Qué pasa después</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Tu solicitud quedará pendiente de revisión por el equipo administrador.</li>
              <li>Si se aprueba, recibirás un email para activar tus credenciales.</li>
              <li>La subida del catálogo y las imágenes se hará después de la aprobación.</li>
            </ul>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={status === 'submitting'} size="lg">
              <Send className="mr-2 h-4 w-4" />
              {status === 'submitting' ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          <div className="text-sm text-green-900">
            <p className="font-medium">Alta operativa después de la aprobación</p>
            <p className="mt-1">
              El acceso al portal de proveedor y la subida de productos se habilitarán cuando tu
              solicitud haya sido validada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
