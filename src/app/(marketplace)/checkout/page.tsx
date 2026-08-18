"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import ShippingMethodSelector from "@/components/checkout/ShippingMethodSelector";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import OrderReview from "@/components/checkout/OrderReview";
import { updateCart, addShippingMethod, createCart } from "@/lib/api/mercur-store-client";
import { useToast } from "@/hooks/use-toast";

type CheckoutStep = "shipping" | "delivery" | "payment" | "review";

interface ShippingAddress {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

const steps: { id: CheckoutStep; label: string; description: string }[] = [
  { id: "shipping", label: "Dirección de Envío", description: "Información de entrega" },
  { id: "delivery", label: "Método de Envío", description: "Opciones de entrega" },
  { id: "payment", label: "Pago", description: "Información de pago" },
  { id: "review", label: "Revisar", description: "Confirmar pedido" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, getTotal, cartId, setCartId, syncMercurCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/marketplace");
    }
  }, [items, router]);

  // Ensure we have a cart ID
  useEffect(() => {
    const ensureCart = async () => {
      if (!cartId) {
        try {
          const cart = await createCart({
            region_id: process.env.NEXT_PUBLIC_MERCUR_REGION_ID,
          });
          setCartId(cart.id);
        } catch (error) {
          console.error("Error creating cart:", error);
          toast({
            title: "Error",
            description: "No se pudo iniciar el checkout",
            variant: "destructive",
          });
        }
      }
    };
    ensureCart();
  }, [cartId, setCartId, toast]);

  if (items.length === 0) {
    return null;
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleShippingAddressComplete = async (address: ShippingAddress) => {
    if (!cartId) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la dirección de envío",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await updateCart(cartId, {
        email: address.email,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone,
        },
      });

      setShippingAddress(address);
      setCurrentStep("delivery");
      toast({
        title: "Dirección guardada",
        description: "Dirección de envío actualizada correctamente",
      });
    } catch (error) {
      console.error("Error updating shipping address:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la dirección de envío",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShippingMethodComplete = async (optionId: string) => {
    if (!cartId) {
      toast({
        title: "Error",
        description: "No se pudo seleccionar el método de envío",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const updatedCart = await addShippingMethod(cartId, optionId);

      // Find the selected shipping method from the cart
      const method = updatedCart.shipping_methods?.[0];
      if (method) {
        setSelectedShippingMethod({
          id: method.id,
          name: "Método de envío", // TODO: Get actual name from shipping options
          price: method.amount,
        });
      }

      setCurrentStep("payment");
      toast({
        title: "Método de envío seleccionado",
        description: "Método de envío actualizado correctamente",
      });
    } catch (error) {
      console.error("Error selecting shipping method:", error);
      toast({
        title: "Error",
        description: "No se pudo seleccionar el método de envío",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep("review");
  };

  const handleOrderSuccess = (orderId: string) => {
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const subtotal = getTotal();
  const shippingCost = selectedShippingMethod?.price || 0;
  const tax = Math.round(subtotal * 0.21); // 21% IVA
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex-1 relative">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isActive
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Circle
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-4
                        ${isCompleted ? "bg-green-500" : "bg-gray-300"}
                      `}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStepIndex].label}</CardTitle>
              <CardDescription>{steps[currentStepIndex].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step Content */}
              {currentStep === "shipping" && (
                <ShippingAddressForm
                  onComplete={handleShippingAddressComplete}
                  initialData={shippingAddress || undefined}
                />
              )}

              {currentStep === "delivery" && cartId && (
                <ShippingMethodSelector
                  cartId={cartId}
                  onComplete={handleShippingMethodComplete}
                  onBack={goToPreviousStep}
                />
              )}

              {currentStep === "payment" && cartId && (
                <StripePaymentForm
                  cartId={cartId}
                  onComplete={handlePaymentComplete}
                  onBack={goToPreviousStep}
                />
              )}

              {currentStep === "review" && cartId && shippingAddress && selectedShippingMethod && (
                <OrderReview
                  cartId={cartId}
                  items={items}
                  shippingAddress={shippingAddress}
                  shippingMethod={selectedShippingMethod}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  tax={tax}
                  total={total}
                  onBack={goToPreviousStep}
                  onSuccess={handleOrderSuccess}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Products */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        €{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">€{(subtotal / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Envío</p>
                    <p className="font-medium">
                      {shippingCost === 0
                        ? "Por calcular"
                        : `€${(shippingCost / 100).toFixed(2)}`}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">IVA (incluido)</p>
                    <p className="font-medium">€{(tax / 100).toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-lg font-bold">€{(total / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
