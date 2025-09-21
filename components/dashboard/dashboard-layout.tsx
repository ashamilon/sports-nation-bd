"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
  Package,
  Home
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Back to Home', href: '/', icon: Home, isExternal: true },
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
  const [userProfile, setUserProfile] = useState<any>(null)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        if (data.success) {
          setUserProfile(data.user)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [session?.user?.id])

  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profile-updated') {
        fetchUserProfile()
        // Clear the storage event
        localStorage.removeItem('profile-updated')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Get user data from profile or session
  const user = userProfile || (session?.user ? {
    name: session.user.name || 'User',
    email: session.user.email || '',
    image: session.user.image || null,
    memberSince: 'Recently'
  } : null)

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-sm">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user?.name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              const isHomeLink = item.isExternal
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isHomeLink
                      ? 'text-blue-400 hover:text-blue-300 hover:glass-button border border-blue-400/30'
                      : isActive
                      ? 'glass-button bg-primary/20 text-primary border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:glass-button'
                  }`}
                  onClick={() => !isHomeLink && setSidebarOpen(false)}
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
              onClick={async () => {
                await signOut({ 
                  callbackUrl: '/',
                  redirect: true 
                })
                // Force reload to clear any cached data
                window.location.href = '/'
              }}
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
        {/* Mobile menu button only */}
        <div className="lg:hidden sticky top-0 z-30 glass-nav border-b border-white/10">
          <div className="flex items-center justify-between px-2 py-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="glass-button p-1 rounded-lg"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg border border-blue-400/30 hover:glass-button transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
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
