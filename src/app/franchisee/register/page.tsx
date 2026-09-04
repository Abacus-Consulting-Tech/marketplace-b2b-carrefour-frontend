'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useFranchiseeRegistration } from '@/lib/store/franchisee-registration';
import { SupplierStepIndicator } from '@/components/supplier/SupplierStepIndicator';
import { PersonalDataForm } from '@/components/franchisee/PersonalDataForm';
import { CompanyDataForm } from '@/components/franchisee/CompanyDataForm';
import { PaymentForm } from '@/components/franchisee/PaymentForm';
import { Button } from '@/components/ui/button';
import { isFranchiseeBillingEnabled } from '@/lib/config/franchisee-billing';

const billingEnabled = isFranchiseeBillingEnabled;

const steps = billingEnabled
  ? [
      {
        id: 1,
        name: 'Datos Personales',
        description: 'Persona responsable',
      },
      {
        id: 2,
        name: 'Datos de la Empresa',
        description: 'Información fiscal',
      },
      {
        id: 3,
        name: 'Pago',
        description: 'Suscripción',
      },
    ]
  : [
      {
        id: 1,
        name: 'Datos Personales',
        description: 'Persona responsable',
      },
      {
        id: 2,
        name: 'Datos de la Empresa',
        description: 'Información fiscal',
      },
    ];

function FranchiseeRegisterContent() {
  const searchParams = useSearchParams();
  const { currentStep, status, result, applyInvitationPrefill } = useFranchiseeRegistration();
  const invitationToken = searchParams.get('token') || searchParams.get('invitationToken') || '';

  useEffect(() => {
    applyInvitationPrefill({
      firstName: searchParams.get('invited_name') || undefined,
      email: searchParams.get('invited_email') || undefined,
      invitationToken: invitationToken || undefined,
    });
  }, [applyInvitationPrefill, invitationToken, searchParams]);

  if (!invitationToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Invitación no válida</h1>
          <p className="mt-3 text-muted-foreground">
            Necesitas abrir el enlace de invitación completo para continuar con el alta.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'submitted' && result) {
    const hasSubscriptionInfo =
      !!result.metadata.subscription_status || !!result.metadata.current_period_end;
    const displayName = result.first_name || result.contact_person || result.name || result.email;
    const displayCompany = result.company_name || result.metadata.company_name || result.name || '-';
    const displayStatus = result.status || result.metadata.status || 'pending_approval';

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Solicitud enviada</h1>
          <p className="mt-2 text-muted-foreground">
            Gracias, {displayName}. Tu solicitud para{' '}
            <strong>{displayCompany}</strong> está en revisión. Te avisaremos por
            email en cuanto un administrador la apruebe.
          </p>
          {hasSubscriptionInfo && (
            <p className="mt-3 text-sm text-muted-foreground">
              Suscripción:{' '}
              <span className="font-medium">{result.metadata.subscription_status || 'pending'}</span>
              {' '}· Próxima renovación:{' '}
              <span className="font-medium">
                {result.metadata.current_period_end
                  ? new Date(result.metadata.current_period_end).toLocaleDateString('es-ES')
                  : '-'}
              </span>
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Estado: <span className="font-medium">{displayStatus}</span> · Referencia:{' '}
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
          <h1 className="text-3xl font-bold tracking-tight">Registro de Franquiciado</h1>
          <p className="mt-2 text-muted-foreground">
            Completa tus datos para solicitar el alta como franquiciado en el marketplace B2B
            Carrefour.
          </p>
        </div>

        {/* Step Indicator */}
        <SupplierStepIndicator currentStep={currentStep} steps={steps} />

        {/* Forms */}
        <div className="mt-8">
          {currentStep === 0 && <PersonalDataForm />}
          {currentStep === 1 && <CompanyDataForm />}
          {billingEnabled && currentStep === 2 && <PaymentForm />}
        </div>
      </div>
    </div>
  );
}

function FranchiseeRegisterFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Registro de Franquiciado</h1>
          <p className="mt-2 text-muted-foreground">
            Cargando formulario de alta...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FranchiseeRegisterPage() {
  return (
    <Suspense fallback={<FranchiseeRegisterFallback />}>
      <FranchiseeRegisterContent />
    </Suspense>
  );
}
