'use client'

import { useEffect } from 'react'
import { initVisitorTracker } from '@/lib/visitor-tracker'

export default function VisitorTracking() {
  useEffect(() => {
    // Initialize visitor tracking
    initVisitorTracker()
  }, [])

  return null // This component doesn't render anything
}
