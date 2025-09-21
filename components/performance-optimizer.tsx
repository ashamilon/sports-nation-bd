"use client"

import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical API endpoints
    const preloadCriticalAPIs = async () => {
      const criticalAPIs = [
        '/api/products?featured=true&limit=6',
        '/api/cms/banners?position=home_top',
        '/api/cms/banners?position=home_hero',
        '/api/cms/countdowns?position=home',
        '/api/cms/homepage-settings',
        '/api/collections?isActive=true&isFeatured=true'
      ]

      // Preload APIs in parallel with low priority
      const preloadPromises = criticalAPIs.map(url => 
        fetch(url, { 
          priority: 'low',
          headers: {
            'Cache-Control': 'max-age=300'
          }
        }).catch(() => {
          // Silently fail preload requests
        })
      )

      // Don't wait for preload to complete
      Promise.allSettled(preloadPromises)
    }

    // Preload critical images
    const preloadCriticalImages = () => {
      const criticalImages = [
        '/api/placeholder/300/400',
        '/api/placeholder/60/60'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Run optimizations
    preloadCriticalAPIs()
    preloadCriticalImages()

    // Prefetch next page resources on idle
    const prefetchOnIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Prefetch common pages
          const commonPages = ['/products', '/categories']
          commonPages.forEach(page => {
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.href = page
            document.head.appendChild(link)
          })
        })
      }
    }

    prefetchOnIdle()
  }, [])

  return null // This component doesn't render anything
}
