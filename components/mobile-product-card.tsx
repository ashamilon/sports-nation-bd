"use client"

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/lib/currency'

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

interface MobileProductCardProps {
  product: Product
  className?: string
}

export default function MobileProductCard({ product, className = "" }: MobileProductCardProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCartStore()
  const { addToWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    setIsHydrated(true)
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

  return (
    <div className={`group ${className}`}>
      <div className="product-card glass-card rounded-xl overflow-hidden h-full bg-white shadow-sm border border-gray-100">
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
        <div className="p-3 flex flex-col h-full">
          <Link href={`/product/${product.slug}`} className="block flex-grow">
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
              ({product.reviewCount})
            </span>
          </div>

          {/* Price - Always visible */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
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
    </div>
  )
}
