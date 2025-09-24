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
    CollectionProduct: number
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
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const { getTotalItems, toggleCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
    fetchMenuConfigs()
  }, [])

  const fetchMenuConfigs = async () => {
    try {
      setIsMenuLoading(true)
      
      // Check client-side cache first
      const cacheKey = 'header-menu-cache'
      const cachedData = localStorage.getItem(cacheKey)
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`)
      const now = Date.now()
      const cacheExpiry = 5 * 60 * 1000 // 5 minutes
      
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
        const parsedData = JSON.parse(cachedData)
        setMenuConfigs(parsedData.menuConfigs)
        setAllCollections(parsedData.collections)
        setIsMenuLoading(false)
        return
      }
      
      // Fetch menu configs and collections in parallel
      const [menuResponse, collectionsResponse] = await Promise.all([
        fetch('/api/cms/menu-config', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/collections?isActive=true&limit=50', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
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
      
      // Cache the data for faster subsequent loads
      const dataToCache = {
        menuConfigs: menuData.success ? menuData.data.filter((config: MenuConfig) => 
          config.menuType === 'header' && config.isActive
        ) : [],
        collections: collectionsData.success ? collectionsData.data : []
      }
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache))
      localStorage.setItem(`${cacheKey}-timestamp`, now.toString())
      
    } catch (error) {
      console.error('Error fetching menu configs:', error)
    } finally {
      setIsMenuLoading(false)
    }
  }

  const getCollectionsForMenu = (config: MenuConfig): Collection[] => {
    try {
      const collectionIds = JSON.parse(config.collections)
      const filteredCollections = allCollections.filter(collection => 
        collectionIds.includes(collection.id)
      )
      
      return filteredCollections.map(collection => ({
        ...collection,
        productCount: collection._count?.CollectionProduct || 0
      }))
    } catch (error) {
      console.error('Error parsing collections for menu:', error)
      return []
    }
  }

  const toggleMenuExpansion = (menuName: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuName)) {
        newSet.delete(menuName)
      } else {
        newSet.add(menuName)
      }
      return newSet
    })
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
    setExpandedMenus(new Set()) // Close all expanded menus
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && isMounted) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-mobile-menu]')) {
          closeMobileMenu()
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, isMounted])


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
    .map(config => {
      const collections = getCollectionsForMenu(config)
      return {
        name: config.title,
        type: 'menu-dropdown' as const,
        config: config,
        collections: collections
      }
    })

  const navigation = [
    staticNavigation[0], // Home
    ...existingDropdowns, // Existing dropdown menus (Jerseys, Sneakers, Shorts, Watches)
    ...staticNavigation.slice(1) // Rest of static navigation (Loyalty, Custom Jerseys, About, Contact)
  ]



  return (
    <>
      {/* Header Side Scrolling Notification Bar */}
      <div className="bg-primary text-white py-2 overflow-hidden">
        <div className="animate-scroll">
          <div className="flex space-x-8 whitespace-nowrap">
            <span>🚚 Free delivery on orders over ৳2,000</span>
            <span>💳 Secure payment with SSLCommerz</span>
            <span>📞 Call us: +880 1647 429992</span>
            <span>🚚 Free delivery on orders over ৳2,000</span>
            <span>💳 Secure payment with SSLCommerz</span>
            <span>📞 Call us: +880 1647 429992</span>
          </div>
        </div>
      </div>

    <header className="sticky top-0 z-50 w-full glass-nav">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {isMenuLoading ? (
              // Loading skeleton for navigation
              <>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </>
            ) : (
              navigation.map((item) => (
                <div key={item.name}>
                  {item.type === 'menu-dropdown' ? (
                    <HeaderDropdown
                      title={item.name}
                      collections={'collections' in item ? item.collections : []}
                      href={`/collections`}
                    />
                  ) : item.type === 'loyalty-dropdown' ? (
                    <LoyaltyDropdown
                      title={item.name}
                    />
                  ) : (
                    <Link
                      href={'href' in item ? item.href || '#' : '#'}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))
            )}
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
              onClick={() => isMenuOpen ? closeMobileMenu() : setIsMenuOpen(true)}
              className="md:hidden glass-button p-2 rounded-lg"
              data-mobile-menu
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>


        {/* Mobile Navigation */}
        {isMounted && isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[120px] bg-background/95 backdrop-blur-sm z-50 overflow-y-auto" data-mobile-menu>
            <div className="py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-2 px-4">
              {isMenuLoading ? (
                // Loading skeleton for mobile navigation
                <>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-8 bg-gray-300 rounded w-full"></div>
                    </div>
                  ))}
                </>
              ) : (
                navigation.map((item) => (
                <div key={item.name}>
                  {item.type === 'menu-dropdown' ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenuExpansion(item.name)}
                        className="w-full glass-button px-4 py-2 rounded-lg font-medium text-primary flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenus.has(item.name) ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMenus.has(item.name) && (
                        <div className="ml-4 space-y-1">
                          {'collections' in item && item.collections.map((collection) => (
                            <Link
                              key={collection.id}
                              href={`/collections/${collection.slug}`}
                              className="block glass-button px-4 py-2 rounded-lg text-sm"
                              onClick={() => closeMobileMenu()}
                            >
                              {collection.name}
                              <span className="text-xs text-muted-foreground ml-2">
                                ({collection._count?.CollectionProduct || 0})
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : item.type === 'loyalty-dropdown' ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenuExpansion(item.name)}
                        className="w-full glass-button px-4 py-2 rounded-lg font-medium text-primary flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenus.has(item.name) ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMenus.has(item.name) && (
                        <div className="ml-4 space-y-1">
                          <Link
                            href="/loyalty-status"
                            className="block glass-button px-4 py-2 rounded-lg text-sm"
                            onClick={() => closeMobileMenu()}
                          >
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>Loyalty Status</span>
                            </div>
                          </Link>
                          <Link
                            href="/loyalty-demo"
                            className="block glass-button px-4 py-2 rounded-lg text-sm"
                            onClick={() => closeMobileMenu()}
                          >
                            <div className="flex items-center space-x-2">
                              <Gift className="w-4 h-4 text-purple-500" />
                              <span>Loyalty Demo</span>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={'href' in item ? item.href || '#' : '#'}
                      className="w-full glass-button px-4 py-2 rounded-lg font-medium text-primary flex items-center justify-between"
                      onClick={() => closeMobileMenu()}
                    >
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
                ))
              )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>

    {/* Search Modal */}
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </>
  )
}
