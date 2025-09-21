"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, Share2, Ruler } from 'lucide-react'
import SizeChart from './size-chart'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string
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
  category: {
    name: string
    slug: string
  }
  reviews: Array<{
    id: string
    rating: number
    comment?: string
    user: {
      name?: string
      image?: string
    }
    createdAt: string
  }>
  allowNameNumber?: boolean
  nameNumberPrice?: number
  badges?: Array<{
    id: string
    name: string
    description?: string
    price: number
    image?: string
  }>
}

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const { addItem } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  // Hydrate the wishlist store on client side
  useEffect(() => {
    setIsHydrated(true)
    fetchWishlistForProduct()
  }, [])

  const fetchWishlistForProduct = async () => {
    try {
      const response = await fetch(`/api/wishlist/check?productIds=${product.id}`)
      const data = await response.json()
      if (data.success) {
        const { setState } = useWishlistStore.getState()
        setState((state) => ({
          ...state,
          items: data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching wishlist for product:', error)
    }
  }

  const handleToggleWishlist = async () => {
    if (!isHydrated) return
    
    let variantId = undefined
    if (product.category.slug === 'jersey' && selectedVariants['Size'] && selectedVariants['Fabric']) {
      const selectedFabricVariant = product.variants.find(v => v.fabricType === selectedVariants['Fabric'])
      variantId = selectedFabricVariant?.id
    } else {
      const variant = product.variants.find(v => 
        v.name && v.value && 
        selectedVariants[v.name] === v.value
      )
      variantId = variant?.id
    }

    const isCurrentlyInWishlist = isInWishlist(product.id, variantId)
    
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(product.id, variantId)
      toast.success('Removed from wishlist!')
    } else {
      await addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[selectedImage] || '/api/placeholder/300',
        variantId: variantId
      })
      toast.success('Added to wishlist!')
    }
  }

  const handleVariantChange = (variantName: string, variantValue: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: variantValue
    }))
  }

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges(prev => 
      prev.includes(badgeId) 
        ? prev.filter(id => id !== badgeId)
        : [...prev, badgeId]
    )
  }

  const handleAddToCart = () => {
    // Check if variants are required but not selected
    if (product.variants.length > 0 && product.category.slug === 'jersey') {
      if (!selectedVariants['Fabric'] || !selectedVariants['Size']) {
        toast.error('Please select fabric type and size')
        return
      }
    }
    
    let totalPrice = product.price
    let variantId = undefined
    
    // For new Jersey variant structure with fabricType and sizes
    if (product.category.slug === 'jersey' && selectedVariants['Size'] && selectedVariants['Fabric']) {
      const selectedFabricVariant = product.variants.find(v => v.fabricType === selectedVariants['Fabric'])
      if (selectedFabricVariant?.sizes) {
        try {
          const sizes = JSON.parse(selectedFabricVariant.sizes)
          const selectedSize = sizes.find((s: any) => s.size === selectedVariants['Size'])
          if (selectedSize) {
            totalPrice = selectedSize.price
            variantId = selectedFabricVariant.id
          }
        } catch (error) {
          console.error('Error parsing sizes:', error)
        }
      }
    } else {
      // For other products, add any variant price adjustments
      Object.entries(selectedVariants).forEach(([variantName, variantValue]) => {
        const variant = product.variants.find(v => v.name === variantName && v.value === variantValue)
        if (variant && variant.price && variant.price !== product.price) {
          totalPrice += (variant.price - product.price)
          variantId = variant.id
        }
      })
    }
    
    // Add name/number price if selected
    if (product.allowNameNumber && (customName || customNumber)) {
      totalPrice += product.nameNumberPrice || 250
    }
    
    // Add badge prices
    const selectedBadgeObjects = product.badges?.filter(badge => selectedBadges.includes(badge.id)) || []
    const badgeTotal = selectedBadgeObjects.reduce((sum, badge) => sum + badge.price, 0)
    totalPrice += badgeTotal

    const customOptions = {
      name: customName,
      number: customNumber,
      badges: selectedBadges,
      badgeTotal,
      size: selectedVariants['Size'] || undefined,
      fabric: selectedVariants['Fabric'] || undefined
    }

    // Create variant name string from selected variants
    let variantName = ''
    if (product.category.slug === 'jersey' && selectedVariants['Fabric'] && selectedVariants['Size']) {
      variantName = `Fabric: ${selectedVariants['Fabric']}, Size: ${selectedVariants['Size']}`
    } else if (Object.keys(selectedVariants).length > 0) {
      variantName = Object.entries(selectedVariants)
        .filter(([name, value]) => value && value !== 'null')
        .map(([name, value]) => `${name}: ${value}`)
        .join(', ')
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: totalPrice,
      image: product.images[selectedImage] || '/api/placeholder/300',
      quantity,
      variantId: variantId,
      variantName: variantName || undefined,
      customOptions: (customName || customNumber || selectedBadges.length > 0 || selectedVariants['Size'] || selectedVariants['Fabric']) ? customOptions : undefined
    })
    
    toast.success('Added to cart!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                unoptimized={product.images[selectedImage].includes('/api/placeholder')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized={image.includes('/api/placeholder')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
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
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
            {selectedBadges.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                +{formatCurrency(product.badges?.filter(badge => selectedBadges.includes(badge.id)).reduce((sum, badge) => sum + badge.price, 0) || 0)} for premium badges
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              {/* Check if this is a Jersey with new variant structure */}
              {product.category.slug === 'jersey' && product.variants.some(v => v.fabricType) ? (
                // New Jersey variant structure with fabricType and sizes
                <div className="space-y-4">
                  {/* Fabric Type Selector */}
                  <div>
                    <h4 className="font-medium mb-2">Fabric Type</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange('Fabric', variant.fabricType || '')}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedVariants['Fabric'] === variant.fabricType
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {variant.fabricType}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Size Selector - Show sizes for selected fabric */}
                  {selectedVariants['Fabric'] && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Size</h4>
                        <button
                          onClick={() => setShowSizeChart(true)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Ruler className="h-4 w-4" />
                          Size Chart
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {(() => {
                          const selectedFabricVariant = product.variants.find(v => v.fabricType === selectedVariants['Fabric'])
                          if (!selectedFabricVariant?.sizes) return null
                          
                          try {
                            const sizes = JSON.parse(selectedFabricVariant.sizes)
                            return sizes.map((sizeItem: any) => (
                              <button
                                key={sizeItem.size}
                                onClick={() => handleVariantChange('Size', sizeItem.size)}
                                className={`px-4 py-2 border rounded-lg transition-colors ${
                                  selectedVariants['Size'] === sizeItem.size
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {sizeItem.size}
                                {sizeItem.price && sizeItem.price !== product.price && (
                                  <span className="ml-1 text-xs">
                                    ({formatCurrency(sizeItem.price)})
                                  </span>
                                )}
                              </button>
                            ))
                          } catch (error) {
                            console.error('Error parsing sizes:', error)
                            return null
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Original variant structure
                Object.entries(
                  product.variants.reduce((acc, variant) => {
                    if (!acc[variant.name || '']) acc[variant.name || ''] = []
                    acc[variant.name || ''].push(variant)
                    return acc
                  }, {} as Record<string, typeof product.variants>)
                ).map(([variantName, variants]) => (
                  <div key={variantName}>
                    <h4 className="font-medium mb-2">{variantName}</h4>
                    <div className="flex gap-2 flex-wrap">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variantName, variant.value || '')}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedVariants[variantName] === variant.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {variant.value}
                          {variant.price && variant.price !== product.price && (
                            <span className="ml-1 text-xs">
                              (+{formatCurrency(variant.price - product.price)})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Customization Options */}
          {(product.allowNameNumber || (product.badges && product.badges.length > 0)) && (
            <div className="space-y-4">
              <h4 className="font-medium">Customization Options</h4>
              
              {/* Name & Number Customization */}
              {product.allowNameNumber && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">Name & Number Printing</h5>
                    <span className="text-sm text-primary font-medium">
                      +{formatCurrency(product.nameNumberPrice || 250)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add custom name and number to your jersey
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Player Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter name"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Jersey Number</label>
                      <input
                        type="number"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value)}
                        placeholder="Enter number"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-medium">Premium Badges (Optional)</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {product.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedBadges.includes(badge.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleBadgeToggle(badge.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {badge.image && (
                              <Image
                                src={badge.image}
                                alt={badge.name}
                                width={32}
                                height={32}
                                className="rounded"
                                unoptimized={badge.image.includes('/api/placeholder')}
                              />
                            )}
                            <div>
                              <p className="font-medium">{badge.name}</p>
                              {badge.description && (
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            +{formatCurrency(badge.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Validation message for jerseys */}
              {product.category.slug === 'jersey' && (!selectedVariants['Size'] || !selectedVariants['Fabric']) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please select both Size and Fabric Type to add to cart
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border rounded-lg transition-colors ${
                    isHydrated && isInWishlist(product.id, 
                      product.category.slug === 'jersey' && selectedVariants['Size'] && selectedVariants['Fabric'] 
                        ? product.variants.find(v => v.fabricType === selectedVariants['Fabric'])?.id
                        : product.variants.find(v => 
                            v.name && v.value && 
                            selectedVariants[v.name] === v.value
                          )?.id
                    )
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free shipping on orders over ৳2000</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">1 year warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3>
          <div className="grid gap-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized={review.user.image.includes('/api/placeholder')}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {(review.user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.user.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      <SizeChart
        fabricType={selectedVariants['Fabric'] || ''}
        isVisible={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />
    </div>
  )
}
