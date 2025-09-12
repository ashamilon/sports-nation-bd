"use client"

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCartStore()

  useEffect(() => {
    // Hydrate the cart store on client side
    useCartStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
