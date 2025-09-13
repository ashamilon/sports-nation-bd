"use client"

import { useState, useEffect } from 'react'
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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCartStore()
  const { addToWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    setIsHydrated(true)
    
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=6')
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-muted animate-pulse rounded-lg h-96" />
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and trending sports gear
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
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
                      unoptimized={product.images[0].includes('/api/placeholder')}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-6xl opacity-20">⚽</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
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
                <div className="p-4">
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
                    className="mb-4"
                  />

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="product-card glass-card rounded-xl overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  {product.images && product.images.length > 0 && !product.images[0].startsWith('blob:') ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                      unoptimized={product.images[0].includes('/api/placeholder')}
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
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <Link href={`/product/${product.slug}`} className="block">
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
                    className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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