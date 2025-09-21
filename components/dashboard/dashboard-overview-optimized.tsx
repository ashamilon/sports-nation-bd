'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  User,
  Crown,
  Gift
} from 'lucide-react'
// import { useGlobalLoading } from '@/lib/use-global-loading'

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    country: string
    loyaltyLevel: string
  }
  stats: {
    totalOrders: number
    totalSpent: number
    totalReviews: number
    wishlistCount: number
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
    itemCount: number
    items: Array<{
      name: string
      quantity: number
    }>
  }>
  loyalty: {
    currentLevel: string
    currentConfig: any
    nextConfig: any
    totalOrders: number
    totalSpent: number
    progress: number
  }
}

export default function DashboardOverviewOptimized() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const { withLoading } = useGlobalLoading()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Fetch data without global loading to prevent re-renders
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-1 p-1 pt-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted/50 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-4 rounded-2xl">
                <div className="h-4 bg-muted/30 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted/50 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted/20 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          <div className="glass-card p-4 rounded-2xl">
            <div className="h-6 bg-muted/30 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-1 p-1 pt-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
          <p className="text-muted-foreground mb-6">Error loading dashboard data</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error || 'Unable to load dashboard information'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Orders',
      value: data.stats.totalOrders.toString(),
      change: data.stats.totalOrders > 0 ? `৳${data.stats.totalSpent.toLocaleString()} total spent` : 'No orders yet',
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Wishlist Items',
      value: data.stats.wishlistCount.toString(),
      change: data.stats.wishlistCount > 0 ? 'Items saved for later' : 'No items saved',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Total Spent',
      value: `৳${data.stats.totalSpent.toLocaleString()}`,
      change: data.stats.totalOrders > 0 ? `${data.stats.totalOrders} orders completed` : 'Start shopping!',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Reviews Given',
      value: data.stats.totalReviews.toString(),
      change: data.stats.totalReviews > 0 ? 'Thank you for your feedback!' : 'Share your experience',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'shipped':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-1 p-1 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-foreground">
          Welcome back, {data.user.name || 'User'}!
        </h1>
        <p className="text-muted-foreground text-xs">
          Here's what's happening with your account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="glass-card p-4 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Loyalty Status */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Loyalty Status</h3>
        </div>
        
        <div className="space-y-4">
          {/* Current Level */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4">
              <span className="text-3xl">{data.loyalty.currentConfig.icon}</span>
              <div>
                <h4 className="text-xl font-bold" style={{ color: data.loyalty.currentConfig.color }}>
                  {data.loyalty.currentConfig.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {data.loyalty.currentConfig.discount}৳ discount {data.loyalty.currentLevel === 'bronze' ? 'on first order' : 'on every order'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress to Next Level */}
          {data.loyalty.nextConfig && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to {data.loyalty.nextConfig.name}</span>
                <span className="text-sm text-muted-foreground">
                  {data.loyalty.totalOrders}/{data.loyalty.currentConfig.nextLevelOrders} orders
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(data.loyalty.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete {data.loyalty.currentConfig.nextLevelOrders} orders in 3 months to advance
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{data.loyalty.totalOrders}</div>
              <div className="text-xs text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">৳{data.loyalty.totalSpent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Recent Orders */}
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <Link 
              href="/dashboard/orders"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} • ৳{order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start shopping to see your orders here!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/dashboard/orders"
              className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">View All Orders</p>
                <p className="text-sm text-muted-foreground">Track your order history</p>
              </div>
            </Link>
            
            <Link 
              href="/dashboard/wishlist"
              className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">My Wishlist</p>
                <p className="text-sm text-muted-foreground">View saved items</p>
              </div>
            </Link>
            
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
            >
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Edit Profile</p>
                <p className="text-sm text-muted-foreground">Update your information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
