"use client"

import { useState } from 'react'
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
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  children: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface CategoryProductsProps {
  category: Category
  products: Product[]
}

export default function CategoryProducts({ category, products }: CategoryProductsProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [filterSubcategory, setFilterSubcategory] = useState('all')
  const { addItem } = useCartStore()

  // Function to get variant information for display
  const getVariantInfo = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return null
    
    // Check if this is a Jersey with new variant structure (fabricType)
    if (product.category?.slug === 'jersey' && product.variants.some(v => v.fabricType)) {
      const fabricTypes = product.variants
        .filter(v => v.fabricType)
        .map(v => v.fabricType)
        .filter(Boolean)
      
      // Show fabric types even if there's only one
      if (fabricTypes.length > 0) {
        return {
          type: 'jersey',
          fabrics: fabricTypes,
          priceRange: getJerseyPriceRange(product.variants)
        }
      }
    }
    
    // Check if this is a Jersey with old variant structure (name/value for Version)
    if (product.category?.slug === 'jersey') {
      const versionVariants = product.variants
        .filter(v => v.name === 'Version' && v.value)
        .map(v => v.value)
        .filter(Boolean)
      
      // Show version variants even if there's only one
      if (versionVariants.length > 0) {
        return {
          type: 'jersey',
          fabrics: versionVariants,
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

  // Function to get the main price and price range for display
  const getPriceInfo = (product: Product) => {
    const variantInfo = getVariantInfo(product)
    
    if (variantInfo?.type === 'jersey' && variantInfo.priceRange) {
      if (typeof variantInfo.priceRange === 'number') {
        return {
          mainPrice: variantInfo.priceRange,
          priceRange: null,
          hasRange: false
        }
      } else {
        return {
          mainPrice: variantInfo.priceRange.min,
          priceRange: `${formatCurrency(variantInfo.priceRange.min)} - ${formatCurrency(variantInfo.priceRange.max)}`,
          hasRange: true
        }
      }
    }
    
    // For products with variants that have different prices
    const variantPrices = product.variants
      .map(v => {
        if (v.sizes) {
          try {
            const sizes = JSON.parse(v.sizes)
            return sizes.map((s: any) => s.price).filter(Boolean)
          } catch {
            return v.price ? [v.price] : []
          }
        }
        return v.price ? [v.price] : []
      })
      .flat()
      .filter(Boolean)
    
    if (variantPrices.length > 0) {
      const minPrice = Math.min(...variantPrices)
      const maxPrice = Math.max(...variantPrices)
      
      if (minPrice === maxPrice) {
        return {
          mainPrice: minPrice,
          priceRange: null,
          hasRange: false
        }
      } else {
        return {
          mainPrice: minPrice,
          priceRange: `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`,
          hasRange: true
        }
      }
    }
    
    return {
      mainPrice: product.price,
      priceRange: null,
      hasRange: false
    }
  }

  // Function to get price range for Jersey variants
  const getJerseyPriceRange = (variants: Product['variants']) => {
    if (!variants) return null
    
    const prices: number[] = []
    
    variants.forEach(variant => {
      // Check for new structure with sizes JSON
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
      
      // Check for old structure with direct price on variant
      if (variant.price && variant.price > 0) {
        prices.push(variant.price)
      }
    })
    
    if (prices.length === 0) return null
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice ? minPrice : { min: minPrice, max: maxPrice }
  }

  const handleAddToCart = (product: Product, variantId?: string) => {
    const variant = product.variants.find(v => v.id === variantId) || product.variants[0]
    
    addItem({
      productId: product.id,
      name: product.name,
      price: variant?.price || product.price,
      image: product.images[0] || '/placeholder-product.jpg',
      quantity: 1,
      variantId: variant?.id,
      variantName: variant?.name
    })
    
    toast.success('Added to cart!')
  }

  // Sort products
  let sortedProducts = [...products]
  switch (sortBy) {
    case 'price-low':
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      sortedProducts = sortedProducts.sort((a, b) => b.averageRating - a.averageRating)
      break
    case 'newest':
    default:
      // Already sorted by newest from API
      break
  }

  return (
    <div className="space-y-6">
      {/* Subcategories */}
      {category.children.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterSubcategory('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filterSubcategory === 'all'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            All {category.name}
          </button>
          {category.children.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setFilterSubcategory(subcategory.slug)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filterSubcategory === subcategory.slug
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            {sortedProducts.length} products
          </span>
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

      {/* Desktop Products Grid - 4 columns */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product, index) => (
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
                    height={400}
                    className="w-full h-full object-cover"
                    unoptimized={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-6xl opacity-20">⚽</span>
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
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Category */}
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.category?.name || 'Jersey'}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Price Information */}
                {(() => {
                  const priceInfo = getPriceInfo(product)
                  const variantInfo = getVariantInfo(product)
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          {formatCurrency(priceInfo.mainPrice)}
                        </span>
                        {product.comparePrice && product.comparePrice > priceInfo.mainPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.comparePrice)}
                          </span>
                        )}
                      </div>
                      
                      {priceInfo.hasRange && priceInfo.priceRange && (
                        <div className="text-sm text-muted-foreground">
                          {priceInfo.priceRange}
                        </div>
                      )}

                      {/* Variant Information - Right below price */}
                      {variantInfo && variantInfo.type === 'jersey' && variantInfo.fabrics && (
                        <div className="flex flex-wrap gap-1">
                          {variantInfo.fabrics.map((fabric, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {fabric}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {variantInfo && variantInfo.type === 'other' && variantInfo.variants && (
                        <div className="flex flex-wrap gap-1">
                          {variantInfo.variants.map((variant, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground"
                            >
                              {variant.name}: {variant.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Grid - Enhanced */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {sortedProducts.map((product, index) => {
          const priceInfo = getPriceInfo(product)
          const variantInfo = getVariantInfo(product)
          
          return (
            <div key={product.id} className="group">
              <div className="product-card glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-6xl opacity-20">⚽</span>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Category */}
                  <p className="text-xs text-muted-foreground">
                    {product.category?.name || 'Jersey'}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
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
                  
                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">
                        {formatCurrency(priceInfo.mainPrice)}
                      </span>
                      {product.comparePrice && product.comparePrice > priceInfo.mainPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    
                    {priceInfo.hasRange && priceInfo.priceRange && (
                      <div className="text-xs text-muted-foreground">
                        {priceInfo.priceRange}
                      </div>
                    )}

                    {/* Variant Information - Right below price */}
                    {variantInfo && variantInfo.type === 'jersey' && variantInfo.fabrics && (
                      <div className="flex flex-wrap gap-1">
                        {variantInfo.fabrics.slice(0, 1).map((fabric, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {fabric}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category</p>
        </div>
      )}
    </div>
  )
}
