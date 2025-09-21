"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Logo from '@/components/logo'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  TrendingUp,
  DollarSign,
  Eye,
  FileText,
  Truck,
  Globe,
  ExternalLink,
  X as XIcon
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Courier', href: '/admin/courier', icon: Truck },
  { name: 'Pathao', href: '/admin/courier/pathao', icon: Truck },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Live Visitors', href: '/admin/visitors', icon: Globe },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Content CMS', href: '/admin/cms', icon: FileText },
  { name: 'SMS Config', href: '/admin/sms-config', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [revenueModalOpen, setRevenueModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Fetch real-time data
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics?range=30d&metric=revenue')
      if (response.ok) {
        const data = await response.json()
        setRevenueData(data)
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  // Fetch data on component mount
  useEffect(() => {
    fetchNotifications()
    fetchRevenueData()
    fetchDashboardStats()
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchNotifications()
      fetchRevenueData()
      fetchDashboardStats()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Mock admin data - replace with actual admin data from auth
  const admin = {
    name: 'Admin User',
    email: 'admin@sportsnationbd.com',
    avatar: '/api/placeholder/40/40',
    role: 'Super Admin',
    lastLogin: '2024-01-15 10:30 AM'
  }


  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
            <Link href="/admin" className="flex items-center space-x-2">
              <Logo size="sm" showText={false} href="" />
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
            <button
              className="lg:hidden glass-button p-2 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-border/50 flex items-center space-x-3 flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src={admin.avatar} 
                alt="Admin Avatar" 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">{admin.name}</p>
              <p className="text-sm text-muted-foreground">{admin.role}</p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent/50'
                      } glass-button`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* Quick Stats */}
            <div className="p-4 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Today's Sales</span>
                <span className="font-semibold text-green-500">
                  {dashboardStats ? `৳${dashboardStats.todaySales.toLocaleString()}` : '৳0'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New Orders</span>
                <span className="font-semibold text-blue-500">
                  {dashboardStats ? dashboardStats.newOrders : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-semibold text-purple-500">
                  {dashboardStats ? dashboardStats.activeUsers : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border/50 flex-shrink-0">
            <motion.button
              onClick={async () => {
                await signOut({ 
                  callbackUrl: '/',
                  redirect: true 
                })
                // Force reload to clear any cached data
                window.location.href = '/'
              }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200 glass-button"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-3 glass-nav border-b border-border/50">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden glass-button p-2 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 rounded-lg"
                title="View Live Site"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 rounded-lg"
                title="Sales Report"
                onClick={() => router.push('/admin/analytics')}
              >
                <TrendingUp className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                title="Revenue Overview"
                onClick={() => setRevenueModalOpen(true)}
              >
                <DollarSign className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors relative"
                title="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{notifications.length}</span>
              </motion.button>
              
              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'order' ? 'bg-blue-500' :
                              notification.type === 'stock' ? 'bg-yellow-500' :
                              notification.type === 'review' ? 'bg-green-500' :
                              notification.type === 'payment' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button className="w-full text-center text-sm text-blue-600 hover:underline">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src={admin.avatar} 
                alt="Admin Avatar" 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Revenue Modal */}
      {revenueModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <button
                onClick={() => setRevenueModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : revenueData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Today</span>
                  <span className="font-semibold text-gray-900">৳{revenueData.today?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Yesterday</span>
                  <span className="font-semibold text-gray-900">৳{revenueData.yesterday?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-semibold text-gray-900">৳{revenueData.thisWeek?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">৳{revenueData.thisMonth?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-semibold text-gray-900">৳{revenueData.lastMonth?.toLocaleString() || '0'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No revenue data available
              </div>
            )}
            
            {revenueData && !loading && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Growth</span>
                  <span className="font-semibold text-green-500">
                    {revenueData.thisMonth && revenueData.lastMonth ? 
                      `+${Math.round(((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth) * 100)}%` : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setRevenueModalOpen(false)
                  router.push('/admin/analytics')
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Detailed Analytics
              </button>
              <button
                onClick={() => setRevenueModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
