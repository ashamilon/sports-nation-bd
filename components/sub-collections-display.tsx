"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SubCollection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  _count: {
    CollectionProduct: number
  }
}

interface SubCollectionsDisplayProps {
  parentId: string
  className?: string
}

export default function SubCollectionsDisplay({ 
  parentId,
  className = ""
}: SubCollectionsDisplayProps) {
  const [subCollections, setSubCollections] = useState<SubCollection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubCollections()
  }, [parentId])

  const fetchSubCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/collections?parentId=${parentId}&isActive=true&_t=${Date.now()}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setSubCollections(data.data)
      }
    } catch (error) {
      console.error('Error fetching sub-collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]">
            <div className="glass-card rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (subCollections.length === 0) {
    return null
  }

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {subCollections.map((subCollection) => (
        <motion.div
          key={subCollection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group flex-shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
        >
          <Link href={`/collections/${subCollection.slug}`}>
            <div className="glass-card rounded-xl overflow-hidden h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              {/* Collection Image */}
              <div className="relative aspect-square overflow-hidden">
                {subCollection.image && !subCollection.image.startsWith('blob:') ? (
                  <Image
                    src={subCollection.image}
                    alt={subCollection.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Package className="h-16 w-16 text-primary/60" />
                  </div>
                )}

                {/* Featured Badge */}
                {subCollection.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {subCollection.name}
                </h3>
                
                {subCollection.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {subCollection.description}
                  </p>
                )}

                {/* Product Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{subCollection._count.CollectionProduct} products</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
