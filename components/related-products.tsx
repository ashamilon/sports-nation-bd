"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  category: {
    name: string
    slug: string
  }
}

interface RelatedProductsProps {
  currentProductId: string
  categorySlug: string
  limit?: number
}

export default function RelatedProducts({ 
  currentProductId, 
  categorySlug, 
  limit = 8 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    setIsHydrated(true)
    fetchRelatedProducts()
  }, [currentProductId, categorySlug, limit])

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?category=${categorySlug}&limit=${limit + 1}&_t=${Date.now()}`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Filter out the current product and limit results
          const relatedProducts = data.data
            .filter((product: RelatedProduct) => product.id !== currentProductId)
            .slice(0, limit)
          
          setProducts(relatedProducts)
        }
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: RelatedProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/api/placeholder/300',
      quantity: 1,
      variantId: undefined,
      variantName: undefined,
      customOptions: undefined
    })
    
    toast.success('Added to cart!')
  }

  const handleToggleWishlist = async (product: RelatedProduct) => {
    if (!isHydrated) return
    
    const isCurrentlyInWishlist = isInWishlist(product.id, undefined)
    
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(product.id, product.id, undefined)
      toast.success('Removed from wishlist!')
    } else {
      await addToWishlist(product.id, undefined)
      toast.success('Added to wishlist!')
    }
  }

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Products You May Like</h2>
            <p className="text-gray-600 mt-2">Discover more items from the same category</p>
          </div>
          
          <div 
            className="flex gap-4 overflow-x-auto pb-4" 
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Products You May Like</h2>
          <p className="text-gray-600 mt-2">Discover more items from the same category</p>
        </div>
        
        {/* Products Horizontal Scroll */}
        <div className="relative">
          <div 
            className="flex gap-4 overflow-x-auto pb-4" 
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 group"
              >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={product.images[0].includes('/api/placeholder')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleWishlist(product)
                      }}
                      className={`p-2 rounded-full shadow-lg transition-colors ${
                        isHydrated && isInWishlist(product.id, undefined)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Link>
              
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* View All Products Link */}
        <div className="text-center mt-8">
          <Link
            href={`/products?category=${categorySlug}`}
            className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All {products[0]?.category.name} Products
            <ShoppingCart className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
