"use client"

import { useEffect } from 'react'
import { useRegionalStore } from '@/lib/store/regional-store'

export function RegionalProvider({ children }: { children: React.ReactNode }) {
  // Since we simplified the regional store to only support Bangladesh,
  // we don't need any hydration or region detection logic
  useEffect(() => {
    // No-op: Regional store is now simplified and doesn't need hydration
  }, [])

  return <>{children}</>
}
