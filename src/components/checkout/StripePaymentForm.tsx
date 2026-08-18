"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { createPaymentCollection } from "@/lib/api/mercur-store-client";

// TODO: Uncomment after installing @stripe/stripe-js and @stripe/react-stripe-js
// import { loadStripe, Stripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  cartId: string;
  onComplete: () => void;
  onBack: () => void;
}

// Placeholder component until Stripe is installed
function StripePaymentFormContent({
  cartId,
  onComplete,
  onBack,
}: StripePaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [paymentReady, setPaymentReady] = useState(false);

  // TODO: Uncomment after Stripe is installed
  // const stripe = useStripe();
  // const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with actual Stripe logic after installation
    setError("Stripe aún no está configurado. Por favor, instala las dependencias primero.");
    
    /* 
    // Actual implementation after Stripe is installed:
    
    if (!stripe || !elements) {
      setError("Stripe no está cargado correctamente");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      // 1. Create payment collection to get client_secret
      const paymentCollection = await createPaymentCollection({
        cart_id: cartId,
        provider_id: "stripe",
      });

      const clientSecret = paymentCollection.payment_sessions[0]?.data?.client_secret;

      if (!clientSecret) {
        throw new Error("No se pudo obtener el client_secret");
      }

      // 2. Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element no encontrado");
        return;
      }

      // 3. Confirm payment with Stripe
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

      if (paymentIntent.status === "succeeded") {
        // Payment successful, move to next step
        onComplete();
      } else {
        setError("El pago no se pudo completar. Por favor, intenta de nuevo.");
      }
    } catch (err: any) {
      console.error("Error processing payment:", err);
      setError(err.message || "Error al procesar el pago");
    } finally {
      setProcessing(false);
    }
    */
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
            {/* TODO: Replace with actual CardElement after Stripe is installed */}
            {/*
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
            */}

            {/* Placeholder until Stripe is installed */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">
                Formulario de Pago Stripe
              </p>
              <p className="text-sm text-gray-500">
                Instala las dependencias de Stripe para habilitar el pago
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                npm install @stripe/stripe-js @stripe/react-stripe-js
              </code>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            🔒 Tu información de pago está segura y encriptada con Stripe
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
        <Button type="submit" disabled={processing || !paymentReady}>
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            "Pagar Ahora"
          )}
        </Button>
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  // TODO: Uncomment after installing Stripe
  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
  // );

  // return (
  //   <Elements stripe={stripePromise}>
  //     <StripePaymentFormContent {...props} />
  //   </Elements>
  // );

  // Temporary: return form directly without Elements wrapper
  return <StripePaymentFormContent {...props} />;
}
