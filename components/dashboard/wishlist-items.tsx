"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search,
  Filter,
  Package,
  Star,
  Eye
} from 'lucide-react'

export default function WishlistItems() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')

  // Mock wishlist data - replace with actual data from API
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Nike Air Max 270',
      price: '৳12,000',
      originalPrice: '৳15,000',
      image: '/api/placeholder/200/200',
      inStock: true,
      rating: 4.8,
      reviews: 124,
      category: 'Sneakers',
      addedDate: '2024-01-20',
      size: '42',
      color: 'White/Black'
    },
    {
      id: 2,
      name: 'Barcelona Home Jersey 2024',
      price: '৳2,500',
      originalPrice: '৳3,000',
      image: '/api/placeholder/200/200',
      inStock: false,
      rating: 4.9,
      reviews: 89,
      category: 'Jerseys',
      addedDate: '2024-01-18',
      size: 'L',
      color: 'Blue/Red'
    },
    {
      id: 3,
      name: 'Naviforce Watch NF9028',
      price: '৳8,500',
      originalPrice: '৳10,000',
      image: '/api/placeholder/200/200',
      inStock: true,
      rating: 4.7,
      reviews: 67,
      category: 'Watches',
      addedDate: '2024-01-15',
      size: 'One Size',
      color: 'Black'
    },
    {
      id: 4,
      name: 'Real Madrid Away Jersey 2024',
      price: '৳2,800',
      originalPrice: '৳3,200',
      image: '/api/placeholder/200/200',
      inStock: true,
      rating: 4.6,
      reviews: 45,
      category: 'Jerseys',
      addedDate: '2024-01-12',
      size: 'M',
      color: 'Purple'
    },
    {
      id: 5,
      name: 'Adidas Ultraboost 22',
      price: '৳15,000',
      originalPrice: '৳18,000',
      image: '/api/placeholder/200/200',
      inStock: true,
      rating: 4.9,
      reviews: 203,
      category: 'Sneakers',
      addedDate: '2024-01-10',
      size: '41',
      color: 'White'
    }
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  const addToCart = (item: any) => {
    // Add to cart logic
    console.log('Added to cart:', item)
  }

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const aPrice = a.price ? parseFloat(a.price.replace(/[^\d]/g, '')) : 0
        const bPrice = b.price ? parseFloat(b.price.replace(/[^\d]/g, '')) : 0
        return aPrice - bPrice
      case 'price-high':
        const aPriceHigh = a.price ? parseFloat(a.price.replace(/[^\d]/g, '')) : 0
        const bPriceHigh = b.price ? parseFloat(b.price.replace(/[^\d]/g, '')) : 0
        return bPriceHigh - aPriceHigh
      case 'rating':
        return b.rating - a.rating
      case 'date':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">Your saved favorite products</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2 rounded-lg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-4 py-2 rounded-lg"
            >
              <option value="date">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl group"
          >
            {/* Product Image */}
            <div className="relative mb-4">
              <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Product Image</span>
              </div>
              
              {/* Stock Status */}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.inStock 
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Remove from Wishlist */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 glass-button p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(item.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-foreground">{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {item.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Product Details */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Size: {item.size}</p>
                <p>Color: {item.color}</p>
                <p>Added: {new Date(item.addedDate).toLocaleDateString()}</p>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Link
                  href={`/product/${item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'product'}`}
                  className="flex-1 glass-button py-2 rounded-lg text-center flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
                
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className="flex-1 glass-button py-2 rounded-lg text-center flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedItems.length === 0 && (
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
      {sortedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {sortedItems.length} items in your wishlist
              </h3>
              <p className="text-muted-foreground">
                Total value: ৳{sortedItems.reduce((sum, item) => 
                  sum + (item.price ? parseFloat(item.price.replace(/[^\d]/g, '')) : 0), 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="glass-button px-4 py-2 rounded-lg">
                Share Wishlist
              </button>
              <button className="glass-button px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                Add All to Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
