"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { PriceDisplay } from './price-display'
import { DeliveryInfo } from './delivery-info'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import MobileProductSlideshow from './mobile-product-slideshow'
import { SkeletonCard, SkeletonSection } from './skeleton-loading'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  variants: Array<{
    id: string
    name?: string
    value?: string
    price?: number
    fabricType?: string
    sizes?: string
  }>
  category?: {
    name: string
    slug: string
  }
  isNew?: boolean
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCartStore()
  const { addToWishlist, isInWishlist } = useWishlistStore()

  // Function to get variant information for display
  const getVariantInfo = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return null
    
    // Check if this is a Jersey with new variant structure
    if (product.category?.slug === 'jersey' && product.variants.some(v => v.fabricType)) {
      const fabricTypes = product.variants
        .filter(v => v.fabricType)
        .map(v => v.fabricType)
        .filter(Boolean)
      
      if (fabricTypes.length > 0) {
        return {
          type: 'jersey',
          fabrics: fabricTypes,
          priceRange: getJerseyPriceRange(product.variants)
        }
      }
    }
    
    // For other variants, show the first few
    const otherVariants = product.variants
      .filter(v => v.name && v.value)
      .slice(0, 2)
    
    if (otherVariants.length > 0) {
      return {
        type: 'other',
        variants: otherVariants
      }
    }
    
    return null
  }

  // Function to get price range for Jersey variants
  const getJerseyPriceRange = (variants: Product['variants']) => {
    if (!variants) return null
    
    const prices: number[] = []
    
    variants.forEach(variant => {
      if (variant.sizes) {
        try {
          const sizes = JSON.parse(variant.sizes)
          sizes.forEach((size: any) => {
            if (size.price) prices.push(size.price)
          })
        } catch (error) {
          console.error('Error parsing sizes:', error)
        }
      }
    })
    
    if (prices.length === 0) return null
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice ? minPrice : { min: minPrice, max: maxPrice }
  }

  useEffect(() => {
    setIsHydrated(true)
    
    const fetchFeaturedProducts = async () => {
      try {
        // Add cache-busting for featured products
        const response = await fetch(`/api/products?featured=true&limit=6&_t=${Date.now()}`, {
          cache: 'no-store'
        })
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || products.length === 0 || isPaused) return

    const container = scrollContainerRef.current
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const maxScroll = scrollWidth - clientWidth

    if (maxScroll <= 0) return

    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame
    let scrollDirection = 1 // 1 for right, -1 for left

    const autoScroll = () => {
      if (isPaused) return

      scrollPosition += scrollSpeed * scrollDirection

      // Reverse direction when reaching the end
      if (scrollPosition >= maxScroll) {
        scrollPosition = maxScroll
        scrollDirection = -1
      } else if (scrollPosition <= 0) {
        scrollPosition = 0
        scrollDirection = 1
      }

      container.scrollLeft = scrollPosition
      requestAnimationFrame(autoScroll)
    }

    const animationId = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [products, isPaused])

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

  if (isLoading) {
    return (
      <SkeletonSection title="Featured Products" className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="md:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SkeletonSection>
    )
  }

  return (
    <section className="py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground dark:text-white-100">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white-80 max-w-2xl mx-auto">
            Discover our most popular and trending sports gear
          </p>
        </motion.div>

        {/* Desktop Horizontal Scrollable Layout */}
        <div className="hidden md:block">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex-shrink-0 w-80 h-[500px]"
              >
                <div className="product-card glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-6xl opacity-20">⚽</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleWishlist(product)}
                        className={`p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${
                          isHydrated && isInWishlist(product.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isHydrated && isInWishlist(product.id) ? 'fill-current' : ''}`} />
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
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/product/${product.slug}`} className="block">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <PriceDisplay 
                      price={product.price}
                      comparePrice={product.comparePrice}
                      className="mb-2"
                    />

                    {/* Variant Information */}
                    {(() => {
                      const variantInfo = getVariantInfo(product)
                      if (!variantInfo) return null
                      
                      if (variantInfo.type === 'jersey' && variantInfo.fabrics) {
                        return (
                          <div className="space-y-1 mb-4">
                            <div className="flex flex-wrap gap-1">
                              {variantInfo.fabrics.map((fabric, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 dark:text-white border border-primary/20"
                                  style={{ color: '#27355C' }}
                                >
                                  {fabric}
                                </span>
                              ))}
                            </div>
                            {variantInfo.priceRange && (
                              <div className="text-xs text-muted-foreground dark:text-white-80">
                                {typeof variantInfo.priceRange === 'number' 
                                  ? `From ${formatCurrency(variantInfo.priceRange)}`
                                  : `${formatCurrency(variantInfo.priceRange.min)} - ${formatCurrency(variantInfo.priceRange.max)}`
                                }
                              </div>
                            )}
                          </div>
                        )
                      }
                      
                      if (variantInfo.type === 'other' && variantInfo.variants) {
                        return (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {variantInfo.variants.map((variant, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted dark:text-white"
                                style={{ color: '#27355C' }}
                              >
                                {variant.name}: {variant.value}
                              </span>
                            ))}
                          </div>
                        )
                      }
                      
                      return null
                    })()}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Layout */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex-shrink-0 w-64 h-[400px]"
              >
                <div className="product-card glass-card rounded-xl overflow-hidden h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-6xl opacity-20">⚽</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                          -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleWishlist(product)}
                        className={`p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${
                          isHydrated && isInWishlist(product.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${isHydrated && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <Link 
                        href={`/product/${product.slug}`}
                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <Link href={`/product/${product.slug}`} className="block">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating - Always visible */}
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
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    {/* Price - Always visible */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold dark:text-white" style={{ color: '#27355C' }}>
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-muted-foreground dark:text-white-80 line-through">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Always visible */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm mt-auto"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Products
            <Eye className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}