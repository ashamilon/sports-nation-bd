"use client"

import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/store/wishlist-store'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate the wishlist store on client side
    useWishlistStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
