import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Supplier,
  SupplierInvitationPrefill,
  SupplierRegistrationForm,
} from '@/types';
import { supplierRegistrationApi } from '@/lib/api/supplier-registration-client';

type SubmissionStatus = 'idle' | 'submitting' | 'submitted' | 'error';

interface SupplierRegistrationState {
  // Current step (0-based index: 0=legal, 1=contact, 2=review)
  currentStep: number;
  
  // Form data
  formData: Partial<SupplierRegistrationForm>;

  // Submission state
  status: SubmissionStatus;
  error: string | null;
  result: Supplier | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Update form data for each page
  updateLegalData: (data: Partial<SupplierRegistrationForm>) => void;
  updateContactData: (data: Partial<SupplierRegistrationForm>) => void;
  applyInvitationPrefill: (data: SupplierInvitationPrefill) => void;

  // Final submission
  submit: () => Promise<void>;
  
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
      status: 'idle',
      error: null,
      result: null,

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

      applyInvitationPrefill: (data) => {
        set((state) => {
          const currentBusinessName = state.formData.businessName?.trim() || '';
          const currentContactName = state.formData.contactName?.trim() || '';
          const currentContactSurname = state.formData.contactSurname?.trim() || '';
          const currentEmail = state.formData.email?.trim() || '';
          const currentContactEmail = state.formData.contactEmail?.trim() || '';

          if (
            currentBusinessName ||
            currentContactName ||
            currentContactSurname ||
            currentEmail ||
            currentContactEmail
          ) {
            return state;
          }

          const fullName = (data.name || '').trim();
          const [contactName, ...surnameParts] = fullName.split(/\s+/).filter(Boolean);

          return {
            formData: {
              ...state.formData,
              businessName: data.name || state.formData.businessName || '',
              contactName: contactName || state.formData.contactName || '',
              contactSurname: surnameParts.join(' ') || state.formData.contactSurname || '',
              email: data.email || state.formData.email || '',
              contactEmail: data.email || state.formData.contactEmail || '',
            },
          };
        });
      },

      submit: async () => {
        const { formData, isStepValid } = get();

        if (!isStepValid(0) || !isStepValid(1)) {
          return;
        }

        set({ status: 'submitting', error: null });

        try {
          const { supplier } = await supplierRegistrationApi.register(
            formData as SupplierRegistrationForm
          );
          set({ status: 'submitted', result: supplier });
        } catch (err) {
          set({
            status: 'error',
            error: err instanceof Error ? err.message : 'Error al enviar la solicitud',
          });
        }
      },

      reset: () => {
        set({
          currentStep: 0,
          formData: initialFormData,
          status: 'idle',
          error: null,
          result: null,
        });
      },

      isStepValid: (step: number) => {
        const { formData } = get();

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

          case 2: // Review
            return get().isStepValid(0) && get().isStepValid(1);

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
        // Submission state is not persisted, always starts fresh
      }),
    }
  )
);
