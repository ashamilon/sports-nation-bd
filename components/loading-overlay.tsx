'use client'

import { useLoading } from '@/lib/loading-context'
import GlobalLoading from './global-loading'

export default function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading()

  if (!isLoading) return null

  return (
    <GlobalLoading 
      fullScreen 
      text={loadingText}
      size="lg"
    />
  )
}
