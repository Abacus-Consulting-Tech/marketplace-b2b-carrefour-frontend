'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              'relative flex flex-col items-center',
              stepIdx !== steps.length - 1 ? 'flex-1' : ''
            )}
          >
            {/* Connector line */}
            {stepIdx !== steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-1/2 top-5 h-0.5 w-full',
                  stepIdx < currentStep
                    ? 'bg-primary'
                    : 'bg-gray-200'
                )}
                aria-hidden="true"
              />
            )}

            {/* Step circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  stepIdx < currentStep
                    ? 'border-primary bg-primary text-white'
                    : stepIdx === currentStep
                    ? 'border-primary bg-white text-primary'
                    : 'border-gray-300 bg-white text-gray-500'
                )}
              >
                {stepIdx < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
            </div>

            {/* Step label */}
            <div className="mt-3 text-center">
              <p
                className={cn(
                  'text-sm font-medium',
                  stepIdx <= currentStep
                    ? 'text-primary'
                    : 'text-gray-500'
                )}
              >
                {step.name}
              </p>
              <p className="hidden sm:block text-xs text-gray-500 mt-1">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
