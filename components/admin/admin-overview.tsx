"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
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

export default function AdminOverview() {
  // Mock data - replace with actual data from API
  const stats = [
    {
      title: 'Total Revenue',
      value: '৳2,450,000',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Products',
      value: '156',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-purple-500'
    },
    {
      title: 'Total Customers',
      value: '892',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-orange-500'
    }
  ]

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      product: 'Barcelona Home Jersey 2024',
      amount: '৳2,500',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Wilson',
      product: 'Nike Air Max 270',
      amount: '৳8,500',
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      product: 'Real Madrid Away Jersey',
      amount: '৳2,800',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: '#ORD-004',
      customer: 'Emma Davis',
      product: 'Naviforce Watch NF9026',
      amount: '৳4,200',
      status: 'shipped',
      date: '2024-01-14'
    }
  ]

  const topProducts = [
    {
      name: 'Barcelona Home Jersey 2024',
      sales: 45,
      revenue: '৳112,500',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Nike Air Max 270',
      sales: 32,
      revenue: '৳272,000',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Real Madrid Away Jersey',
      sales: 28,
      revenue: '৳78,400',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Naviforce Watch NF9026',
      sales: 22,
      revenue: '৳92,400',
      image: '/api/placeholder/60/60'
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
        {stats.map((stat, index) => (
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
            <Link href="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
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
            ))}
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
            {topProducts.map((product, index) => (
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
            ))}
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
