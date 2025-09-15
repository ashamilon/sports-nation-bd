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
  Star
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
}

interface RecentOrder {
  id: string
  customer: string
  product: string
  amount: string
  status: string
  date: string
}

interface TopProduct {
  name: string
  sales: number
  revenue: string
  image: string
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/orders?limit=4'),
        fetch('/api/admin/products?limit=4&sortBy=sales')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData.orders || [])
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setTopProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      change: '+0%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-purple-500'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-orange-500'
    }
  ]

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
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/products/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </motion.button>
          </Link>
          <Link href="/admin/orders">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View All Orders</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-card p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
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
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
          ))
        )}
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
            <Link href="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div>
                      <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                      <div className="h-3 w-32 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                    <div className="h-6 w-20 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
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
                    <span className="font-medium text-foreground">{order.id}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.amount}</p>
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
                <p className="text-sm text-muted-foreground">Orders will appear here once customers start shopping</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Top Products</h2>
            <Link href="/admin/products" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-muted rounded mb-1"></div>
                    <div className="h-3 w-20 bg-muted rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                    <div className="h-3 w-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{product.revenue}</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground ml-1">4.8</span>
                  </div>
                </div>
              </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet</p>
                <p className="text-sm text-muted-foreground">Add products to see them here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products/new">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-4 rounded-lg text-center hover:bg-accent/50 transition-colors"
            >
              <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">Add Product</p>
              <p className="text-sm text-muted-foreground">Create new product</p>
            </motion.div>
          </Link>
          <Link href="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-4 rounded-lg text-center hover:bg-accent/50 transition-colors"
            >
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">Manage Orders</p>
              <p className="text-sm text-muted-foreground">Process orders</p>
            </motion.div>
          </Link>
          <Link href="/admin/customers">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-4 rounded-lg text-center hover:bg-accent/50 transition-colors"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">View Customers</p>
              <p className="text-sm text-muted-foreground">Customer management</p>
            </motion.div>
          </Link>
          <Link href="/admin/analytics">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-4 rounded-lg text-center hover:bg-accent/50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">View Analytics</p>
              <p className="text-sm text-muted-foreground">Sales insights</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
