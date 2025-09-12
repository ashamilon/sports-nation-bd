"use client"

import { motion } from 'framer-motion'
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
  MapPin
} from 'lucide-react'

export default function DashboardOverview() {
  // Mock data - replace with actual data from API
  const stats = [
    {
      title: 'Total Orders',
      value: '12',
      change: '+2 this month',
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Wishlist Items',
      value: '8',
      change: '+3 this week',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Total Spent',
      value: '৳24,500',
      change: '+৳3,200 this month',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Reviews Given',
      value: '5',
      change: '4.8 avg rating',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-20',
      status: 'delivered',
      total: '৳2,500',
      items: 2,
      tracking: 'BD123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-18',
      status: 'shipped',
      total: '৳1,800',
      items: 1,
      tracking: 'BD123456788'
    },
    {
      id: 'ORD-003',
      date: '2024-01-15',
      status: 'processing',
      total: '৳3,200',
      items: 3,
      tracking: null
    }
  ]

  const wishlistItems = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      price: '৳12,000',
      image: '/api/placeholder/80/80',
      inStock: true
    },
    {
      id: 2,
      name: 'Barcelona Home Jersey 2024',
      price: '৳2,500',
      image: '/api/placeholder/80/80',
      inStock: false
    },
    {
      id: 3,
      name: 'Naviforce Watch NF9028',
      price: '৳8,500',
      image: '/api/placeholder/80/80',
      inStock: true
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
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
      case 'delivered':
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl"
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
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <Link 
              href="/dashboard/orders"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.total}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Wishlist */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Wishlist</h2>
            <Link 
              href="/dashboard/wishlist"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 glass-card rounded-lg">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.price}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    item.inStock 
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <button className="glass-button p-2 rounded-lg">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/products"
            className="glass-button p-4 rounded-lg text-center hover:scale-105 transition-transform"
          >
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium text-foreground">Browse Products</p>
            <p className="text-sm text-muted-foreground">Discover new items</p>
          </Link>
          
          <Link 
            href="/dashboard/profile"
            className="glass-button p-4 rounded-lg text-center hover:scale-105 transition-transform"
          >
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium text-foreground">Update Profile</p>
            <p className="text-sm text-muted-foreground">Manage your info</p>
          </Link>
          
          <Link 
            href="/dashboard/addresses"
            className="glass-button p-4 rounded-lg text-center hover:scale-105 transition-transform"
          >
            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium text-foreground">Manage Addresses</p>
            <p className="text-sm text-muted-foreground">Update shipping info</p>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
