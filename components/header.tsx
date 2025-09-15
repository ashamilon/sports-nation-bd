"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart-store'
import { ThemeToggle } from '@/components/theme-toggle'
import Logo from '@/components/logo'
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  Heart,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { RegionalSelector } from './regional-selector'
import { RegionalTopBar } from './regional-topbar'
import CategoryDropdown from './category-dropdown'

interface Collection {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [collections, setCollections] = useState<Record<string, Collection[]>>({})
  const { getTotalItems, toggleCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleCategory = async (categoryName: string, parentId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
        // Fetch collections when expanding
        if (!collections[categoryName]) {
          fetchCollections(categoryName, parentId)
        }
      }
      return newSet
    })
  }

  const fetchCollections = async (categoryName: string, parentId: string) => {
    try {
      const response = await fetch(`/api/collections?isActive=true&parentId=${parentId}`)
      const data = await response.json()
      
      if (data.success) {
        setCollections(prev => ({
          ...prev,
          [categoryName]: data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Watches', type: 'category-dropdown', categorySlug: 'watches', parentId: 'watches_collection' },
    { name: 'Sneakers', type: 'category-dropdown', categorySlug: 'sneakers', parentId: 'sneakers_collection' },
    { name: 'Jerseys', type: 'category-dropdown', categorySlug: 'jerseys', parentId: 'jerseys_collection' },
    { name: 'Shorts', type: 'category-dropdown', categorySlug: 'shorts', parentId: 'shorts_collection' },
    { name: 'Custom Jerseys', href: '/custom-jerseys' },
    { name: 'Loyalty Status', href: '/loyalty-status' },
    { name: 'Loyalty Demo', href: '/loyalty-demo' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      {/* Top Bar */}
      <RegionalTopBar />

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.type === 'category-dropdown' ? (
                  <CategoryDropdown
                    categoryName={item.name}
                    categorySlug={item.categorySlug}
                    parentCollectionId={item.parentId}
                  />
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="glass-button p-2 rounded-lg"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button className="glass-button p-2 rounded-lg">
              <Heart className="h-5 w-5" />
            </button>

            {/* Regional Selector */}
            <RegionalSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account */}
            <Link href="/dashboard" className="glass-button p-2 rounded-lg">
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="glass-button relative p-2 rounded-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass-button p-2 rounded-lg"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isMounted && isSearchOpen && (
          <div className="py-4 border-t border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products..."
                className="glass-input w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMounted && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.type === 'category-dropdown' ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleCategory(item.name, item.parentId)}
                        className="w-full flex items-center justify-between glass-button px-4 py-2 rounded-lg font-medium text-primary"
                      >
                        <span>{item.name}</span>
                        {expandedCategories.has(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {expandedCategories.has(item.name) && (
                        <div className="ml-4 space-y-1">
                          {/* Show actual collections */}
                          {collections[item.name] && collections[item.name].length > 0 ? (
                            collections[item.name].map((collection) => (
                              <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="block glass-button px-4 py-2 rounded-lg text-sm"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {collection.name}
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({collection._count.products})
                                </span>
                              </Link>
                            ))
                          ) : (
                            <div className="text-xs text-muted-foreground px-4 py-2">
                              Loading collections...
                            </div>
                          )}
                          
                          {/* View All Category Link */}
                          <Link
                            href={`/category/${item.categorySlug}`}
                            className="block glass-button px-4 py-2 rounded-lg text-sm border-t border-border/50 mt-2 pt-2"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            View All {item.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="glass-button px-4 py-2 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
