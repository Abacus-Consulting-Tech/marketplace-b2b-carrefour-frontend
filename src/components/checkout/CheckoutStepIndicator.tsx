'use client';

import { Check } from 'lucide-react';

interface CheckoutStepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { number: 1, title: 'Dirección', description: 'Dirección de entrega' },
  { number: 2, title: 'Revisión', description: 'Revisar pedido' },
  { number: 3, title: 'Pago', description: 'Método de pago' },
];

export function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${
                    step.number < currentStep
                      ? 'bg-green-600 border-green-600 text-white'
                      : step.number === currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-4 transition-all ${
                  step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
