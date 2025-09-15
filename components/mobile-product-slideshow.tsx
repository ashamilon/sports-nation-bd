"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { PriceDisplay } from './price-display'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  variants: any[]
  isNew?: boolean
}

interface MobileProductSlideshowProps {
  products: Product[]
  title?: string
  className?: string
}

export default function MobileProductSlideshow({ 
  products, 
  title = "Products",
  className = "" 
}: MobileProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCartStore()
  const { addToWishlist, isInWishlist } = useWishlistStore()

  // Items per slide (2 for mobile)
  const itemsPerSlide = 2
  const totalSlides = Math.ceil(products.length / itemsPerSlide)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
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

  if (products.length === 0) {
    return null
  }

  // Get current slide products
  const getCurrentSlideProducts = () => {
    const startIndex = currentIndex * itemsPerSlide
    return products.slice(startIndex, startIndex + itemsPerSlide)
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Title */}
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
      )}

      {/* Slideshow Container */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 gap-4"
          >
            {getCurrentSlideProducts().map((product, index) => (
              <div key={product.id} className="group">
                <div className="product-card glass-card rounded-xl overflow-hidden h-full">
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
                    <div className="absolute top-2 left-2">
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
                  <div className="p-3 flex flex-col h-full">
                    <Link href={`/product/${product.slug}`} className="block flex-grow">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
                      className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm mt-auto"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots - Only show if more than 1 slide */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/50 hover:bg-muted-foreground/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {totalSlides > 1 && (
        <div className="mt-2 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            key={currentIndex} // Reset animation when slide changes
          />
        </div>
      )}
    </div>
  )
}

