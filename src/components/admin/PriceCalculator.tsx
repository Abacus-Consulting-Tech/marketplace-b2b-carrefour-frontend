'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { calculateFinalPrice, formatPrice, formatMarkup } from '@/lib/utils/pricing-calculator';
import { Calculator, TrendingUp } from 'lucide-react';

interface PriceCalculatorProps {
  basePrice: number;
  markup: number;
  onMarkupChange: (markup: number) => void;
  sellerGlobalMarkup?: number;
  className?: string;
}

export function PriceCalculator({
  basePrice,
  markup,
  onMarkupChange,
  sellerGlobalMarkup,
  className,
}: PriceCalculatorProps) {
  const [localMarkup, setLocalMarkup] = useState(markup);
  const [inputValue, setInputValue] = useState(markup.toString());

  // Sync local state with prop changes
  useEffect(() => {
    setLocalMarkup(markup);
    // Format with comma for Spanish locale
    setInputValue(markup.toString().replace('.', ','));
  }, [markup]);

  const handleSliderChange = (value: number[]) => {
    const newMarkup = value[0];
    setLocalMarkup(newMarkup);
    // Format with comma for Spanish locale
    setInputValue(newMarkup.toString().replace('.', ','));
    onMarkupChange(newMarkup);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    
    // Allow the user to type freely (including commas and dots)
    setInputValue(inputVal);
    
    // Try to parse the value (replace comma with dot for parsing)
    const normalizedValue = inputVal.replace(',', '.');
    const parsedValue = parseFloat(normalizedValue);
    
    // Only update markup if we have a valid number
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(0, Math.min(500, parsedValue));
      setLocalMarkup(clampedValue);
      onMarkupChange(clampedValue);
    } else if (inputVal === '' || inputVal === '0' || inputVal === '0,' || inputVal === '0.') {
      // Allow typing "0," or "0." as intermediate states
      setLocalMarkup(0);
      onMarkupChange(0);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const normalizedValue = inputVal.replace(',', '.');
    const parsedValue = parseFloat(normalizedValue);
    
    if (isNaN(parsedValue) || inputVal === '') {
      // Reset to 0 if invalid
      setLocalMarkup(0);
      setInputValue('0');
      onMarkupChange(0);
    } else {
      // Clamp the value
      const clampedValue = Math.max(0, Math.min(500, parsedValue));
      setLocalMarkup(clampedValue);
      
      // Format the display value: use comma for Spanish locale
      const formattedValue = clampedValue.toString().replace('.', ',');
      setInputValue(formattedValue);
      
      onMarkupChange(clampedValue);
    }
  };

  const calculation = calculateFinalPrice(basePrice, localMarkup);
  const usingGlobalMarkup = sellerGlobalMarkup !== undefined && localMarkup === sellerGlobalMarkup;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Calculadora de Precio Final</CardTitle>
        </div>
        <CardDescription>
          Ajusta el markup para establecer el precio de venta
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Base Price (readonly) */}
        <div className="space-y-2">
          <Label>Precio Base (Proveedor)</Label>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(basePrice)}
          </div>
          <p className="text-sm text-gray-500">
            Precio propuesto por el proveedor
          </p>
        </div>

        {/* Markup Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Markup (%)</Label>
            {usingGlobalMarkup && (
              <Badge variant="outline" className="text-xs">
                Usando markup global del proveedor
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
            <Slider
              value={[localMarkup]}
              onValueChange={handleSliderChange}
              min={0}
              max={500}
              step={0.5}
              className="flex-1"
            />
            <div className="w-20">
              <Input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="text-center"
                placeholder="0"
              />
            </div>
          </div>

          {sellerGlobalMarkup !== undefined && localMarkup !== sellerGlobalMarkup && (
            <p className="text-sm text-amber-600">
              ℹ️ El proveedor tiene un markup global del {sellerGlobalMarkup}%. 
              Estás aplicando un markup específico del {localMarkup}% para este producto.
            </p>
          )}
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Precio Base:</span>
            <span className="font-medium">{formatPrice(calculation.basePrice)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Markup ({formatMarkup(calculation.markupPercentage)}):</span>
            <span className="font-medium text-green-600">
              +{formatPrice(calculation.markupAmount)}
            </span>
          </div>
          <div className="h-px bg-gray-300"></div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Precio Final:</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(calculation.finalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Formula Display */}
        <div className="text-center text-sm text-gray-500 font-mono bg-blue-50 p-3 rounded">
          {formatPrice(basePrice)} × (1 + {localMarkup}%) = {formatPrice(calculation.finalPrice)}
        </div>

        {/* Markup Suggestions */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Atajos rápidos:</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 25, 30].map((suggestedMarkup) => (
              <button
                key={suggestedMarkup}
                type="button"
                onClick={() => {
                  setLocalMarkup(suggestedMarkup);
                  // Format with comma for Spanish locale
                  setInputValue(suggestedMarkup.toString().replace('.', ','));
                  onMarkupChange(suggestedMarkup);
                }}
                className={`px-3 py-1 text-xs rounded border ${
                  localMarkup === suggestedMarkup
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {suggestedMarkup}%
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
