"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Eye, Filter, SortAsc } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images?: string[]
  averageRating: number
  reviewCount: number
  variants?: Array<{
    id: string
    name?: string
    value?: string
    price?: number
    fabricType?: string
    tracksuitType?: string
    sizes?: string
  }>
  category?: {
    name: string
    slug: string
  }
}

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  const { addItem } = useCartStore()

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
    
    // Check if this is a Tracksuit with tracksuitType
    if (product.category?.slug === 'tracksuit' && product.variants.some(v => v.tracksuitType)) {
      const tracksuitTypes = product.variants
        .filter(v => v.tracksuitType)
        .map(v => v.tracksuitType)
        .filter(Boolean)
      
      if (tracksuitTypes.length > 0) {
        return {
          type: 'tracksuit',
          tracksuitTypes: tracksuitTypes,
          priceRange: getTracksuitPriceRange(product.variants)
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

  // Function to get price range for Tracksuit variants
  const getTracksuitPriceRange = (variants: Product['variants']) => {
    if (!variants) return null
    
    const prices: number[] = []
    
    variants.forEach(variant => {
      // Check for tracksuit structure with sizes JSON
      if (variant.sizes) {
        try {
          const sizes = JSON.parse(variant.sizes)
          sizes.forEach((size: any) => {
            if (size.price) prices.push(size.price)
          })
        } catch (error) {
          console.error('Error parsing tracksuit sizes:', error)
        }
      }
      
      // Check for direct price on variant
      if (variant.price && variant.price > 0) {
        prices.push(variant.price)
      }
    })
    
    if (prices.length === 0) return null
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice ? minPrice : { min: minPrice, max: maxPrice }
  }

  useEffect(() => {
    fetchProducts()
  }, [sortBy, filterCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterCategory !== 'all') {
        params.append('category', filterCategory)
      }
      // Add cache-busting parameter to ensure fresh data
      params.append('_t', Date.now().toString())
      
      const response = await fetch(`/api/products?${params}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        let sortedProducts = data.data
        
        // Sort products
        switch (sortBy) {
          case 'price-low':
            sortedProducts = sortedProducts.sort((a: Product, b: Product) => a.price - b.price)
            break
          case 'price-high':
            sortedProducts = sortedProducts.sort((a: Product, b: Product) => b.price - a.price)
            break
          case 'rating':
            sortedProducts = sortedProducts.sort((a: Product, b: Product) => b.averageRating - a.averageRating)
            break
          case 'newest':
          default:
            // Already sorted by newest from API
            break
        }
        
        setProducts(sortedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product, variantId?: string) => {
    const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0]
    
    addItem({
      productId: product.id,
      name: product.name,
      price: variant?.price || product.price,
      image: (product.images && product.images.length > 0 && !product.images[0].startsWith('blob:')) 
        ? product.images[0] 
        : '/api/placeholder/300',
      quantity: 1,
      variantId: variant?.id,
      variantName: variant?.name
    })
    
    toast.success('Added to cart!')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Desktop Loading Skeleton */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        {/* Mobile Loading Skeleton */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-square rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="all">All Categories</option>
            <option value="watches">Watches</option>
            <option value="jerseys">Jerseys</option>
            <option value="sneakers">Sneakers</option>
            <option value="shorts">Shorts</option>
            <option value="custom">Custom Jerseys</option>
            <option value="badges">Badges</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Desktop Products Grid - Vertical Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products && products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="product-card glass-card rounded-2xl overflow-hidden">
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

                {/* Discount Badge */}
                {product.comparePrice && product.comparePrice > product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground">{product.category?.name || 'Unknown Category'}</p>
                  
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
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
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-red-500 line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Variant Information */}
                {(() => {
                  const variantInfo = getVariantInfo(product)
                  if (!variantInfo) return null
                  
                  if (variantInfo.type === 'jersey' && variantInfo.fabrics) {
                    return (
                      <div className="space-y-1 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {variantInfo.fabrics.map((fabric, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {fabric}
                            </span>
                          ))}
                        </div>
                        {variantInfo.priceRange && (
                          <div className="text-xs text-muted-foreground">
                            {typeof variantInfo.priceRange === 'number' 
                              ? `From ${formatCurrency(variantInfo.priceRange)}`
                              : `${formatCurrency(variantInfo.priceRange.min)} - ${formatCurrency(variantInfo.priceRange.max)}`
                            }
                          </div>
                        )}
                      </div>
                    )
                  }
                  
                  if (variantInfo.type === 'tracksuit' && variantInfo.tracksuitTypes) {
                    return (
                      <div className="space-y-1 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {variantInfo.tracksuitTypes.map((tracksuitType, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                            >
                              {tracksuitType}
                            </span>
                          ))}
                        </div>
                        {variantInfo.priceRange && (
                          <div className="text-xs text-muted-foreground">
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
                      <div className="flex flex-wrap gap-1 mt-2">
                        {variantInfo.variants.map((variant, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                          >
                            {variant.name}: {variant.value}
                          </span>
                        ))}
                      </div>
                    )
                  }
                  
                  return null
                })()}

              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Grid - 2 cards per row */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {products && products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="product-card glass-card rounded-2xl overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-4xl opacity-20">⚽</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                      -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-6 h-6 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors">
                      <Heart className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  <div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-muted-foreground">{product.category?.name || 'Unknown Category'}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center">
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
                  </div>

                  {/* Variant Information */}
                  {(() => {
                    const variantInfo = getVariantInfo(product)
                    if (!variantInfo) return null
                    
                    if (variantInfo.type === 'jersey' && variantInfo.fabrics) {
                      return (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {variantInfo.fabrics.slice(0, 1).map((fabric, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                              >
                                {fabric}
                              </span>
                            ))}
                            {variantInfo.fabrics.length > 1 && (
                              <span className="text-xs text-muted-foreground">
                                +{variantInfo.fabrics.length - 1}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }
                    
                    if (variantInfo.type === 'tracksuit' && variantInfo.tracksuitTypes) {
                      return (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {variantInfo.tracksuitTypes.slice(0, 1).map((tracksuitType, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                              >
                                {tracksuitType}
                              </span>
                            ))}
                            {variantInfo.tracksuitTypes.length > 1 && (
                              <span className="text-xs text-muted-foreground">
                                +{variantInfo.tracksuitTypes.length - 1}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }
                    
                    if (variantInfo.type === 'other' && variantInfo.variants) {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {variantInfo.variants.slice(0, 1).map((variant, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                            >
                              {variant.name}: {variant.value}
                            </span>
                          ))}
                        </div>
                      )
                    }
                    
                    return null
                  })()}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-red-500 line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
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

      {(!products || products.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  )
}
