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
  images: string[]
  averageRating: number
  reviewCount: number
  variants: Array<{
    id: string
    name: string
    value: string
    price?: number
  }>
  category: {
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
      
      const response = await fetch(`/api/products?${params}`)
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
    const variant = product.variants.find(v => v.id === variantId) || product.variants[0]
    
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        ))}
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
        {products.map((product, index) => (
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
                  
                  <p className="text-sm text-muted-foreground">{product.category.name}</p>
                  
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
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Variants */}
                {product.variants.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.slice(0, 3).map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleAddToCart(product, variant.id)}
                        className="text-xs px-2 py-1 border rounded hover:bg-accent transition-colors"
                      >
                        {variant.value}
                      </button>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.variants.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="mobile-scroll gap-4 pb-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group mobile-scroll-item w-64 flex-shrink-0"
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
                      className="glass-button w-full py-2 rounded-lg flex items-center justify-center gap-2"
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
                    
                    <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    
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
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Variants */}
                  {product.variants.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.slice(0, 2).map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleAddToCart(product, variant.id)}
                          className="glass-button text-xs px-2 py-1 rounded"
                        >
                          {variant.value}
                        </button>
                      ))}
                      {product.variants.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{product.variants.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  )
}
