"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useCartStore } from '@/lib/store/cart-store'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search,
  Filter,
  Package,
  Star,
  Eye,
  Loader2
} from 'lucide-react'

export default function WishlistItems() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [isHydrated, setIsHydrated] = useState(false)
  
  const { 
    items: wishlistItems, 
    isLoading, 
    error, 
    fetchWishlist, 
    removeFromWishlist,
    clearError 
  } = useWishlistStore()
  
  const { addItem } = useCartStore()

  useEffect(() => {
    setIsHydrated(true)
    fetchWishlist()
  }, [fetchWishlist])

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading...</span>
      </div>
    )
  }

  const handleRemoveFromWishlist = async (itemId: string) => {
    const success = await removeFromWishlist(itemId)
    if (success) {
      // Item removed successfully
    }
  }

  const handleAddToCart = (item: any) => {
    if (!item.product) {
      console.error('Product data is missing for wishlist item:', item)
      return
    }
    
    const productData = {
      productId: item.product.id,
      name: item.product.name,
      price: item.variant?.price || item.product.price,
      image: getImageUrl(item.product.images),
      quantity: 1,
      variantId: item.variant?.id,
      variantName: item.variant ? `${item.variant.name}: ${item.variant.value}` : undefined
    }
    
    addItem(productData)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getImageUrl = (images: string) => {
    // If images is already a URL (from API transformation), return it directly
    if (images && (images.startsWith('http') || images.startsWith('/'))) {
      return images
    }
    
    // Otherwise, try to parse as JSON array
    try {
      const imageArray = JSON.parse(images || '[]')
      return imageArray[0] || '/api/placeholder/300/300'
    } catch {
      return '/api/placeholder/300/300'
    }
  }

  const filteredItems = wishlistItems.filter(item =>
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.product?.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const aPrice = a.variant?.price || a.product?.price || 0
        const bPrice = b.variant?.price || b.product?.price || 0
        return aPrice - bPrice
      case 'price-high':
        const aPriceHigh = a.variant?.price || a.product?.price || 0
        const bPriceHigh = b.variant?.price || b.product?.price || 0
        return bPriceHigh - aPriceHigh
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading wishlist...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => { clearError(); fetchWishlist(); }}
          className="glass-button px-6 py-3 rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.filter(item => item.product).length} {wishlistItems.filter(item => item.product).length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-button rounded-lg border-0 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-button rounded-lg border-0 focus:ring-2 focus:ring-primary/20"
          >
            <option value="date">Date Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedItems.filter(item => item.product).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-3 rounded-xl group hover:shadow-lg transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative mb-2">
              <Link href={`/product/${item.product.slug}`}>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={getImageUrl(item.product.images)}
                    alt={item.product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              {/* Remove from Wishlist */}
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-1 right-1 glass-button p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {item.product.category?.name || 'Category'}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  (item.variant?.stock || item.product.stock) > 0
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {(item.variant?.stock || item.product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <h3 className="font-medium text-xs text-foreground line-clamp-2">
                {item.product.name}
              </h3>
              
              {item.variant && (
                <p className="text-xs text-muted-foreground">
                  {item.variant.name}: {item.variant.value}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(item.variant?.price || item.product.price)}
                  </span>
                  {item.product.comparePrice && (
                    <span className="text-xs text-red-500 line-through">
                      {formatPrice(item.product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-1 pt-2">
              <Link
                href={`/product/${item.product.slug}`}
                className="flex-1 glass-button py-1.5 rounded-lg text-center flex items-center justify-center space-x-1"
              >
                <Eye className="h-3 w-3" />
                <span className="text-xs">View</span>
              </Link>
              
              <button
                onClick={() => handleAddToCart(item)}
                disabled={(item.variant?.stock || item.product.stock) <= 0}
                className="flex-1 glass-button py-1.5 rounded-lg text-center flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-3 w-3" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedItems.filter(item => item.product).length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? 'No items match your search criteria.'
              : 'Start adding products you love to your wishlist!'
            }
          </p>
          <Link href="/products" className="glass-button px-6 py-3 rounded-lg">
            Browse Products
          </Link>
        </motion.div>
      )}

      {/* Wishlist Summary */}
      {sortedItems.filter(item => item.product).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Wishlist Summary</h3>
              <p className="text-muted-foreground">
                {sortedItems.filter(item => item.product).length} {sortedItems.filter(item => item.product).length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold text-foreground">
                {formatPrice(
                  sortedItems.filter(item => item.product).reduce((total, item) => 
                    total + (item.variant?.price || item.product?.price || 0), 0
                  )
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}