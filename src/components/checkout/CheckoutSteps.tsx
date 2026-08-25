/**
 * Checkout Steps Component - Marketplace B2B Carrefour
 * 
 * Visual stepper para el proceso de checkout
 * Muestra los 3 pasos: Dirección → Pago → Revisión
 */

'use client'

import { Check } from 'lucide-react'
import type { CheckoutStep } from '@/types/checkout'

interface Step {
  id: CheckoutStep
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    id: 'address',
    title: 'Dirección de envío',
    description: 'Dónde quieres recibir tu pedido',
  },
  {
    id: 'payment',
    title: 'Método de pago',
    description: 'Cómo quieres pagar',
  },
  {
    id: 'review',
    title: 'Revisar pedido',
    description: 'Confirma los detalles',
  },
]

interface CheckoutStepsProps {
  currentStep: CheckoutStep
  completedSteps: CheckoutStep[]
  onStepClick?: (step: CheckoutStep) => void
}

export function CheckoutSteps({
  currentStep,
  completedSteps,
  onStepClick,
}: CheckoutStepsProps) {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  const isStepCompleted = (stepId: CheckoutStep) => {
    return completedSteps.includes(stepId)
  }

  const isStepCurrent = (stepId: CheckoutStep) => {
    return stepId === currentStep
  }

  const isStepClickable = (stepId: CheckoutStep) => {
    return isStepCompleted(stepId) || isStepCurrent(stepId)
  }

  const handleStepClick = (step: Step) => {
    if (isStepClickable(step.id) && onStepClick) {
      onStepClick(step.id)
    }
  }

  return (
    <nav aria-label="Progreso del checkout">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const completed = isStepCompleted(step.id)
          const current = isStepCurrent(step.id)
          const clickable = isStepClickable(step.id)

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center"
            >
              {/* Step Button */}
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={!clickable}
                className={`
                  group flex w-full items-center gap-3
                  ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                      ${completed
                        ? 'border-green-600 bg-green-600 text-white'
                        : current
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                      }
                      ${clickable && !current && 'group-hover:border-blue-400'}
                    `}
                  >
                    {completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Step Info */}
                <div className="flex flex-col items-start text-left">
                  <span
                    className={`
                      text-sm font-medium
                      ${current ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {step.description}
                  </span>
                </div>
              </button>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    ml-4 h-0.5 flex-1 transition-colors
                    ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
