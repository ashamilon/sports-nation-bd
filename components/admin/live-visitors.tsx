'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Clock, 
  Eye, 
  Globe, 
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  User,
  Monitor,
  Smartphone,
  Tablet,
  ShoppingCart,
  CreditCard,
  CheckCircle
} from 'lucide-react'

interface Visitor {
  id: string
  sessionId: string
  ipAddress: string
  userAgent: string
  country: string | null
  city: string | null
  region: string | null
  timezone: string | null
  isp: string | null
  latitude: number | null
  longitude: number | null
  page: string
  referrer: string | null
  isActive: boolean
  lastSeen: string
  createdAt: string
  pageViews: PageView[]
}

interface PageView {
  id: string
  page: string
  title: string | null
  referrer: string | null
  createdAt: string
}

interface VisitorStats {
  totalVisitors: number
  activeVisitors: number
  uniqueCountries: number
  topCountries: Array<{ country: string; count: number }>
  topPages: Array<{ page: string; views: number }>
  hourlyStats: Array<{ hour: string; visitors: number }>
}

interface BehaviorStats {
  cart_add: number
  checkout: number
  payment_success: number
}

interface Behavior {
  id: string
  sessionId: string
  behavior: string
  productName?: string
  value?: number
  createdAt: string
  Visitor?: {
    country: string | null
    city: string | null
  }
}

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [behaviors, setBehaviors] = useState<Behavior[]>([])
  const [behaviorStats, setBehaviorStats] = useState<BehaviorStats>({
    cart_add: 0,
    checkout: 0,
    payment_success: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchVisitors = async () => {
    try {
      const response = await fetch('/api/admin/visitors?active=true&limit=50')
      const data = await response.json()
      
      if (data.success) {
        setVisitors(data.visitors)
        setStats(data.stats)
        setLastUpdate(new Date())
        setError(null)
      } else {
        setError('Failed to fetch visitor data')
      }
    } catch (err) {
      setError('Error fetching visitor data')
      console.error('Error fetching visitors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBehaviors = async () => {
    try {
      const response = await fetch('/api/visitors/behavior?active=true&limit=50')
      const data = await response.json()
      
      if (data.success) {
        setBehaviors(data.behaviors)
        setBehaviorStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch behavior data:', err)
    }
  }

  useEffect(() => {
    fetchVisitors()
    fetchBehaviors()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchVisitors()
      fetchBehaviors()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getDeviceIcon = (userAgent: string) => {
    if (/mobile/i.test(userAgent)) {
      return <Smartphone className="h-4 w-4" />
    } else if (/tablet/i.test(userAgent)) {
      return <Tablet className="h-4 w-4" />
    } else {
      return <Monitor className="h-4 w-4" />
    }
  }

  const getBrowserInfo = (userAgent: string) => {
    if (/chrome/i.test(userAgent)) return 'Chrome'
    if (/firefox/i.test(userAgent)) return 'Firefox'
    if (/safari/i.test(userAgent)) return 'Safari'
    if (/edge/i.test(userAgent)) return 'Edge'
    return 'Unknown'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const getStatusColor = (isActive: boolean, lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen)
    const now = new Date()
    const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60)
    
    if (isActive && diffInMinutes < 5) {
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
    } else if (diffInMinutes < 30) {
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
    } else {
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading live visitors...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchVisitors}
            className="glass-button px-4 py-2 rounded-lg hover:bg-primary/20"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Visitors</h2>
          <p className="text-muted-foreground">
            Real-time visitor tracking and analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchVisitors}
            className="glass-button p-2 rounded-lg hover:bg-primary/20"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeVisitors}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalVisitors}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-2xl font-bold text-foreground">{stats.uniqueCountries}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.topPages.reduce((sum, page) => sum + page.views, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Customer Behavior Analytics */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Real-time Customer Behavior (Last 10 minutes)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 border-l-4 border-blue-500"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cart Additions</p>
                <p className="text-2xl font-bold text-foreground">{behaviorStats.cart_add}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 border-l-4 border-yellow-500"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checkout Started</p>
                <p className="text-2xl font-bold text-foreground">{behaviorStats.checkout}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payments Completed</p>
                <p className="text-2xl font-bold text-foreground">{behaviorStats.payment_success}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Behaviors */}
        {behaviors.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-foreground mb-3">Recent Customer Actions</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {behaviors.slice(0, 10).map((behavior) => (
                <motion.div
                  key={behavior.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center space-x-3">
                    {behavior.behavior === 'cart_add' && <ShoppingCart className="h-4 w-4 text-blue-600" />}
                    {behavior.behavior === 'checkout' && <CreditCard className="h-4 w-4 text-yellow-600" />}
                    {behavior.behavior === 'payment_success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {behavior.behavior === 'cart_add' && 'Added to Cart'}
                        {behavior.behavior === 'checkout' && 'Started Checkout'}
                        {behavior.behavior === 'payment_success' && 'Payment Completed'}
                      </p>
                      {behavior.productName && (
                        <p className="text-xs text-muted-foreground">{behavior.productName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {behavior.value && (
                      <p className="text-sm font-medium text-foreground">৳{behavior.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(behavior.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Visitors List */}
      <div className="glass-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Live Visitors</h3>
          <p className="text-sm text-muted-foreground">
            Visitors currently browsing your website
          </p>
        </div>
        
        <div className="p-6">
          {visitors.length === 0 ? (
            <div className="text-center py-8">
              <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active visitors at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {visitors.map((visitor, index) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 glass-card rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(visitor.userAgent)}
                        <span className="text-sm text-muted-foreground">
                          {getBrowserInfo(visitor.userAgent)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {visitor.city && visitor.country 
                            ? `${visitor.city}, ${visitor.country}`
                            : visitor.country || 'Unknown Location'
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {visitor.page}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(visitor.lastSeen)}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visitor.isActive, visitor.lastSeen)}`}>
                        {visitor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Top Countries */}
      {stats && stats.topCountries.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Countries</h3>
          <div className="space-y-2">
            {stats.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <span className="text-foreground">{country.country}</span>
                <span className="text-muted-foreground">{country.count} visitors</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pages */}
      {stats && stats.topPages.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Most Visited Pages</h3>
          <div className="space-y-2">
            {stats.topPages.slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <span className="text-foreground">{page.page}</span>
                <span className="text-muted-foreground">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
