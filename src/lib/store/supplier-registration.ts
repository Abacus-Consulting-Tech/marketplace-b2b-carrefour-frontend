import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupplierRegistrationForm } from '@/types';

interface SupplierRegistrationState {
  // Current step (0-based index: 0=legal, 1=contact, 2=products)
  currentStep: number;
  
  // Form data
  formData: Partial<SupplierRegistrationForm>;
  
  // Files (stored separately to avoid persistence issues)
  productsCsv: File | null;
  imagesZip: File | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Update form data for each page
  updateLegalData: (data: Partial<SupplierRegistrationForm>) => void;
  updateContactData: (data: Partial<SupplierRegistrationForm>) => void;
  setProductsCsv: (file: File | null) => void;
  setImagesZip: (file: File | null) => void;
  
  // Reset
  reset: () => void;
  
  // Validation
  isStepValid: (step: number) => boolean;
}

const initialFormData: Partial<SupplierRegistrationForm> = {
  businessName: '',
  legalName: '',
  nifCif: '',
  fiscalAddress: '',
  municipality: '',
  postalCode: '',
  country: 'España',
  iban: '',
  email: '',
  phone: '',
  website: '',
  contactName: '',
  contactSurname: '',
  contactPosition: '',
  contactEmail: '',
  contactPhone: '',
};

export const useSupplierRegistration = create<SupplierRegistrationState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: initialFormData,
      productsCsv: null,
      imagesZip: null,

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep, isStepValid } = get();
        if (isStepValid(currentStep) && currentStep < 2) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      updateLegalData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      updateContactData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      setProductsCsv: (file) => {
        set({ productsCsv: file });
      },

      setImagesZip: (file) => {
        set({ imagesZip: file });
      },

      reset: () => {
        set({
          currentStep: 0,
          formData: initialFormData,
          productsCsv: null,
          imagesZip: null,
        });
      },

      isStepValid: (step: number) => {
        const { formData, productsCsv, imagesZip } = get();

        switch (step) {
          case 0: // Legal data
            return !!(
              formData.businessName &&
              formData.legalName &&
              formData.nifCif &&
              formData.fiscalAddress &&
              formData.municipality &&
              formData.postalCode &&
              formData.country &&
              formData.iban &&
              formData.email &&
              formData.phone
            );

          case 1: // Contact data
            return !!(
              formData.contactName &&
              formData.contactSurname &&
              formData.contactPosition &&
              formData.contactEmail &&
              formData.contactPhone
            );

          case 2: // Products
            return !!(productsCsv && imagesZip);

          default:
            return false;
        }
      },
    }),
    {
      name: 'supplier-registration-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        // Files are not persisted due to storage limitations
      }),
    }
  )
);
