import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

interface CheckoutStore {
  // Paso actual del checkout
  currentStep: number;
  
  // Dirección de entrega
  deliveryAddress: DeliveryAddress | null;
  
  // Método de pago seleccionado
  paymentMethod: 'tarjeta' | 'transferencia' | null;
  
  // Términos y condiciones aceptados
  termsAccepted: boolean;
  
  // Acciones
  setCurrentStep: (step: number) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  setPaymentMethod: (method: 'tarjeta' | 'transferencia') => void;
  setTermsAccepted: (accepted: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      deliveryAddress: null,
      paymentMethod: null,
      termsAccepted: false,

      setCurrentStep: (step) => set({ currentStep: step }),

      setDeliveryAddress: (address) => set({ deliveryAddress: address }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      nextStep: () => {
        const currentStep = get().currentStep;
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      resetCheckout: () =>
        set({
          currentStep: 1,
          deliveryAddress: null,
          paymentMethod: null,
          termsAccepted: false,
        }),
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
