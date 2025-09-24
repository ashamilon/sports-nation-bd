"use client"

import { useState, useEffect, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { formatCurrency } from '@/lib/currency'
import { toast } from 'sonner'

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

interface ExclusiveProductsProps {
  className?: string
}

const ExclusiveProducts = memo(function ExclusiveProducts({ className = "" }: ExclusiveProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCartStore()
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/public/exclusive-products?limit=5', {
          cache: 'force-cache',
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        if (response.ok) {
          const data = await response.json()
          // The public API already returns formatted and filtered products
          const visibleProducts = (data.data || [])
            .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
          setProducts(visibleProducts)
          setTotalCount(data.totalCount || 0)
        }
      } catch (error) {
        console.error('Error fetching exclusive products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mounted])

  const handleAddToCart = (product: Product) => {
    const variant = product.variants?.[0]
    if (variant) {
      addItem({
        productId: product.id,
        name: product.name,
        price: variant.price,
        image: product.images[0] || '/placeholder-product.jpg',
        quantity: 1,
        variantId: variant.id,
        variantName: variant.name ? `${variant.name}: ${variant.value}` : undefined
      })
      toast.success(`${product.name} added to cart`)
    }
  }

  const handleToggleWishlist = async (product: Product) => {
    const isInWishlist = wishlistItems.some(item => item.productId === product.id)
    
    if (isInWishlist) {
      await removeFromWishlist('', product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const getVariantInfo = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return { price: product.price, comparePrice: product.comparePrice }
    }
    
    // Filter out null prices and use the main product price as fallback
    const validPrices = product.variants
      .map(v => v.price)
      .filter(price => price !== null && price !== undefined && price > 0)
    
    // If no valid variant prices, use the main product price
    if (validPrices.length === 0) {
      return { price: product.price, comparePrice: product.comparePrice }
    }
    
    const minPrice = Math.min(...validPrices)
    const maxPrice = Math.max(...validPrices)
    
    if (minPrice === maxPrice) {
      return { price: minPrice, comparePrice: product.comparePrice }
    }
    
    return { price: minPrice, maxPrice, comparePrice: product.comparePrice }
  }

  const getJerseyPriceRange = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return formatCurrency(product.price)
    }
    
    const jerseyVariants = product.variants.filter(v => v.type === 'jersey')
    if (jerseyVariants.length === 0) {
      return formatCurrency(product.price)
    }
    
    // Filter out null prices and use the main product price as fallback
    const validPrices = jerseyVariants
      .map(v => v.price)
      .filter(price => price !== null && price !== undefined && price > 0)
    
    // If no valid variant prices, use the main product price
    if (validPrices.length === 0) {
      return formatCurrency(product.price)
    }
    
    const minPrice = Math.min(...validPrices)
    const maxPrice = Math.max(...validPrices)
    
    if (minPrice === maxPrice) {
      return formatCurrency(minPrice)
    }
    
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <section 
        className={`py-8 md:py-16 exclusive-products-section ${className}`}
        style={{
          background: 'linear-gradient(to bottom right, #FBFCFD, #FBFCFD)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4" style={{ color: '#27355C' }}>
              Exclusive Products
            </h2>
            <p className="text-lg dark:text-white max-w-2xl mx-auto" style={{ color: '#27355C' }}>
              Premium products for champions
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section 
      className={`py-8 md:py-16 exclusive-products-section ${className}`}
      style={{
        background: 'linear-gradient(to bottom right, #FBFCFD, #FBFCFD)'
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4" style={{ color: '#27355C' }}>
            Exclusive Products
          </h2>
          <p className="text-lg dark:text-white max-w-2xl mx-auto" style={{ color: '#27355C' }}>
            Premium products for champions
          </p>
        </motion.div>

        {/* Desktop Scrollable Grid */}
        <div className="hidden md:block">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product, index) => {
              const variantInfo = getVariantInfo(product)
              const isInWishlist = wishlistItems.some(item => item.productId === product.id)
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex-shrink-0 w-72"
                >
                  <div className="product-card glass-card rounded-2xl overflow-hidden h-full">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-300">No Image</span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {variantInfo.comparePrice && variantInfo.comparePrice > variantInfo.price && (
                          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {Math.round(((variantInfo.comparePrice - variantInfo.price) / variantInfo.comparePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                          onClick={() => handleToggleWishlist(product)}
                        >
                          <Heart 
                            className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                          asChild
                        >
                          <Link href={`/product/${product.slug}`}>
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/product/${product.slug}`} className="block group">
                        <h3 className="font-semibold dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ color: '#27355C' }}>
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
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
                        <span className="text-sm text-gray-600 dark:text-white-80">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold dark:text-white" style={{ color: '#27355C' }}>
                          {product.variants?.some(v => v.type === 'jersey') 
                            ? getJerseyPriceRange(product)
                            : variantInfo.maxPrice 
                              ? `${formatCurrency(variantInfo.price)} - ${formatCurrency(variantInfo.maxPrice)}`
                              : formatCurrency(variantInfo.price)
                          }
                        </span>
                        {variantInfo.comparePrice && variantInfo.comparePrice > variantInfo.price && (
                          <span className="text-sm text-gray-600 dark:text-white-80 line-through">
                            {formatCurrency(variantInfo.comparePrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.slice(0, 5).map((product, index) => {
              const variantInfo = getVariantInfo(product)
              const isInWishlist = wishlistItems.some(item => item.productId === product.id)
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex-shrink-0 w-48"
                >
                  <div className="product-card glass-card rounded-xl overflow-hidden h-full">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 192px, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-300 text-sm">No Image</span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {variantInfo.comparePrice && variantInfo.comparePrice > variantInfo.price && (
                          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {Math.round(((variantInfo.comparePrice - variantInfo.price) / variantInfo.comparePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={() => handleToggleWishlist(product)}
                      >
                        <Heart 
                          className={`h-3 w-3 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="font-semibold dark:text-white mb-1 line-clamp-2 text-sm" style={{ color: '#27355C' }}>
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
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
                        <span className="text-xs text-gray-600 dark:text-white-80">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold dark:text-white" style={{ color: '#27355C' }}>
                          {product.variants?.some(v => v.type === 'jersey') 
                            ? getJerseyPriceRange(product)
                            : variantInfo.maxPrice 
                              ? `${formatCurrency(variantInfo.price)} - ${formatCurrency(variantInfo.maxPrice)}`
                              : formatCurrency(variantInfo.price)
                          }
                        </span>
                        {variantInfo.comparePrice && variantInfo.comparePrice > variantInfo.price && (
                          <span className="text-xs text-gray-600 dark:text-white-80 line-through">
                            {formatCurrency(variantInfo.comparePrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        <span className="text-xs">Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* View More Products Button */}
        {totalCount > 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/80 dark:bg-black-80/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
            >
              <Link href="/products">
                View More Products
                <span className="ml-2 text-sm text-muted-foreground">
                  ({totalCount - 5} more)
                </span>
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
})

export default ExclusiveProducts
