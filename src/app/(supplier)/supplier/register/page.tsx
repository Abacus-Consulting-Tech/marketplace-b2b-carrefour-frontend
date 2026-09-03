'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useSupplierRegistration } from '@/lib/store/supplier-registration';
import { SupplierStepIndicator } from '@/components/supplier/SupplierStepIndicator';
import { LegalDataForm } from '@/components/supplier/LegalDataForm';
import { ContactDataForm } from '@/components/supplier/ContactDataForm';
import { ProductsUploadForm } from '@/components/supplier/ProductsUploadForm';
import { Button } from '@/components/ui/button';

const steps = [
  {
    id: 1,
    name: 'Datos Legales',
    description: 'Información de la empresa',
  },
  {
    id: 2,
    name: 'Contacto',
    description: 'Persona responsable',
  },
  {
    id: 3,
    name: 'Revisión',
    description: 'Confirmar solicitud',
  },
];

function SupplierRegisterContent() {
  const searchParams = useSearchParams();
  const { currentStep, status, result, applyInvitationPrefill } = useSupplierRegistration();

  useEffect(() => {
    applyInvitationPrefill({
      name: searchParams.get('invited_name') || undefined,
      email: searchParams.get('invited_email') || undefined,
    });
  }, [applyInvitationPrefill, searchParams]);

  if (status === 'submitted' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Solicitud enviada</h1>
          <p className="mt-2 text-muted-foreground">
            Gracias. La solicitud de <strong>{result.businessName}</strong> ya está en revisión.
            Cuando el equipo la apruebe, enviaremos un email a <strong>{result.contactEmail}</strong>{' '}
            para activar el acceso.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Estado: <span className="font-medium">{result.metadata?.onboarding_status}</span> · Referencia:{' '}
            {result.id}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">Ir al inicio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Registro de Proveedor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Completa tu solicitud para formar parte del marketplace B2B Carrefour.
            Revisaremos tus datos antes de activar el acceso al portal de proveedor.
          </p>
        </div>

        {/* Step Indicator */}
        <SupplierStepIndicator currentStep={currentStep} steps={steps} />

        {/* Forms */}
        <div className="mt-8">
          {currentStep === 0 && <LegalDataForm />}
          {currentStep === 1 && <ContactDataForm />}
          {currentStep === 2 && <ProductsUploadForm />}
        </div>
      </div>
    </div>
  );
}

function SupplierRegisterFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Registro de Proveedor</h1>
          <p className="mt-2 text-muted-foreground">Cargando formulario de alta...</p>
        </div>
      </div>
    </div>
  );
}

export default function SupplierRegisterPage() {
  return (
    <Suspense fallback={<SupplierRegisterFallback />}>
      <SupplierRegisterContent />
    </Suspense>
  );
}
