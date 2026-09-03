'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFranchiseeRegistration } from '@/lib/store/franchisee-registration';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const elementStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const { formData, prevStep, submit, updatePaymentData, status, error: submitError } =
    useFranchiseeRegistration();

  const [cardHolderName, setCardHolderName] = useState(
    formData.cardHolderName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [fieldsComplete, setFieldsComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const isProcessing = status === 'submitting';
  const isCardComplete = fieldsComplete.number && fieldsComplete.expiry && fieldsComplete.cvc;
  const canSubmit = isCardComplete && cardHolderName.trim().length >= 2 && acceptedTerms;

  const handleElementChange =
    (field: keyof typeof fieldsComplete) =>
    (event: { complete: boolean; error?: { message: string } }) => {
      setFieldsComplete((prev) => ({ ...prev, [field]: event.complete }));
      if (event.error) {
        setCardError(event.error.message);
      } else {
        setCardError(null);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setCardError('Stripe no está cargado correctamente');
      return;
    }

    if (!canSubmit) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setCardError('No se encuentra el campo de tarjeta');
      return;
    }

    setCardError(null);
    updatePaymentData({ cardHolderName: cardHolderName.trim() });

    // Tokeniza la tarjeta directamente con Stripe (no requiere backend).
    // La creación real del cargo/PaymentIntent para la cuota de alta
    // todavía depende de backend (ver FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md).
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: cardHolderName.trim(),
        email: formData.email,
      },
    });

    if (error || !paymentMethod) {
      setCardError(error?.message || 'No se pudo validar la tarjeta');
      return;
    }

    await submit(paymentMethod.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-1 text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Cuota de Alta
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Solo se acepta tarjeta de crédito. El pago se procesa de forma segura con Stripe.
        </p>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Nombre del Titular de la Tarjeta *</Label>
              <Input
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="Nombre igual que en la tarjeta"
              />
            </div>

            <div className="space-y-2">
              <Label>Número de Tarjeta *</Label>
              <div className="rounded-md border px-3 py-2">
                <CardNumberElement options={elementStyle} onChange={handleElementChange('number')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Caducidad *</Label>
                <div className="rounded-md border px-3 py-2">
                  <CardExpiryElement options={elementStyle} onChange={handleElementChange('expiry')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>CVC *</Label>
                <div className="rounded-md border px-3 py-2">
                  <CardCvcElement options={elementStyle} onChange={handleElementChange('cvc')} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            🔒 Tu información de pago está segura y encriptada con Stripe
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2">
          <Checkbox
            id="accept-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <Label htmlFor="accept-terms" className="text-sm font-normal leading-snug">
            Acepto los términos y condiciones y la política de privacidad del marketplace B2B
            Carrefour *
          </Label>
        </div>
      </div>

      {(cardError || (status === 'error' && submitError)) && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{cardError || submitError}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={isProcessing}>
          Anterior
        </Button>
        <Button type="submit" size="lg" disabled={!canSubmit || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando pago...
            </>
          ) : (
            'Pagar y Enviar Solicitud'
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent />
    </Elements>
  );
}
