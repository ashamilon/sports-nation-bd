"use client"

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCartStore()

  useEffect(() => {
    // Since we're using skipHydration: true, we don't need to manually rehydrate
    // The store will handle hydration automatically when needed
  }, [])

  return <>{children}</>
}
