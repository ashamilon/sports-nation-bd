"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Mock data - replace with actual data from API
  const overviewStats = [
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
      title: 'Total Customers',
      value: '892',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Average Order Value',
      value: '৳1,985',
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-orange-500'
    }
  ]

  const salesData = [
    { date: '2024-01-01', revenue: 45000, orders: 23, customers: 18 },
    { date: '2024-01-02', revenue: 52000, orders: 28, customers: 22 },
    { date: '2024-01-03', revenue: 38000, orders: 19, customers: 15 },
    { date: '2024-01-04', revenue: 61000, orders: 32, customers: 25 },
    { date: '2024-01-05', revenue: 48000, orders: 24, customers: 20 },
    { date: '2024-01-06', revenue: 55000, orders: 29, customers: 23 },
    { date: '2024-01-07', revenue: 42000, orders: 21, customers: 17 }
  ]

  const topProducts = [
    {
      name: 'Barcelona Home Jersey 2024',
      sales: 45,
      revenue: 112500,
      growth: '+15.2%',
      category: 'Jerseys'
    },
    {
      name: 'Nike Air Max 270',
      sales: 32,
      revenue: 272000,
      growth: '+8.7%',
      category: 'Sneakers'
    },
    {
      name: 'Real Madrid Away Jersey',
      sales: 28,
      revenue: 78400,
      growth: '+12.1%',
      category: 'Jerseys'
    },
    {
      name: 'Naviforce Watch NF9026',
      sales: 22,
      revenue: 92400,
      growth: '+5.3%',
      category: 'Watches'
    },
    {
      name: 'Manchester United Home Jersey',
      sales: 20,
      revenue: 52000,
      growth: '+18.9%',
      category: 'Jerseys'
    }
  ]

  const categoryData = [
    { name: 'Jerseys', value: 45, revenue: 350000, color: 'bg-blue-500' },
    { name: 'Sneakers', value: 30, revenue: 280000, color: 'bg-green-500' },
    { name: 'Watches', value: 15, revenue: 120000, color: 'bg-purple-500' },
    { name: 'Shorts', value: 7, revenue: 45000, color: 'bg-orange-500' },
    { name: 'Accessories', value: 3, revenue: 25000, color: 'bg-pink-500' }
  ]

  const customerSegments = [
    {
      segment: 'New Customers',
      count: 156,
      percentage: 17.5,
      revenue: 234000,
      color: 'text-blue-500'
    },
    {
      segment: 'Returning Customers',
      count: 456,
      percentage: 51.1,
      revenue: 1234000,
      color: 'text-green-500'
    },
    {
      segment: 'VIP Customers',
      count: 89,
      percentage: 10.0,
      revenue: 567000,
      color: 'text-purple-500'
    },
    {
      segment: 'Inactive Customers',
      count: 191,
      percentage: 21.4,
      revenue: 89000,
      color: 'text-gray-500'
    }
  ]

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ]

  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Time Range:</span>
            <div className="flex items-center space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    timeRange === range.value
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-button hover:bg-accent/50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last updated: 2 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
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
                  <span className="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Sales Trend</h2>
            <div className="flex items-center space-x-2">
              {metrics.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedMetric === metric.value
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-button hover:bg-accent/50'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Bar Chart Representation */}
          <div className="space-y-4">
            {salesData.map((data, index) => {
              const maxValue = Math.max(...salesData.map(d => d[selectedMetric as keyof typeof d] as number))
              const height = ((data[selectedMetric as keyof typeof data] as number) / maxValue) * 100
              
              return (
                <div key={data.date} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-muted-foreground">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 bg-muted/20 rounded-full h-4 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${height}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                    />
                  </div>
                  <div className="w-20 text-sm font-medium text-foreground text-right">
                    {selectedMetric === 'revenue' ? `৳${data.revenue.toLocaleString()}` : 
                     selectedMetric === 'orders' ? data.orders :
                     data.customers}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Category Distribution</h2>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <span className="font-medium text-foreground">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">৳{category.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{category.value}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Top Performing Products</h2>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">৳{product.revenue.toLocaleString()}</p>
                  <div className="flex items-center justify-end">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">{product.growth}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Customer Segments</h2>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <motion.div
                key={segment.segment}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{segment.segment}</span>
                  <span className={`font-semibold ${segment.color}`}>{segment.count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{segment.percentage}% of total</span>
                  <span className="text-muted-foreground">৳{segment.revenue.toLocaleString()}</span>
                </div>
                <div className="mt-2 bg-muted/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percentage}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${segment.color.replace('text-', 'from-')} to-${segment.color.replace('text-', '')}/80 rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
