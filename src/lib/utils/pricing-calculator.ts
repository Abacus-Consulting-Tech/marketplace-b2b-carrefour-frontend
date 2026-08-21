/**
 * Pricing Calculation Utilities
 * 
 * Handles final price calculation based on:
 * - Base price from supplier
 * - Product-specific markup (if exists)
 * - Seller global markup (fallback)
 */

import type { PriceCalculation, PriceBreakdown } from '@/types/products-pricing';

/**
 * Calculate final price with markup
 * 
 * @param basePrice - Original price from supplier (e.g., 18.50)
 * @param productMarkup - Product-specific markup percentage (0-500) or null
 * @param sellerMarkup - Seller's global markup percentage (0-500)
 * @returns Calculated pricing details
 * 
 * @example
 * calculateFinalPrice(18.50, 15) // Uses product markup
 * // => { basePrice: 18.50, markupPercentage: 15, finalPrice: 21.28 }
 * 
 * calculateFinalPrice(18.50, null, 10) // Uses seller global markup
 * // => { basePrice: 18.50, markupPercentage: 10, finalPrice: 20.35 }
 */
export function calculateFinalPrice(
  basePrice: number,
  productMarkup?: number | null,
  sellerMarkup: number = 0
): PriceCalculation {
  // Use product-specific markup if exists, otherwise use seller global
  const markupPercentage = productMarkup !== null && productMarkup !== undefined
    ? productMarkup
    : sellerMarkup;

  // Calculate markup amount and final price
  const markupAmount = basePrice * (markupPercentage / 100);
  const finalPrice = basePrice + markupAmount;

  return {
    basePrice,
    markupPercentage,
    markupAmount,
    finalPrice,
    currency: 'EUR',
  };
}

/**
 * Format price to EUR currency string
 * 
 * @param amount - Price amount (e.g., 21.275)
 * @param currency - Currency code (default: EUR)
 * @returns Formatted price string (e.g., "€21.28")
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format markup percentage
 * 
 * @param markup - Markup percentage (e.g., 15.5)
 * @returns Formatted markup string (e.g., "15.5%")
 */
export function formatMarkup(markup: number): string {
  return `${markup}%`;
}

/**
 * Get price breakdown with formatted strings
 * 
 * @param basePrice - Original price from supplier
 * @param productMarkup - Product-specific markup or null
 * @param sellerMarkup - Seller's global markup
 * @returns Formatted price breakdown for display
 * 
 * @example
 * getPriceBreakdown(18.50, 15)
 * // => {
 * //   base: "€18.50",
 * //   markup: "15%",
 * //   final: "€21.28",
 * //   formula: "€18.50 + 15% = €21.28"
 * // }
 */
export function getPriceBreakdown(
  basePrice: number,
  productMarkup?: number | null,
  sellerMarkup: number = 0
): PriceBreakdown {
  const calculation = calculateFinalPrice(basePrice, productMarkup, sellerMarkup);

  const base = formatPrice(calculation.basePrice);
  const markup = formatMarkup(calculation.markupPercentage);
  const final = formatPrice(calculation.finalPrice);
  const formula = `${base} + ${markup} = ${final}`;

  return {
    base,
    markup,
    final,
    formula,
  };
}

/**
 * Get markup label for display
 * 
 * @param markup - Markup percentage
 * @param isGlobal - Whether this is a seller global markup
 * @returns Descriptive label
 * 
 * @example
 * getMarkupLabel(15, false) // => "15% (específico)"
 * getMarkupLabel(10, true)  // => "10% (global proveedor)"
 */
export function getMarkupLabel(markup: number, isGlobal: boolean = false): string {
  const percentage = formatMarkup(markup);
  const type = isGlobal ? 'global proveedor' : 'específico';
  return `${percentage} (${type})`;
}

/**
 * Validate markup percentage is within allowed range
 * 
 * @param markup - Markup percentage to validate
 * @returns true if valid (0-500), false otherwise
 */
export function isValidMarkup(markup: number): boolean {
  return markup >= 0 && markup <= 500;
}

/**
 * Calculate reverse price (find base price from final price)
 * Useful for price verification
 * 
 * @param finalPrice - Final sale price
 * @param markupPercentage - Applied markup percentage
 * @returns Original base price
 * 
 * @example
 * calculateBasePrice(21.28, 15) // => 18.50
 */
export function calculateBasePrice(finalPrice: number, markupPercentage: number): number {
  return finalPrice / (1 + markupPercentage / 100);
}

/**
 * Compare two prices and return percentage difference
 * 
 * @param price1 - First price
 * @param price2 - Second price
 * @returns Percentage difference
 */
export function getPriceDifference(price1: number, price2: number): number {
  if (price1 === 0) return 0;
  return ((price2 - price1) / price1) * 100;
}
