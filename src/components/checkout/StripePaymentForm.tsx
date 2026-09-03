"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { createPaymentCollection } from "@/lib/api/mercur-store-client";
import { featureFlags } from "@/config/feature-flags";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  cartId: string;
  onComplete: () => void;
  onBack: () => void;
}

function StripePaymentFormContent({
  cartId,
  onComplete,
  onBack,
}: StripePaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [paymentReady, setPaymentReady] = useState(false);
  const isMockCheckout = featureFlags.getCheckoutSource() === "mock";

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isMockCheckout) {
      try {
        setProcessing(true);
        setError("");
        await new Promise(resolve => setTimeout(resolve, 1200));
        onComplete();
      } catch (err) {
        const mockError = err as { message?: string };
        setError(mockError.message || "Error al simular el pago");
      } finally {
        setProcessing(false);
      }
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe no está cargado correctamente");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const paymentCollection = await createPaymentCollection({
        cart_id: cartId,
        provider_id: "stripe",
      });

      const clientSecret = paymentCollection.payment_sessions[0]?.data?.client_secret;

      if (!clientSecret) {
        throw new Error("No se pudo obtener el client_secret");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element no encontrado");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Error al procesar el pago");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onComplete();
        return;
      }

      setError("El pago no se pudo completar. Por favor, intenta de nuevo.");
    } catch (err) {
      const error = err as { message?: string };
      console.error("Error processing payment:", error);
      setError(error.message || "Error al procesar el pago");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Información de Pago
        </h3>

        <Card>
          <CardContent className="p-6">
            {isMockCheckout ? (
              <div className="space-y-3 text-sm text-slate-700">
                <p>Modo mock activo: el pago con tarjeta se simulará para validar la experiencia de checkout.</p>
                <p className="text-slate-500">Cuando el checkout real esté habilitado, aquí se cargará Stripe Elements con la tarjeta real.</p>
              </div>
            ) : (
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
                onChange={(event) => {
                  setPaymentReady(event.complete);
                  if (event.error) {
                    setError(event.error.message);
                  } else {
                    setError("");
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            {isMockCheckout
              ? "El pedido quedará en confirmación simulada para validar el flujo frontend."
              : "Tu información de pago está segura y encriptada con Stripe. La confirmación final del pedido depende del webhook backend."}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          Atrás
        </Button>
        <Button type="submit" disabled={processing || (!isMockCheckout && !paymentReady)}>
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            "Pagar y enviar pedido"
          )}
        </Button>
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const isMockCheckout = featureFlags.getCheckoutSource() === "mock";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (isMockCheckout) {
    return <StripePaymentFormContent {...props} />;
  }

  if (!publishableKey) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Falta la clave pública de Stripe para completar el checkout real.</AlertDescription>
      </Alert>
    );
  }

  const stripePromise = loadStripe(publishableKey);

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormContent {...props} />
    </Elements>
  );
}
