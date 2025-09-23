"use client"

import { useEffect } from 'react'

interface Banner {
  id: string
  image: string
}

interface BannerPreloaderProps {
  banners: Banner[]
}

export default function BannerPreloader({ banners }: BannerPreloaderProps) {
  useEffect(() => {
    // Preload banner images in the background using both methods for better compatibility
    const preloadImages = () => {
      banners.forEach((banner) => {
        if (banner.image && !banner.image.startsWith('blob:')) {
          // Method 1: Link preload (for browser cache)
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = banner.image
          link.crossOrigin = 'anonymous'
          document.head.appendChild(link)

          // Method 2: Image object preload (for immediate availability)
          const img = new window.Image()
          img.src = banner.image
          img.crossOrigin = 'anonymous'
        }
      })
    }

    if (banners.length > 0) {
      preloadImages()
    }
  }, [banners])

  return null // This component doesn't render anything
}
