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
  ChevronDown,
  ChevronRight,
  Crown,
  Star,
  Gift
} from 'lucide-react'
import { RegionalSelector } from './regional-selector'
import { RegionalTopBar } from './regional-topbar'
import HeaderDropdown from './header-dropdown'
import LoyaltyDropdown from './loyalty-dropdown'
import SearchModal from './search-modal'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  _count: {
    products: number
  }
}

interface MenuConfig {
  id: string
  menuType: string
  title: string
  collections: string
  isActive: boolean
  sortOrder: number
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const { getTotalItems, toggleCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
    fetchMenuConfigs()
  }, [])

  const fetchMenuConfigs = async () => {
    try {
      // Fetch menu configs and collections in parallel with optimized queries
      const [menuResponse, collectionsResponse] = await Promise.all([
        fetch('/api/cms/menu-config', { 
          cache: 'force-cache',
          next: { revalidate: 300 } // Cache for 5 minutes
        }),
        fetch('/api/collections?isActive=true&limit=50', { 
          cache: 'force-cache',
          next: { revalidate: 300 } // Cache for 5 minutes
        })
      ])
      
      const menuData = await menuResponse.json()
      const collectionsData = await collectionsResponse.json()
      
      if (menuData.success) {
        const filteredConfigs = menuData.data.filter((config: MenuConfig) => 
          config.menuType === 'header' && config.isActive
        )
        setMenuConfigs(filteredConfigs)
      }
      
      if (collectionsData.success) {
        setAllCollections(collectionsData.data)
      }
      
    } catch (error) {
      console.error('Error fetching menu configs:', error)
    }
  }

  const getCollectionsForMenu = (config: MenuConfig): Collection[] => {
    try {
      const collectionIds = JSON.parse(config.collections)
      return allCollections.filter(collection => 
        collectionIds.includes(collection.id)
      ).map(collection => ({
        ...collection,
        productCount: collection._count?.products || 0
      }))
    } catch (error) {
      console.error('Error parsing collections for menu:', error)
      return []
    }
  }


  const staticNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Loyalty', type: 'loyalty-dropdown' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  // Combine static navigation with dynamic menu configurations
  // Put existing dropdown menus (Jerseys, Sneakers, Shorts, Watches) right after Home
  const existingDropdowns = menuConfigs
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(config => ({
      name: config.title,
      type: 'menu-dropdown' as const,
      config: config,
      collections: getCollectionsForMenu(config)
    }))

  const navigation = [
    staticNavigation[0], // Home
    ...existingDropdowns, // Existing dropdown menus (Jerseys, Sneakers, Shorts, Watches)
    ...staticNavigation.slice(1) // Rest of static navigation (Loyalty, Custom Jerseys, About, Contact)
  ]



  return (
    <>
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
                {item.type === 'menu-dropdown' ? (
                  <HeaderDropdown
                    title={item.name}
                    collections={item.collections}
                    href={`/collections`}
                  />
                ) : item.type === 'loyalty-dropdown' ? (
                  <LoyaltyDropdown
                    title={item.name}
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


        {/* Mobile Navigation */}
        {isMounted && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.type === 'menu-dropdown' ? (
                    <div className="space-y-1">
                      <div className="glass-button px-4 py-2 rounded-lg font-medium text-primary">
                        <span>{item.name}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.collections.map((collection) => (
                          <Link
                            key={collection.id}
                            href={`/collections/${collection.slug}`}
                            className="block glass-button px-4 py-2 rounded-lg text-sm"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {collection.name}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({collection.productCount})
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : item.type === 'loyalty-dropdown' ? (
                    <div className="space-y-1">
                      <div className="glass-button px-4 py-2 rounded-lg font-medium text-primary flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span>{item.name}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <Link
                          href="/loyalty-status"
                          className="block glass-button px-4 py-2 rounded-lg text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>Loyalty Status</span>
                          </div>
                        </Link>
                        <Link
                          href="/loyalty-demo"
                          className="block glass-button px-4 py-2 rounded-lg text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <Gift className="w-4 h-4 text-purple-500" />
                            <span>Loyalty Demo</span>
                          </div>
                        </Link>
                      </div>
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

    {/* Search Modal */}
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </>
  )
}
