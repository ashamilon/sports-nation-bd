"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Package, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { formatCurrency } from '@/lib/currency'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  isActive: boolean
  category?: {
    name: string
    slug: string
  }
  variants?: Array<{
    id: string
    name: string
    value: string
    fabricType?: string
    sizes?: Array<{
      size: string
      price: number
    }>
  }>
}

interface CollectionProduct {
  id: string
  collectionId: string
  productId: string
  sortOrder: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  product: Product
}

interface CollectionProductsProps {
  collectionId: string
  className?: string
}

export default function CollectionProducts({ collectionId, className = "" }: CollectionProductsProps) {
  const [products, setProducts] = useState<CollectionProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCartStore()
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore()

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/collections/${collectionId}/products`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          // Transform the data to match our expected structure
          const transformedData = data.data.map((item: any) => {
            const product = item.product || item.Product // Handle both cases
            
            // Transform the product data to match our interface
            const transformedProduct = {
              ...product,
              variants: product.ProductVariant || product.variants || [],
              category: product.category || { name: 'Jersey', slug: 'jersey' }, // Default category
              averageRating: product.averageRating || 0,
              reviewCount: product.reviewCount || 0
            }
            
            return {
              id: item.id,
              collectionId: item.collectionId,
              productId: item.productId,
              sortOrder: item.sortOrder,
              isFeatured: item.isFeatured,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              product: transformedProduct
            }
          })
          setProducts(transformedData)
        } else {
          throw new Error(data.error || 'Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching collection products:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (collectionId) {
      fetchProducts()
    }
  }, [collectionId, mounted])

  // Function to get price range for Jersey variants
  const getJerseyPriceRange = (variants: Product['variants']) => {
    if (!variants) return null
    
    const prices: number[] = []
    
    variants.forEach(variant => {
      if (variant.sizes) {
        try {
          const sizes = typeof variant.sizes === 'string' ? JSON.parse(variant.sizes) : variant.sizes
          if (Array.isArray(sizes)) {
            sizes.forEach((size: any) => {
              if (size.price) prices.push(size.price)
            })
          }
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

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1
    })
  }

  const handleWishlistToggle = async (product: Product) => {
    const isInWishlist = wishlistItems.some(item => item.productId === product.id)
    
    if (isInWishlist) {
      await removeFromWishlist('', product.id)
    } else {
      await addToWishlist(product.id)
    }
  }



  if (!mounted) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Loading products for collection: {collectionId}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-xl">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }


  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

         if (products.length === 0) {
           return (
             <div className={`text-center py-12 ${className}`}>
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                 <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                 <p className="text-gray-600">This collection doesn't have any products yet.</p>
                 <p className="text-sm text-gray-500 mt-2">Loading state: {loading ? 'true' : 'false'}</p>
                 <p className="text-sm text-gray-500">Error: {error || 'none'}</p>
                 <p className="text-sm text-gray-500">Products count: {products.length}</p>
               </div>
             </div>
           )
         }

         return (
           <div className={`space-y-6 ${className}`}>
             {/* Desktop Products Grid - Vertical Layout */}
             <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               {products.map((collectionProduct, index) => {
                 const product = collectionProduct.product
                 const isInWishlist = wishlistItems.some(item => item.productId === product.id)
                 const variantInfo = getVariantInfo(product)
                 
                 return (
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

                         {/* Featured Badge */}
                         {collectionProduct.isFeatured && (
                           <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                             Featured
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
                           <button 
                             onClick={() => handleWishlistToggle(product)}
                             className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                           >
                             <Heart 
                               className={`h-4 w-4 ${
                                 isInWishlist 
                                   ? 'text-red-500 fill-current' 
                                   : 'text-gray-600 hover:text-red-500'
                               }`} 
                             />
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
                         {variantInfo && (
                           <div className="text-xs text-muted-foreground">
                             {variantInfo.type === 'jersey' && variantInfo.fabrics && (
                               <div className="space-y-1 mt-2">
                                 <div className="flex flex-wrap gap-1">
                                   {variantInfo.fabrics.slice(0, 2).map((fabric, idx) => (
                                     <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                       {fabric}
                                     </span>
                                   ))}
                                   {variantInfo.fabrics.length > 2 && (
                                     <span className="text-xs text-muted-foreground">
                                       +{variantInfo.fabrics.length - 2} more
                                     </span>
                                   )}
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
                             )}
                             {variantInfo.type === 'other' && variantInfo.variants && (
                               <div className="flex flex-wrap gap-1 mt-2">
                                 {variantInfo.variants.map((variant, idx) => (
                                   <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                     {variant.name}: {variant.value}
                                   </span>
                                 ))}
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   </motion.div>
                 )
               })}
             </div>

             {/* Mobile Grid - 2 cards per row */}
             <div className="md:hidden">
               <div className="grid grid-cols-2 gap-4">
                 {products.map((collectionProduct, index) => {
                   const product = collectionProduct.product
                   const isInWishlist = wishlistItems.some(item => item.productId === product.id)
                   const variantInfo = getVariantInfo(product)
                   
                   return (
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

                           {/* Featured Badge */}
                           {collectionProduct.isFeatured && (
                             <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                               Featured
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
                             <button 
                               onClick={() => handleWishlistToggle(product)}
                               className="w-6 h-6 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                             >
                               <Heart 
                                 className={`h-3 w-3 ${
                                   isInWishlist 
                                     ? 'text-red-500 fill-current' 
                                     : 'text-gray-600 hover:text-red-500'
                                 }`} 
                               />
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
                           {variantInfo && (
                             <div className="text-xs text-muted-foreground">
                               {variantInfo.type === 'jersey' && variantInfo.fabrics && (
                                 <div className="space-y-1">
                                   <div className="flex flex-wrap gap-1">
                                     {variantInfo.fabrics.slice(0, 1).map((fabric, idx) => (
                                       <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                         {fabric}
                                       </span>
                                     ))}
                                     {variantInfo.fabrics.length > 1 && (
                                       <span className="text-xs text-muted-foreground">
                                         +{variantInfo.fabrics.length - 1}
                                       </span>
                                     )}
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
                               )}
                               {variantInfo.type === 'other' && variantInfo.variants && (
                                 <div className="flex flex-wrap gap-1">
                                   {variantInfo.variants.slice(0, 1).map((variant, idx) => (
                                     <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                       {variant.name}: {variant.value}
                                     </span>
                                   ))}
                                 </div>
                               )}
                             </div>
                           )}

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
                   )
                 })}
               </div>
             </div>
           </div>
         )
}
