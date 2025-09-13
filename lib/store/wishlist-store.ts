import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: string
    stock: number
    isActive: boolean
    category: {
      id: string
      name: string
      slug: string
    }
    variants: Array<{
      id: string
      name: string
      value: string
      price?: number
      stock: number
    }>
  }
  variant?: {
    id: string
    name: string
    value: string
    price?: number
    stock: number
  }
  createdAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string, variantId?: string) => Promise<boolean>
  removeFromWishlist: (itemId: string) => Promise<boolean>
  clearError: () => void
  isInWishlist: (productId: string, variantId?: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/wishlist')
          const data = await response.json()
          
          if (data.success) {
            set({ items: data.data, isLoading: false })
          } else {
            set({ error: data.message, isLoading: false })
          }
        } catch (error) {
          set({ 
            error: 'Failed to fetch wishlist', 
            isLoading: false 
          })
        }
      },

      addToWishlist: async (productId: string, variantId?: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, variantId }),
          })
          
          const data = await response.json()
          
          if (data.success) {
            set((state) => ({
              items: [...state.items, data.data],
              isLoading: false
            }))
            return true
          } else {
            set({ error: data.message, isLoading: false })
            return false
          }
        } catch (error) {
          set({ 
            error: 'Failed to add item to wishlist', 
            isLoading: false 
          })
          return false
        }
      },

      removeFromWishlist: async (itemId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/wishlist?itemId=${itemId}`, {
            method: 'DELETE',
          })
          
          const data = await response.json()
          
          if (data.success) {
            set((state) => ({
              items: state.items.filter(item => item.id !== itemId),
              isLoading: false
            }))
            return true
          } else {
            set({ error: data.message, isLoading: false })
            return false
          }
        } catch (error) {
          set({ 
            error: 'Failed to remove item from wishlist', 
            isLoading: false 
          })
          return false
        }
      },

      clearError: () => set({ error: null }),

      isInWishlist: (productId: string, variantId?: string) => {
        const { items } = get()
        return items.some(item => 
          item.productId === productId && 
          item.variantId === (variantId || null)
        )
      },
    }),
    {
      name: 'wishlist-store',
      storage: createJSONStorage(() => {
        // Only use localStorage on client side
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for server side
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true, // Skip hydration to prevent mismatch
    }
  )
)
