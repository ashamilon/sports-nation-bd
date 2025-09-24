"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { formatCurrency } from '@/lib/currency'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, Share2, Ruler } from 'lucide-react'
import SizeChart from './size-chart'
import ReviewsSummary from './reviews-summary'
import ReviewsList from './reviews-list'
import ReviewForm from './review-form'
import RelatedProducts from './related-products'
import CollectionCountdownBanner from './collection-countdown-banner'
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
    tracksuitType?: string
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
  collections?: Array<{
    id: string
    name: string
    slug: string
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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'description' | 'wash-care' | 'reviews'>('description')
  const [reviewsKey, setReviewsKey] = useState(0) // Key to force re-render of reviews

  // Calculate display price based on selected variants
  const getDisplayPrice = () => {
    // For tracksuit products, show the variant price as main price
    if (product.category.slug === 'tracksuit' && selectedVariants['Tracksuit Type']) {
      const selectedVariant = product.variants.find(v => v.value === selectedVariants['Tracksuit Type'])
      if (selectedVariant && selectedVariant.price) {
        return selectedVariant.price
      }
    }
    
    // For jersey products, show the size-specific price
    if (product.category.slug === 'jersey' && selectedVariants['Size'] && selectedVariants['Fabric']) {
      const selectedFabricVariant = product.variants.find(v => v.fabricType === selectedVariants['Fabric'])
      if (selectedFabricVariant?.sizes) {
        try {
          const sizes = JSON.parse(selectedFabricVariant.sizes)
          const selectedSize = sizes.find((s: any) => s.size === selectedVariants['Size'])
          if (selectedSize) {
            return selectedSize.price
          }
        } catch (error) {
          console.error('Error parsing sizes:', error)
        }
      }
    }
    
    // For other products, show base price
    return product.price
  }

  // Hydrate the wishlist store on client side
  useEffect(() => {
    setIsHydrated(true)
    fetchWishlistForProduct()
  }, [])

  // Handle tooltip display for mobile
  const handleTooltipShow = (tooltipId: string) => {
    setActiveTooltip(tooltipId)
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setActiveTooltip(null)
    }, 2000)
  }

  const handleTooltipHide = () => {
    setActiveTooltip(null)
  }

  // Handle review updates
  const handleReviewUpdate = () => {
    setReviewsKey(prev => prev + 1)
  }

  // Auto-select fabric type if there's only one available
  useEffect(() => {
    if (product.category.slug === 'jersey' && product.variants.some(v => v.fabricType)) {
      // Get fabric types that have available sizes
      const availableFabricTypes = product.variants
        .filter((variant) => {
          if (!variant.fabricType || !variant.sizes) return false
          
          try {
            const sizes = JSON.parse(variant.sizes)
            const availableSizes = sizes.filter((sizeItem: any) => sizeItem.stock > 0)
            return availableSizes.length > 0
          } catch (error) {
            return false
          }
        })
        .map(v => v.fabricType)
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      
      // If there's only one fabric type with available sizes, auto-select it
      if (availableFabricTypes.length === 1 && !selectedVariants['Fabric']) {
        setSelectedVariants(prev => ({
          ...prev,
          Fabric: availableFabricTypes[0] || ''
        }))
        
        // Don't auto-show size chart - let user decide when to view it
      }
    }
  }, [product.variants, product.category.slug, selectedVariants])

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
      await removeFromWishlist(product.id, product.id, variantId)
      toast.success('Removed from wishlist!')
    } else {
      await addToWishlist(product.id, variantId)
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
    
    if (product.variants.length > 0 && product.category.slug === 'tracksuit') {
      if (!selectedVariants['Tracksuit Type'] || !selectedVariants['Size']) {
        toast.error('Please select tracksuit type and size')
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
    } else if (product.category.slug === 'tracksuit' && selectedVariants['Size'] && selectedVariants['Tracksuit Type']) {
      // For tracksuit variant structure with tracksuitType and sizes
      const selectedTracksuitVariant = product.variants.find(v => v.tracksuitType === selectedVariants['Tracksuit Type'])
      if (selectedTracksuitVariant?.sizes) {
        try {
          const sizes = JSON.parse(selectedTracksuitVariant.sizes)
          const selectedSize = sizes.find((s: any) => s.size === selectedVariants['Size'])
          if (selectedSize) {
            totalPrice = selectedSize.price
            variantId = selectedTracksuitVariant.id
          }
        } catch (error) {
          console.error('Error parsing tracksuit sizes:', error)
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

  const handleBuyNow = () => {
    // Check if variants are required but not selected
    if (product.variants.length > 0 && product.category.slug === 'jersey') {
      if (!selectedVariants['Fabric'] || !selectedVariants['Size']) {
        toast.error('Please select fabric type and size')
        return
      }
    }
    
    if (product.variants.length > 0 && product.category.slug === 'tracksuit') {
      if (!selectedVariants['Tracksuit Type'] || !selectedVariants['Size']) {
        toast.error('Please select tracksuit type and size')
        return
      }
    }
    
    // Redirect directly to checkout with product data
    const selectedVariant = product.category.slug === 'jersey' 
      ? product.variants.find(v => v.fabricType === selectedVariants['Fabric'])
      : product.variants.find(v => 
          v.name && v.value && 
          selectedVariants[v.name] === v.value
        )

    if (!selectedVariant) {
      toast.error('Please select all required options')
      return
    }

    // For jersey products, get the specific size price
    let finalPrice = product.price
    if (product.category.slug === 'jersey' && selectedVariant.sizes) {
      try {
        const sizes = JSON.parse(selectedVariant.sizes)
        const selectedSize = sizes.find((s: any) => s.size === selectedVariants['Size'])
        if (selectedSize && selectedSize.price) {
          finalPrice = selectedSize.price
        }
      } catch (error) {
        console.error('Error parsing sizes:', error)
      }
    } else if (selectedVariant.price) {
      finalPrice = selectedVariant.price
    }

    // Calculate custom options total
    let customOptionsTotal = 0
    const customOptions: any = {}

    if (customName && customNumber) {
      customOptionsTotal += product.nameNumberPrice || 0
      customOptions.name = customName
      customOptions.number = customNumber
    }

    if (selectedBadges.length > 0) {
      customOptionsTotal += selectedBadges.length * 50 // 50 BDT per badge
      customOptions.badges = selectedBadges
    }

    // Add size and fabric info for jersey products
    if (product.category.slug === 'jersey') {
      customOptions.size = selectedVariants['Size']
      customOptions.fabric = selectedVariants['Fabric']
    }

    // Create cart item data
    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images[0],
      quantity,
      variantId: selectedVariant.id,
      variantName: product.category.slug === 'jersey' 
        ? `${selectedVariants['Fabric']} - ${selectedVariants['Size']}`
        : `${selectedVariant.name}: ${selectedVariant.value}`,
      customOptions: {
        ...customOptions,
        badgeTotal: customOptionsTotal
      }
    }

    // Store cart item in sessionStorage for checkout
    sessionStorage.setItem('buyNowItem', JSON.stringify(cartItem))
    // Mark that this is a Buy Now action to clear existing cart
    sessionStorage.setItem('buyNowAction', 'true')
    
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
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
        <div className="space-y-4 md:space-y-6">
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
              {formatCurrency(getDisplayPrice())}
            </span>
            {product.comparePrice && product.comparePrice > getDisplayPrice() && (
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

          {/* Countdown Timer for Limited Time Offer Collection */}
          {product.collections?.some(collection => collection.slug === 'limited-time-offer') && (
            <div className="mt-4">
              <CollectionCountdownBanner
                collectionName="Limited Time Offer"
                productCount={1}
              />
            </div>
          )}

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
                      {product.variants
                        .filter((variant) => variant.fabricType) // Show all fabric types
                        .map((variant) => {
                          // Check if this fabric type has any available sizes
                          let hasAvailableSizes = false
                          if (variant.sizes) {
                            try {
                              const sizes = JSON.parse(variant.sizes)
                              hasAvailableSizes = sizes.some((sizeItem: any) => sizeItem.stock > 0)
                            } catch (error) {
                              hasAvailableSizes = false
                            }
                          }
                          
                          const isDisabled = !hasAvailableSizes
                          const isSelected = selectedVariants['Fabric'] === variant.fabricType
                          
                          return (
                            <div key={variant.id} className="relative group">
                              <button
                                onClick={() => {
                                  if (!isDisabled) {
                                    handleVariantChange('Fabric', variant.fabricType || '')
                                  } else {
                                    handleTooltipShow(`fabric-${variant.id}`)
                                  }
                                }}
                                onTouchStart={() => isDisabled && handleTooltipShow(`fabric-${variant.id}`)}
                                disabled={isDisabled}
                                className={`px-4 py-2 border rounded-lg transition-colors relative ${
                                  isDisabled
                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                    : isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {variant.fabricType}
                                {/* Visual "cut" line for disabled fabric types */}
                                {isDisabled && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-red-400 transform rotate-12"></div>
                                  </div>
                                )}
                              </button>
                              
                              {/* Stock info tooltip that appears on hover and mobile touch */}
                              {isDisabled && (
                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                                  activeTooltip === `fabric-${variant.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                  No Stock Available
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </div>
                          )
                        })}
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
                            
                            return sizes.map((sizeItem: any) => {
                              const isOutOfStock = sizeItem.stock <= 0
                              const isLowStock = sizeItem.stock <= 5 && sizeItem.stock > 0
                              const isSelected = selectedVariants['Size'] === sizeItem.size
                              
                              return (
                                <div key={sizeItem.size} className="relative group">
                                  <button
                                    onClick={() => {
                                      if (!isOutOfStock) {
                                        handleVariantChange('Size', sizeItem.size)
                                      } else {
                                        handleTooltipShow(`size-${sizeItem.size}`)
                                      }
                                    }}
                                    onTouchStart={() => (isOutOfStock || isLowStock) && handleTooltipShow(`size-${sizeItem.size}`)}
                                    disabled={isOutOfStock}
                                    className={`px-4 py-2 border rounded-lg transition-colors relative ${
                                      isOutOfStock
                                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                        : isSelected
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
                                    {/* Visual "cut" line for out of stock items */}
                                    {isOutOfStock && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-red-400 transform rotate-12"></div>
                                      </div>
                                    )}
                                  </button>
                                  
                                  {/* Stock info tooltip that appears on hover and mobile touch */}
                                  {(isOutOfStock || isLowStock) && (
                                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                                      activeTooltip === `size-${sizeItem.size}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                      {isOutOfStock ? 'Out of Stock' : `Only ${sizeItem.stock} left`}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          } catch (error) {
                            console.error('Error parsing sizes:', error)
                            return null
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ) : product.category.slug === 'tracksuit' && product.variants.some(v => v.tracksuitType) ? (
                // Tracksuit variant structure with tracksuitType and sizes
                <div className="space-y-4">
                  {/* Tracksuit Type Selector */}
                  <div>
                    <h4 className="font-medium mb-2">Tracksuit Type</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants
                        .filter((variant) => variant.tracksuitType)
                        .map((variant) => {
                          // Check if this tracksuit type has any available sizes
                          let hasAvailableSizes = false
                          if (variant.sizes) {
                            try {
                              const sizes = JSON.parse(variant.sizes)
                              hasAvailableSizes = sizes.some((sizeItem: any) => sizeItem.stock > 0)
                            } catch (error) {
                              hasAvailableSizes = false
                            }
                          }
                          
                          const isDisabled = !hasAvailableSizes
                          const isSelected = selectedVariants['Tracksuit Type'] === variant.tracksuitType
                          
                          return (
                            <div key={variant.id} className="relative group">
                              <button
                                onClick={() => {
                                  if (!isDisabled) {
                                    handleVariantChange('Tracksuit Type', variant.tracksuitType || '')
                                  } else {
                                    handleTooltipShow(`tracksuit-${variant.id}`)
                                  }
                                }}
                                onTouchStart={() => isDisabled && handleTooltipShow(`tracksuit-${variant.id}`)}
                                disabled={isDisabled}
                                className={`px-4 py-2 border rounded-lg transition-colors relative ${
                                  isDisabled
                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                    : isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {variant.tracksuitType}
                                {variant.price && (
                                  <span className="ml-1 text-xs">
                                    ({formatCurrency(variant.price)})
                                  </span>
                                )}
                                {/* Visual "cut" line for disabled tracksuit types */}
                                {isDisabled && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-red-400 transform rotate-12"></div>
                                  </div>
                                )}
                              </button>
                              
                              {/* Stock info tooltip */}
                              {isDisabled && (
                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                                  activeTooltip === `tracksuit-${variant.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                  No Stock Available
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  
                  {/* Size Selector - Show sizes for selected tracksuit type */}
                  {selectedVariants['Tracksuit Type'] && (
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
                          const selectedTracksuitVariant = product.variants.find(v => v.tracksuitType === selectedVariants['Tracksuit Type'])
                          if (!selectedTracksuitVariant?.sizes) return null
                          
                          try {
                            const sizes = JSON.parse(selectedTracksuitVariant.sizes)
                            
                            return sizes.map((sizeItem: any) => {
                              const isOutOfStock = sizeItem.stock <= 0
                              const isLowStock = sizeItem.stock <= 5 && sizeItem.stock > 0
                              const isSelected = selectedVariants['Size'] === sizeItem.size
                              
                              return (
                                <div key={sizeItem.size} className="relative group">
                                  <button
                                    onClick={() => {
                                      if (!isOutOfStock) {
                                        handleVariantChange('Size', sizeItem.size)
                                      } else {
                                        handleTooltipShow(`size-${sizeItem.size}`)
                                      }
                                    }}
                                    onTouchStart={() => isOutOfStock && handleTooltipShow(`size-${sizeItem.size}`)}
                                    disabled={isOutOfStock}
                                    className={`px-4 py-2 border rounded-lg transition-colors relative ${
                                      isOutOfStock
                                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                        : isSelected
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : isLowStock
                                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                  >
                                    {sizeItem.size}
                                    {sizeItem.price && sizeItem.price !== product.price && (
                                      <span className="ml-1 text-xs">
                                        ({formatCurrency(sizeItem.price)})
                                      </span>
                                    )}
                                    {/* Visual "cut" line for disabled sizes */}
                                    {isOutOfStock && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-red-400 transform rotate-12"></div>
                                      </div>
                                    )}
                                  </button>
                                  
                                  {/* Stock info tooltip */}
                                  {isOutOfStock && (
                                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                                      activeTooltip === `size-${sizeItem.size}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                      Out of Stock
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  )}
                                  
                                  {/* Low stock indicator */}
                                  {isLowStock && !isOutOfStock && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
                                  )}
                                </div>
                              )
                            })
                          } catch (error) {
                            console.error('Error parsing tracksuit sizes:', error)
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
                {!selectedVariants['Fabric'] 
                  ? 'Please select a Fabric Type to see available sizes'
                  : 'Please select a Size to add to cart'
                }
              </p>
            </div>
          )}

          {/* Validation message for tracksuits */}
          {product.category.slug === 'tracksuit' && (!selectedVariants['Size'] || !selectedVariants['Tracksuit Type']) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                {!selectedVariants['Tracksuit Type'] 
                  ? 'Please select a Tracksuit Type to see available sizes'
                  : 'Please select a Size to add to cart'
                }
              </p>
            </div>
          )}

              {/* Add to Cart and Wishlist Buttons Side by Side */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`px-4 md:px-6 py-3 md:py-4 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
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
                  <Heart className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline text-sm md:text-base">
                    {isHydrated && isInWishlist(product.id, 
                      product.category.slug === 'jersey' && selectedVariants['Size'] && selectedVariants['Fabric'] 
                        ? product.variants.find(v => v.fabricType === selectedVariants['Fabric'])?.id
                        : product.variants.find(v => 
                            v.name && v.value && 
                            selectedVariants[v.name] === v.value
                          )?.id
                    ) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>
              </div>

              {/* Buy Now Button - Full Width Below */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 md:py-4 px-6 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                Buy Now
              </button>

              {/* Guaranteed Checkout Section - Just Below Buy Now */}
              <div className="pt-4">
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Secured Checkout with SSLCommerz</h3>
                  <p className="text-sm text-gray-600">Your payment information is safe and secure</p>
                  <div className="flex justify-center">
                    <Image 
                      src="/payment-banner.png" 
                      alt="Payment Methods - VISA, Mastercard, bKash, Nagad, SSLCommerz and more" 
                      width={600}
                      height={100}
                      className="max-w-full h-auto"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex flex-col items-center text-center gap-2 pb-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free shipping on orders over ৳2000</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 pb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">1 year warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 pb-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs - Full Width */}
      <div className="w-full bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'description'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  DESCRIPTION
                </button>
                <button
                  onClick={() => setActiveTab('wash-care')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'wash-care'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  WASH CARE
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  REVIEWS
                </button>
              </nav>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                </div>
              )}

              {activeTab === 'wash-care' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Wash Care</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• Shampoo wash</p>
                    <p>• Do not bleach</p>
                    <p>• Do not use Hot Water</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 md:space-y-6">
                  {/* Reviews Summary */}
                  <ReviewsSummary productId={product.id} />
                  
                  {/* Review Form */}
                  <ReviewForm 
                    productId={product.id}
                    productName={product.name}
                    onReviewSubmitted={handleReviewUpdate}
                  />
                  
                  {/* Reviews List */}
                  <div key={reviewsKey}>
                    <ReviewsList 
                      productId={product.id}
                      productName={product.name}
                      onReviewUpdate={handleReviewUpdate}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Size Chart Modal */}
      <SizeChart
        fabricType={selectedVariants['Fabric'] || ''}
        isVisible={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />

      {/* Related Products Section */}
      <RelatedProducts
        currentProductId={product.id}
        categorySlug={product.category.slug}
        limit={4}
      />
    </div>
  )
}
