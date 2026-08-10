import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyData {
  cif: string;
  companyName: string;
  legalName: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phone: string;
  email: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
  managerId?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'manager' | 'buyer' | 'viewer';
  storeId?: string;
}

export interface PaymentData {
  cardholderName: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingProvince: string;
}

interface OnboardingState {
  // Current step (0-based index)
  currentStep: number;
  
  // Form data
  companyData: Partial<CompanyData>;
  stores: StoreLocation[];
  teamMembers: TeamMember[];
  paymentData: Partial<PaymentData>;
  
  // Completion status
  isComplete: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setCompanyData: (data: Partial<CompanyData>) => void;
  addStore: (store: StoreLocation) => void;
  updateStore: (id: string, store: Partial<StoreLocation>) => void;
  removeStore: (id: string) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  setPaymentData: (data: Partial<PaymentData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const TOTAL_STEPS = 6;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      companyData: {},
      stores: [],
      teamMembers: [],
      paymentData: {},
      isComplete: false,

      setCurrentStep: (step) =>
        set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      setCompanyData: (data) =>
        set((state) => ({
          companyData: { ...state.companyData, ...data },
        })),

      addStore: (store) =>
        set((state) => ({
          stores: [...state.stores, store],
        })),

      updateStore: (id, updatedStore) =>
        set((state) => ({
          stores: state.stores.map((store) =>
            store.id === id ? { ...store, ...updatedStore } : store
          ),
        })),

      removeStore: (id) =>
        set((state) => ({
          stores: state.stores.filter((store) => store.id !== id),
        })),

      addTeamMember: (member) =>
        set((state) => ({
          teamMembers: [...state.teamMembers, member],
        })),

      updateTeamMember: (id, updatedMember) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id ? { ...member, ...updatedMember } : member
          ),
        })),

      removeTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((member) => member.id !== id),
        })),

      setPaymentData: (data) =>
        set((state) => ({
          paymentData: { ...state.paymentData, ...data },
        })),

      completeOnboarding: () =>
        set({ isComplete: true }),

      resetOnboarding: () =>
        set({
          currentStep: 0,
          companyData: {},
          stores: [],
          teamMembers: [],
          paymentData: {},
          isComplete: false,
        }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
