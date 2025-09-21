import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { behaviorTracker } from '@/lib/behavior-tracker'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variantId?: string
  variantName?: string
  customOptions?: {
    badges?: string[]
    name?: string
    number?: string
    size?: string
    fabric?: string
    badgeTotal?: number
  }
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) => i.productId === item.productId && 
                 i.variantId === item.variantId &&
                 JSON.stringify(i.customOptions) === JSON.stringify(item.customOptions)
        )
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          })
        } else {
          set({
            items: [...items, { ...item, id: Date.now().toString() }]
          })
        }

        // Track cart add behavior
        behaviorTracker.trackCartAdd(item.productId, item.name, item.price)
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id)
        })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 0), 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.price || 0
          const quantity = item.quantity || 0
          return total + (price * quantity)
        }, 0)
      }
    }),
    {
      name: 'sports-nation-cart',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true
    }
  )
)
