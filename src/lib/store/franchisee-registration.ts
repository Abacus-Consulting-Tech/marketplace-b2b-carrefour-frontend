/**
 * Franchisee Self-Registration Store
 *
 * Mirrors the supplier registration store pattern (src/lib/store/supplier-registration.ts).
 * Drives the public multi-step form at /franchisee/register.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Franchisee,
  FranchiseeInvitationPrefill,
  FranchiseeRegistrationForm,
} from '@/types/franchisees';
import { franchiseeRegistrationApi } from '@/lib/api/franchisee-registration-client';

type SubmissionStatus = 'idle' | 'submitting' | 'submitted' | 'error';

interface FranchiseeRegistrationState {
  // Current step (0-based index: 0=personal, 1=company, 2=financial)
  currentStep: number;

  // Form data
  formData: Partial<FranchiseeRegistrationForm>;

  // Submission state
  status: SubmissionStatus;
  error: string | null;
  result: Franchisee | null;

  // Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Update form data per step
  updatePersonalData: (data: Partial<FranchiseeRegistrationForm>) => void;
  updateCompanyData: (data: Partial<FranchiseeRegistrationForm>) => void;
  updateFinancialData: (data: Partial<FranchiseeRegistrationForm>) => void;
  updatePaymentData: (data: Partial<FranchiseeRegistrationForm>) => void;
  applyInvitationPrefill: (data: FranchiseeInvitationPrefill) => void;

  // Final submission
  submit: (stripePaymentMethodId: string) => Promise<void>;

  // Reset
  reset: () => void;

  // Validation
  isStepValid: (step: number) => boolean;
}

const initialFormData: Partial<FranchiseeRegistrationForm> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  taxId: '',
  fiscalAddress: '',
  municipality: '',
  postalCode: '',
  country: 'España',
  iban: '',
  bankHolderName: '',
  swiftBic: '',
  cardHolderName: '',
};

export const useFranchiseeRegistration = create<FranchiseeRegistrationState>()(
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
        if (isStepValid(currentStep)) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) }));
      },

      updatePersonalData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
      },

      updateCompanyData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
      },

      updateFinancialData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
      },

      updatePaymentData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
      },

      applyInvitationPrefill: (data) => {
        set((state) => {
          const currentFirstName = state.formData.firstName?.trim() || '';
          const currentLastName = state.formData.lastName?.trim() || '';
          const currentEmail = state.formData.email?.trim() || '';

          if (currentFirstName || currentLastName || currentEmail) {
            return state;
          }

          const fullName = (data.firstName || '').trim();
          const [firstName, ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);

          return {
            formData: {
              ...state.formData,
              firstName: firstName || state.formData.firstName || '',
              lastName: data.lastName || lastNameParts.join(' ') || state.formData.lastName || '',
              email: data.email || state.formData.email || '',
            },
          };
        });
      },

      submit: async (stripePaymentMethodId: string) => {
        const { formData, isStepValid } = get();

        if (!isStepValid(0) || !isStepValid(1) || !isStepValid(2)) {
          return;
        }

        set({ status: 'submitting', error: null });

        try {
          const { franchisee } = await franchiseeRegistrationApi.register({
            ...(formData as FranchiseeRegistrationForm),
            stripePaymentMethodId,
          });
          set({ status: 'submitted', result: franchisee });
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
          case 0: // Datos personales
            return !!(
              formData.firstName &&
              formData.lastName &&
              formData.email &&
              formData.phone
            );

          case 1: // Datos de la empresa
            return !!(
              formData.companyName &&
              formData.taxId &&
              formData.fiscalAddress &&
              formData.municipality &&
              formData.postalCode &&
              formData.country
            );

          case 2: // Datos financieros
            return !!(formData.iban && formData.bankHolderName);

          default:
            return false;
        }
      },
    }),
    {
      name: 'franchisee-registration-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        // Submission state is not persisted, always starts fresh
      }),
    }
  )
);
