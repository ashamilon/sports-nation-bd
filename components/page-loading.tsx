'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import GlobalLoading from './global-loading'

export default function PageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Simulate route change loading
    handleStart()
    const timer = setTimeout(handleComplete, 800) // Adjust timing as needed

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <GlobalLoading 
      fullScreen 
      text="Loading page..."
      size="lg"
    />
  )
}
