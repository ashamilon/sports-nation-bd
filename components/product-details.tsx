"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, Share2 } from 'lucide-react'
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
    name: string
    value: string
    price?: number
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

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }))
  }

  const handleAddToCart = () => {
    let totalPrice = product.price
    
    // For jerseys with separate Size and Fabric selections
    if (product.category.slug === 'jerseys' && selectedVariants['Size'] && selectedVariants['Fabric']) {
      // Find the combined variant that matches both size and fabric
      const combinedVariantValue = `${selectedVariants['Size']} - ${selectedVariants['Fabric']}`
      const matchingVariant = product.variants.find(v => v.value === combinedVariantValue)
      
      if (matchingVariant && matchingVariant.price) {
        totalPrice = matchingVariant.price
      }
    } else {
      // For other products, add any variant price adjustments
      Object.entries(selectedVariants).forEach(([variantName, variantValue]) => {
        const variant = product.variants.find(v => v.name === variantName && v.value === variantValue)
        if (variant && variant.price && variant.price !== product.price) {
          totalPrice += (variant.price - product.price)
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
      badgeTotal
    }

    // Create variant name string from selected variants
    const variantName = Object.entries(selectedVariants)
      .map(([name, value]) => `${name}: ${value}`)
      .join(', ')

    addItem({
      productId: product.id,
      name: product.name,
      price: totalPrice,
      image: product.images[selectedImage] || '/api/placeholder/300',
      quantity,
      variantId: undefined, // No single variant ID for separate variants
      variantName: variantName || undefined,
      customOptions: (customName || customNumber || selectedBadges.length > 0) ? customOptions : undefined
    })
    
    toast.success('Added to cart!')
  }

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges(prev => 
      prev.includes(badgeId) 
        ? prev.filter(id => id !== badgeId)
        : [...prev, badgeId]
    )
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
                priority
                unoptimized={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-8xl opacity-20">⚽</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                    unoptimized={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.category.name}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
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
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
            
            {/* Dynamic Price with Customizations */}
            {(customName || customNumber || selectedBadges.length > 0) && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total with customizations:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(
                      product.price + 
                      (product.allowNameNumber && (customName || customNumber) ? (product.nameNumberPrice || 250) : 0) +
                      (product.badges?.filter(badge => selectedBadges.includes(badge.id)).reduce((sum, badge) => sum + badge.price, 0) || 0)
                    )}
                  </span>
                </div>
                {(customName || customNumber) && (
                  <div className="text-xs text-muted-foreground mt-1">
                    +{formatCurrency(product.nameNumberPrice || 250)} for name/number printing
                  </div>
                )}
                {selectedBadges.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    +{formatCurrency(product.badges?.filter(badge => selectedBadges.includes(badge.id)).reduce((sum, badge) => sum + badge.price, 0) || 0)} for premium badges
                  </div>
                )}
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
              {Object.entries(
                product.variants.reduce((acc, variant) => {
                  if (!acc[variant.name]) acc[variant.name] = []
                  acc[variant.name].push(variant)
                  return acc
                }, {} as Record<string, typeof product.variants>)
              ).map(([variantName, variants]) => {
                // For jerseys with combined "Size & Fabric" variants, show separate selectors
                if (variantName.toLowerCase().includes('size') && variantName.toLowerCase().includes('fabric') && product.category.slug === 'jerseys') {
                  // Extract unique sizes and fabrics from combined variants
                  const sizes = [...new Set(variants.map(v => v.value.split(' - ')[0]))].sort((a, b) => {
                    const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
                    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
                  })
                  
                  const fabrics = [...new Set(variants.map(v => v.value.split(' - ')[1]))]
                  
                  return (
                    <div key={variantName} className="space-y-4">
                      {/* Size Selector */}
                      <div>
                        <h4 className="font-medium mb-2">Size</h4>
                        <div className="flex gap-2 flex-wrap">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleVariantChange('Size', size)}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                selectedVariants['Size'] === size
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Fabric Selector */}
                      <div>
                        <h4 className="font-medium mb-2">Fabric Type</h4>
                        <div className="flex gap-2 flex-wrap">
                          {fabrics.map((fabric) => (
                            <button
                              key={fabric}
                              onClick={() => handleVariantChange('Fabric', fabric)}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                selectedVariants['Fabric'] === fabric
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {fabric}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                
                // For other variants, show as before
                return (
                  <div key={variantName}>
                    <h4 className="font-medium mb-2">{variantName}</h4>
                    <div className="flex gap-2 flex-wrap">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variantName, variant.value)}
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
                )
              })}
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
                                <p className="font-medium text-sm">{badge.name}</p>
                                {badge.description && (
                                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm text-primary">
                                +{formatCurrency(badge.price)}
                              </p>
                              <div className={`w-4 h-4 border-2 rounded ${
                                selectedBadges.includes(badge.id)
                                  ? 'border-primary bg-primary'
                                  : 'border-border'
                              }`}>
                                {selectedBadges.includes(badge.id) && (
                                  <div className="w-full h-full bg-white rounded-sm scale-50"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Validation message for jerseys */}
            {product.category.slug === 'jerseys' && (!selectedVariants['Size'] || !selectedVariants['Fabric']) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please select both Size and Fabric Type to add to cart
                </p>
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.category.slug === 'jerseys' && (!selectedVariants['Size'] || !selectedVariants['Fabric'])}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border rounded-lg hover:bg-accent transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Over ৳2,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Money Back</p>
                <p className="text-xs text-muted-foreground">7-15 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
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
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
