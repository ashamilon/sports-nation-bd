'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  Filter, 
  Star, 
  TrendingUp, 
  Clock,
  Tag,
  ChevronRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  products: Product[]
  categories: Category[]
  suggestions: Suggestion[]
  total: number
  hasMore: boolean
}

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

interface Suggestion {
  text: string
  type: 'product' | 'category'
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch()
      }, 300)
    } else {
      setResults(null)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, filters])

  const performSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        
        // Add to search history
        addToSearchHistory(query)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToSearchHistory = (searchTerm: string) => {
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const handleSuggestionClick = (suggestion: string) => {
    addToSearchHistory(suggestion)
    onClose()
    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&sortBy=${filters.sortBy}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      addToSearchHistory(query)
      onClose()
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query)}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&sortBy=${filters.sortBy}`
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-2 left-2 right-2 sm:top-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-full sm:max-w-2xl bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl z-50"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-border/50">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  showFilters ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </form>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-border/50 p-3 sm:p-4 space-y-4"
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Max Price</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Searching...</span>
                </div>
              )}

              {!isLoading && !query && (
                <div className="p-3 sm:p-4">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Recent Searches</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(term)}
                            className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm text-foreground transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium text-foreground">Popular Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Jersey', 'Football', 'Shoes', 'Sports', 'Training'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm text-foreground transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && query && results && (
                <div className="p-3 sm:p-4">
                  {/* Results Summary */}
                  <div className="mb-4 text-sm text-muted-foreground">
                    {results.total} result{results.total !== 1 ? 's' : ''} found for "{query}"
                  </div>

                  {/* Categories */}
                  {results.categories.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Categories</h3>
                      </div>
                      <div className="space-y-2">
                        {results.categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div>
                              <div className="font-medium text-foreground">{category.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {category._count.Product} products
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {results.products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Products</h3>
                      </div>
                      <div className="space-y-3">
                        {results.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={getImageUrl(product.images)}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.Category.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-medium text-foreground">
                                  {formatPrice(product.price)}
                                </span>
                                {product.comparePrice && product.comparePrice > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.comparePrice)}
                                  </span>
                                )}
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
                          </Link>
                        ))}
                      </div>

                      {results.hasMore && (
                        <div className="mt-4 text-center">
                          <Link
                            href={`/search?q=${encodeURIComponent(query)}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&sortBy=${filters.sortBy}`}
                            onClick={onClose}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            View all {results.total} results
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Results */}
                  {results.total === 0 && (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">No results found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search terms or filters
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
