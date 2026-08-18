'use client';

import { useSupplierRegistration } from '@/lib/store/supplier-registration';
import { SupplierStepIndicator } from '@/components/supplier/SupplierStepIndicator';
import { LegalDataForm } from '@/components/supplier/LegalDataForm';
import { ContactDataForm } from '@/components/supplier/ContactDataForm';
import { ProductsUploadForm } from '@/components/supplier/ProductsUploadForm';

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
    name: 'Productos',
    description: 'Catálogo e imágenes',
  },
];

export default function SupplierRegisterPage() {
  const { currentStep } = useSupplierRegistration();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Registro de Proveedor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Completa el proceso de registro para formar parte del marketplace B2B Carrefour
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
