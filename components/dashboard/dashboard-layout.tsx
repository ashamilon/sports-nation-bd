"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  MapPin, 
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Package
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Tracking', href: '/dashboard/tracking', icon: Package },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Mock user data - replace with actual user data from auth
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/40/40',
    memberSince: '2024-01-15'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden glass-button p-2 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'glass-button bg-primary/20 text-primary border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:glass-button'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-3 w-full px-4 py-3 text-muted-foreground hover:text-foreground hover:glass-button rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile menu button only - hidden for now */}
        <div className="hidden lg:hidden sticky top-0 z-30 glass-nav border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="glass-button p-2 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
