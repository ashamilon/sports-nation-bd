'use client'

import { useLoading } from './loading-context'
import { useCallback } from 'react'

export function useGlobalLoading() {
  const { setLoading } = useLoading()

  const showLoading = useCallback((text: string = 'Loading...') => {
    setLoading(true, text)
  }, [setLoading])

  const hideLoading = useCallback(() => {
    setLoading(false)
  }, [setLoading])

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingText: string = 'Loading...'
  ): Promise<T> => {
    try {
      setLoading(true, loadingText)
      const result = await asyncFn()
      return result
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  return {
    showLoading,
    hideLoading,
    withLoading
  }
}
