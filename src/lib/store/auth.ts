import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        console.log('[AuthStore] setHasHydrated called with:', state);
        set({
          _hasHydrated: state
        })
      },

      login: (user: User, token: string) => {
        console.log('[AuthStore] login() called for user:', user.email, 'role:', user.role);
        localStorage.setItem('auth-token', token)
        set({ user, token, isAuthenticated: true })
        console.log('[AuthStore] State updated, isAuthenticated: true');
      },

      logout: () => {
        console.log('[AuthStore] logout() called');
        localStorage.removeItem('auth-token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (userData: Partial<User>) =>
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        console.log('[AuthStore] onRehydrateStorage callback fired');
        return (state: AuthStore | undefined, error?: unknown) => {
          if (error) {
            console.error('[AuthStore] Hydration error:', error);
          }
          console.log('[AuthStore] Hydration complete. User:', state?.user?.email, 'isAuth:', state?.isAuthenticated);
          state?.setHasHydrated(true);
        };
      },
    }
  )
)
