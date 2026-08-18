"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Package, Truck, Zap } from "lucide-react";
import { listShippingOptions } from "@/lib/api/mercur-store-client";
import type { MercurShippingOption } from "@/lib/api/mercur-store-client";

interface ShippingMethodSelectorProps {
  cartId: string;
  onComplete: (optionId: string) => void;
  onBack: () => void;
}

export default function ShippingMethodSelector({
  cartId,
  onComplete,
  onBack,
}: ShippingMethodSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [shippingOptions, setShippingOptions] = useState<MercurShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadShippingOptions();
  }, [cartId]);

  const loadShippingOptions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await listShippingOptions(cartId);
      
      // Flatten all shipping options from all groups
      const allOptions: MercurShippingOption[] = [];
      Object.values(response.shipping_options).forEach((optionsArray) => {
        allOptions.push(...optionsArray);
      });

      setShippingOptions(allOptions);
      
      // Auto-select first option if available
      if (allOptions.length > 0) {
        setSelectedOption(allOptions[0].id);
      }
    } catch (err) {
      console.error("Error loading shipping options:", err);
      setError("No se pudieron cargar las opciones de envío. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setError("Por favor, selecciona un método de envío");
      return;
    }
    onComplete(selectedOption);
  };

  const getShippingIcon = (optionName: string) => {
    const name = optionName.toLowerCase();
    if (name.includes("express") || name.includes("rápido")) {
      return <Zap className="h-5 w-5 text-yellow-500" />;
    } else if (name.includes("estándar") || name.includes("standard")) {
      return <Package className="h-5 w-5 text-blue-500" />;
    }
    return <Truck className="h-5 w-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando métodos de envío...</span>
      </div>
    );
  }

  if (error && shippingOptions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={loadShippingOptions}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Selecciona un método de envío</h3>
        
        {shippingOptions.length === 0 ? (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              No hay métodos de envío disponibles para tu dirección.
            </p>
          </div>
        ) : (
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="space-y-3">
              {shippingOptions.map((option) => {
                const price = option.calculated_price?.calculated_amount ?? 0;
                const currencyCode = option.calculated_price?.currency_code ?? "eur";

                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all ${
                      selectedOption === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getShippingIcon(option.name)}
                            <div>
                              <Label
                                htmlFor={option.id}
                                className="font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {price === 0 ? (
                                  "Envío gratuito"
                                ) : (
                                  "3-5 días laborables"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {price === 0 ? (
                                "GRATIS"
                              ) : (
                                <>
                                  €{(price / 100).toFixed(2)}
                                </>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                              {currencyCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </RadioGroup>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedOption || shippingOptions.length === 0}>
          Continuar al Pago
        </Button>
      </div>
    </div>
  );
}
