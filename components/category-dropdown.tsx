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

interface CategoryDropdownProps {
  categoryName: string
  categorySlug: string
  parentCollectionId: string
}

export default function CategoryDropdown({ categoryName, categorySlug, parentCollectionId }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [collectionProducts, setCollectionProducts] = useState<Record<string, CollectionProduct[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [parentCollectionId])

  const fetchCollections = async () => {
    try {
      const response = await fetch(`/api/collections?isActive=true&parentId=${parentCollectionId}`)
      const data = await response.json()
      
      if (data.success) {
        setCollections(data.data)
        
        // Fetch products for each collection
        for (const collection of data.data) {
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
      const response = await fetch(`/api/collections/${collectionId}/products?limit=2`)
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
        {categoryName}
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
            className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">{categoryName} Collections</h3>
                <p className="text-sm text-muted-foreground">
                  Browse by brand and style
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
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        {/* Collection Icon */}
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Package className="h-4 w-4 text-primary" />
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
                                className="w-6 h-6 bg-muted rounded border overflow-hidden"
                              >
                                {collectionProduct.product.images && collectionProduct.product.images.length > 0 ? (
                                  <Image
                                    src={collectionProduct.product.images[0]}
                                    alt={collectionProduct.product.name}
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-2 w-2 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  {/* View All Category Link */}
                  <div className="pt-3 border-t border-border">
                    <Link
                      href={`/category/${categorySlug}`}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      View All {categoryName}
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

