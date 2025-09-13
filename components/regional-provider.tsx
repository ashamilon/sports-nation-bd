"use client"

import { useEffect } from 'react'
import { useRegionalStore } from '@/lib/store/regional-store'

export function RegionalProvider({ children }: { children: React.ReactNode }) {
  const { detectAndSetRegion } = useRegionalStore()

  useEffect(() => {
    // Hydrate the regional store on client side
    useRegionalStore.persist.rehydrate()
    
    // Detect and set region after hydration
    setTimeout(() => {
      detectAndSetRegion()
    }, 100)
  }, [detectAndSetRegion])

  return <>{children}</>
}
