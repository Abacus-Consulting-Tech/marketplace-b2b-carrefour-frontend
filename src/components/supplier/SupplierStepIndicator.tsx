'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface SupplierStepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function SupplierStepIndicator({ currentStep, steps }: SupplierStepIndicatorProps) {
  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;

            return (
              <li key={step.id} className="md:flex-1">
                {isCompleted ? (
                  <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-primary">
                      Paso {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : isCurrent ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-primary">
                      Paso {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500">
                      Paso {step.id}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Mobile progress indicator */}
      <div className="mt-4 md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Paso {currentStep + 1} de {steps.length}
          </span>
          <span className="text-gray-500">{steps[currentStep].description}</span>
        </div>
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
