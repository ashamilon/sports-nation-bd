"use client"

import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/store/wishlist-store'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Since we're using skipHydration: true, we don't need to manually rehydrate
    // The store will handle hydration automatically when needed
  }, [])

  return <>{children}</>
}
