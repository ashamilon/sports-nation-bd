'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  Loader2,
  X,
  TrendingUp,
  Clock,
  Heart,
  ShoppingCart,
  Eye,
  ArrowLeft,
  SortAsc,
  SortDesc
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  Category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  _count: {
    Product: number
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [isHydrated, setIsHydrated] = useState(false)

  // Store hooks
  const { addItem: addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, items: wishlistItems, isInWishlist: isInWishlistStore } = useWishlistStore()

  useEffect(() => {
    // Handle hydration
    setIsHydrated(true)
    
    if (query) {
      performSearch()
      addToSearchHistory(query)
    }
    loadSearchData()
  }, [query, filters])

  const loadSearchData = () => {
    if (typeof window !== 'undefined') {
      // Load search history from localStorage
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      setSearchHistory(history)
      setRecentSearches(history.slice(0, 5))
    }
    
    // Set popular searches (you can make this dynamic)
    setPopularSearches(['jersey', 'football', 'sports', 'shoes', 'apparel'])
  }

  const addToSearchHistory = (searchTerm: string) => {
    if (!searchTerm.trim() || typeof window === 'undefined') return
    
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const updatedHistory = [searchTerm, ...history.filter((item: string) => item !== searchTerm)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
    setSearchHistory(updatedHistory)
    setRecentSearches(updatedHistory.slice(0, 5))
  }

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.results.products)
        setCategories(data.results.categories)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0]
    }
    return '/api/placeholder/300/300'
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance'
    })
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images),
      quantity: 1
    })
  }

  const handleWishlistToggle = (product: Product) => {
    const isInWishlist = isInWishlistStore(product.id)
    if (isInWishlist) {
      removeFromWishlist('', product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm)
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const isInWishlist = (productId: string) => {
    return isInWishlistStore(productId)
  }

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Search' },
            ...(query ? [{ label: query }] : [])
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Search Results
              </h1>
              <p className="text-muted-foreground">
                {query ? `Results for "${query}"` : 'Search for products'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchInput)
                }
              }}
            />
            
            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Popular Searches */}
                <div className="p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(search)}
                      className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            
            {Object.values(filters).some(value => value) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 p-6 bg-muted/50 rounded-lg border border-border/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Related Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category._count.Product} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        )}

        {/* Products */}
        {!isLoading && products.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Products ({products.length})
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <div className="bg-muted/50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative overflow-hidden">
                        <Link href={`/product/${product.slug}`}>
                          <Image
                            src={getImageUrl(product.images)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </Link>
                        
                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className={`p-2 rounded-full shadow-lg transition-colors ${
                              isInWishlist(product.id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/90 text-gray-700 hover:bg-white'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Discount Badge */}
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.Category.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-sm text-red-500 line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                          {product.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {product.averageRating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                      <Link href={`/product/${product.slug}`} className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={getImageUrl(product.images)}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-medium text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.Category.name}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-sm text-red-500 line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                          {product.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {product.averageRating} ({product.reviewCount})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            isInWishlist(product.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && products.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
              <Link
                href="/products"
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!isLoading && products.length === 0 && query && (
          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border/50">
            <h4 className="font-semibold text-foreground mb-3">Search Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Try different keywords or synonyms</li>
              <li>• Check your spelling</li>
              <li>• Use more general terms</li>
              <li>• Remove filters to see more results</li>
            </ul>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
