"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ChevronRight, Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { PriceDisplay } from './price-display'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count: {
    children: number
    products: number
  }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  averageRating: number
  reviewCount: number
  variants: any[]
}

interface CollectionProduct {
  id: string
  collectionId: string
  productId: string
  sortOrder: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  product: Product
}

interface CollectionsDisplayProps {
  featuredOnly?: boolean
  parentId?: string
  limit?: number
  showProducts?: boolean
  className?: string
}

export default function CollectionsDisplay({ 
  featuredOnly = false, 
  parentId = 'null',
  limit,
  showProducts = true,
  className = ""
}: CollectionsDisplayProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())
  const [collectionProducts, setCollectionProducts] = useState<Record<string, CollectionProduct[]>>({})
  const { addItem } = useCartStore()
  const { addToWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    fetchCollections()
  }, [featuredOnly, parentId])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (featuredOnly) {
        params.append('isFeatured', 'true')
      }
      
      if (parentId !== 'null') {
        params.append('parentId', parentId)
      } else {
        params.append('parentId', 'null')
      }
      
      params.append('isActive', 'true')
      params.append('includeChildren', 'true')

      const response = await fetch(`/api/collections?${params}`)
      const data = await response.json()
      
      if (data.success) {
        let collectionsData = data.data
        
        if (limit) {
          collectionsData = collectionsData.slice(0, limit)
        }
        
        setCollections(collectionsData)
        
        // Fetch products for each collection if showProducts is true
        if (showProducts) {
          const productPromises = collectionsData.map((collection: Collection) =>
            fetchCollectionProducts(collection.id)
          )
          await Promise.all(productPromises)
        }
      } else {
        toast.error('Failed to fetch collections')
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const fetchCollectionProducts = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/products?limit=4`)
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

  const toggleExpanded = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId)
    } else {
      newExpanded.add(collectionId)
      // Fetch products when expanding if not already fetched
      if (!collectionProducts[collectionId]) {
        fetchCollectionProducts(collectionId)
      }
    }
    setExpandedCollections(newExpanded)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: (product.images && product.images.length > 0 && !product.images[0].startsWith('blob:'))
        ? product.images[0]
        : '/api/placeholder/300',
      quantity: 1,
      variantId: product.variants[0]?.id,
      variantName: product.variants[0]?.name
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleWishlist = async (product: Product) => {
    const success = await addToWishlist(product.id)
    if (success) {
      toast.success('Added to wishlist!')
    } else {
      toast.error('Failed to add to wishlist')
    }
  }

  const getChildCollections = (parentId: string) => {
    return collections.filter(c => c.parentId === parentId)
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No collections found</h3>
        <p className="text-muted-foreground">
          {featuredOnly ? 'No featured collections available' : 'No collections available at the moment'}
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {collections.map((collection) => {
        const hasChildren = collection._count.children > 0
        const isExpanded = expandedCollections.has(collection.id)
        const children = getChildCollections(collection.id)
        const products = collectionProducts[collection.id] || []

        return (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Collection Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{collection.name}</h2>
                    {collection.description && (
                      <p className="text-muted-foreground mb-2">{collection.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{collection._count.products} products</span>
                      {hasChildren && (
                        <span>{collection._count.children} sub-collections</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpanded(collection.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ChevronRight 
                        className={`h-5 w-5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  )}
                  
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {/* Sub-collections */}
            {hasChildren && isExpanded && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/collections/${child.slug}`}
                      className="group p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {child.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {child._count.products} products
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Collection Products */}
            {showProducts && products.length > 0 && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((collectionProduct) => {
                    const product = collectionProduct.product
                    
                    return (
                      <motion.div
                        key={collectionProduct.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative"
                      >
                        <div className="glass-card rounded-xl overflow-hidden h-full">
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden">
                            {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                <span className="text-6xl opacity-20">⚽</span>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-2 left-2">
                              {product.isFeatured && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleWishlist(product)}
                                className={`p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${
                                  isInWishlist(product.id) ? 'text-red-500' : ''
                                }`}
                              >
                                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </button>
                              <Link
                                href={`/product/${product.slug}`}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <Link href={`/product/${product.slug}`} className="block">
                              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(product.averageRating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({product.reviewCount})
                              </span>
                            </div>

                            {/* Price */}
                            <PriceDisplay
                              price={product.price}
                              comparePrice={product.comparePrice}
                              className="mb-3"
                            />

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

