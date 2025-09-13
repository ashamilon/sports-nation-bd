"use client"

import { useState } from 'react'
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
  Heart
} from 'lucide-react'
import { RegionalSelector } from './regional-selector'
import { RegionalTopBar } from './regional-topbar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Watches', href: '/category/watches' },
    { name: 'Sneakers', href: '/category/sneakers' },
    { name: 'Jerseys', href: '/category/jerseys' },
    { name: 'Shorts', href: '/category/shorts' },
    { name: 'Custom Jerseys', href: '/custom-jerseys' },
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
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
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
        {isSearchOpen && (
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
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="glass-button px-4 py-2 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
