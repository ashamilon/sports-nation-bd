"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  User,
  Crown,
  Gift
} from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    country: string | null
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
    currentConfig: {
      name: string
      icon: string
      color: string
      discount: number
      nextLevel: string | null
      nextLevelOrders: number | null
    }
    nextConfig: {
      name: string
      icon: string
      color: string
      discount: number
      nextLevel: string | null
      nextLevelOrders: number | null
    } | null
    totalOrders: number
    totalSpent: number
    progress: number
  }
}

export default function DashboardOverviewSimple() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const dashboardData = await response.json()
        
        if (isMounted) {
          setData(dashboardData)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching dashboard data:', err)
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [isClient])

  if (!isClient || loading) {
    return (
      <div className="space-y-1 p-1 pt-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-xl">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="glass-button px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Unable to load dashboard data</p>
        </div>
      </div>
    )
  }

  const statsData = data ? [
    {
      title: 'Total Orders',
      value: data.stats.totalOrders.toLocaleString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Spent',
      value: `৳${data.stats.totalSpent.toLocaleString()}`,
      change: '+0%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Loyalty Level',
      value: data.loyalty.currentConfig.name,
      change: `${data.loyalty.currentConfig.discount}৳ discount`,
      changeType: 'positive' as const,
      icon: Crown,
      color: 'text-purple-500'
    },
    {
      title: 'Wishlist Items',
      value: data.stats.wishlistCount.toLocaleString(),
      change: 'Saved',
      changeType: 'positive' as const,
      icon: User,
      color: 'text-orange-500'
    }
  ] : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'processing':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
      case 'shipped':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />
      case 'shipped':
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-1 p-1 pt-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Welcome back, {data?.user?.name || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data?.recentOrders?.length > 0 ? (
              data.recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium text-foreground">{order.orderNumber}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">৳{order.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground">Your orders will appear here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loyalty Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Loyalty Status</h2>
            <Crown className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {data?.loyalty?.currentConfig?.icon} {data?.loyalty?.currentConfig?.name || 'Bronze'}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {data?.loyalty?.currentConfig?.discount || 0}৳ discount available
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(data?.loyalty?.progress || 0, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {data?.loyalty?.nextConfig ? `${Math.round(data.loyalty.progress)}% to ${data.loyalty.nextConfig.name}` : 'Max level reached'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
