"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Collection {
  id: string
  name: string
  slug: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  isInCarousel?: boolean
  carouselOrder?: number
}

export default function CircularCollectionsCarousel() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    isEnabled: true,
    maxItems: 6,
    autoRotate: true,
    rotationSpeed: 20
  })

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // First check if carousel is enabled
        const settingsResponse = await fetch('/api/public/circular-collections/settings')
        const settingsData = await settingsResponse.json()
        
        if (settingsData.success) {
          setSettings(settingsData.data)
        }
        
        if (!settingsData.success || !settingsData.data.isEnabled) {
          setCollections([])
          setLoading(false)
          return
        }

        // Fetch collections that are in the carousel
        const response = await fetch('/api/collections?isActive=true&isInCarousel=true')
        const data = await response.json()
        
        if (data.success && data.data) {
          // Sort by carouselOrder and limit to maxItems
          const carouselCollections = data.data
            .filter((collection: Collection) => collection.isInCarousel)
            .sort((a: Collection, b: Collection) => (a.carouselOrder || 0) - (b.carouselOrder || 0))
            .slice(0, settingsData.data.maxItems || 6)
          
          setCollections(carouselCollections)
        } else {
          setCollections([])
        }
      } catch (error) {
        console.error('Error fetching collections:', error)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-black-90">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 md:space-x-6 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-200 dark:bg-black-80 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (collections.length === 0) {
    return null
  }

  // Duplicate collections for infinite scroll effect
  const duplicatedCollections = [...collections, ...collections, ...collections]

  return (
    <section className="py-12 bg-gray-50 dark:bg-black-90">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-4 md:space-x-6 circular-carousel-mobile"
            animate={settings.autoRotate ? {
              x: [0, -100 * collections.length] // Move by the width of one set of collections
            } : {}}
            transition={settings.autoRotate ? {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: settings.rotationSpeed, // Use settings rotation speed
                ease: "linear",
              },
            } : {}}
            style={{
              '--item-count': duplicatedCollections.length
            } as React.CSSProperties}
          >
            {duplicatedCollections.map((collection, index) => (
              <Link
                key={`${collection.id}-${index}`}
                href={`/collections/${collection.slug}`}
                className="flex-shrink-0 group"
              >
                <motion.div
                  className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-2xl">
                        {collection.name.toLowerCase().includes('jersey') ? '⚽' :
                         collection.name.toLowerCase().includes('shoe') ? '👟' :
                         collection.name.toLowerCase().includes('watch') ? '⌚' :
                         collection.name.toLowerCase().includes('accessory') ? '🎽' :
                         collection.name.toLowerCase().includes('training') ? '🏃' :
                         collection.name.toLowerCase().includes('equipment') ? '🏈' :
                         '🏆'}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </motion.div>
              </Link>
            ))}
          </motion.div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-black-90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-black-90 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
