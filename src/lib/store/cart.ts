import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartSummary } from '@/types'

interface CartStore {
  cartId?: string
  items: CartItem[]
  summary?: CartSummary
  setCartId: (cartId: string) => void
  syncMercurCart: (cart: { cartId: string; items: CartItem[]; summary: CartSummary }) => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: undefined,
      items: [],
      summary: undefined,

      setCartId: (cartId: string) => set({ cartId }),

      syncMercurCart: cart =>
        set({
          cartId: cart.cartId,
          items: cart.items,
          summary: cart.summary,
        }),
      
      addItem: (item: CartItem) =>
        set(state => {
          // Find existing item by productId AND variantId (to support different variants)
          const existingItem = state.items.find(
            i => i.productId === item.productId && i.variantId === item.variantId
          );
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (productId: string, variantId?: string) =>
        set(state => ({
          items: state.items.filter(i => {
            // If variantId is provided, match both productId and variantId
            // Otherwise, just match productId (for backward compatibility)
            if (variantId) {
              return !(i.productId === productId && i.variantId === variantId);
            }
            return i.productId !== productId;
          }),
        })),

      updateQuantity: (productId: string, quantity: number, variantId?: string) =>
        set(state => ({
          items: state.items.map(i => {
            // If variantId is provided, match both productId and variantId
            // Otherwise, just match productId (for backward compatibility)
            if (variantId) {
              return i.productId === productId && i.variantId === variantId
                ? { ...i, quantity }
                : i;
            }
            return i.productId === productId ? { ...i, quantity } : i;
          }),
        })),

      clearCart: () => set({ cartId: undefined, items: [], summary: undefined }),

      getTotal: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const items = get().items
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
