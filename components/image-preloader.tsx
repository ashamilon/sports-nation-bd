"use client"

import { useEffect } from 'react'

export default function ImagePreloader() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/logo.png',
      '/api/placeholder/300/400',
      '/api/placeholder/60/60'
    ]

    criticalImages.forEach(src => {
      const img = new Image()
      img.src = src
    })

    // Preload next images when user scrolls
    const preloadNextImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        const imageElement = img as HTMLImageElement
        if (imageElement.dataset.src) {
          imageElement.src = imageElement.dataset.src
          imageElement.removeAttribute('data-src')
        }
      })
    }

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    })

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => observer.observe(img))

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
