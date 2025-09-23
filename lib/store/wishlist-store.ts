import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  createdAt: string
  product?: {
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
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string, variantId?: string) => Promise<boolean>
  removeFromWishlist: (itemId: string, productId?: string, variantId?: string) => Promise<boolean>
  clearError: () => void
  isInWishlist: (productId: string, variantId?: string) => boolean
  setState: (fn: (state: WishlistStore) => Partial<WishlistStore>) => void
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
            // Optimistically add the item to the wishlist
            set((state) => ({
              items: [...state.items, {
                id: data.data.id,
                productId: data.data.productId,
                variantId: data.data.variantId,
                createdAt: new Date().toISOString()
              }],
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

      removeFromWishlist: async (itemId: string, productId?: string, variantId?: string) => {
        set({ isLoading: true, error: null })
        try {
          let url = `/api/wishlist?itemId=${itemId}`
          if (productId) {
            url = `/api/wishlist?productId=${productId}`
            if (variantId) {
              url += `&variantId=${variantId}`
            }
          }
          
          const response = await fetch(url, {
            method: 'DELETE',
          })
          
          const data = await response.json()
          
          if (data.success) {
            set((state) => ({
              items: state.items.filter(item => {
                if (itemId) {
                  return item.id !== itemId
                } else if (productId) {
                  return !(item.productId === productId && item.variantId === (variantId || null))
                }
                return true
              }),
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

      setState: (fn) => set(fn),
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
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        // Handle rehydration completion
        if (state) {
          // Optional: Add any post-rehydration logic here
        }
      }
    }
  )
)
