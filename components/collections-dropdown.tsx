"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  _count: {
    products: number
  }
}

interface CollectionProduct {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    averageRating: number
    reviewCount: number
  }
}

export default function CollectionsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [collectionProducts, setCollectionProducts] = useState<Record<string, CollectionProduct[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections?isActive=true&isFeatured=true')
      const data = await response.json()
      
      if (data.success) {
        const featuredCollections = data.data.slice(0, 4) // Show max 4 collections in dropdown
        setCollections(featuredCollections)
        
        // Fetch products for each collection
        for (const collection of featuredCollections) {
          fetchCollectionProducts(collection.id)
        }
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCollectionProducts = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/products?limit=3`)
      const data = await response.json()
      
      if (data.success) {
        setCollectionProducts(prev => ({
          ...prev,
          [collectionId]: data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching collection products:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
      >
        Collections
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-full left-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Featured Collections</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our curated collections
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No collections available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        {/* Collection Icon */}
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Package className="h-5 w-5 text-primary" />
                        </div>

                        {/* Collection Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {collection.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {collection._count.products} products
                          </p>
                        </div>

                        {/* Product Preview */}
                        {collectionProducts[collection.id] && collectionProducts[collection.id].length > 0 && (
                          <div className="flex gap-1">
                            {collectionProducts[collection.id].slice(0, 2).map((collectionProduct) => (
                              <div
                                key={collectionProduct.id}
                                className="w-8 h-8 bg-muted rounded border overflow-hidden"
                              >
                                {collectionProduct.product.images && collectionProduct.product.images.length > 0 ? (
                                  <Image
                                    src={collectionProduct.product.images[0]}
                                    alt={collectionProduct.product.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  {/* View All Collections Link */}
                  <div className="pt-3 border-t border-border">
                    <Link
                      href="/collections"
                      className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      View All Collections
                      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

