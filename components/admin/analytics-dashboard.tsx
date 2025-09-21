"use client"

import { useState, useEffect } from 'react'
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
  Activity,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    totalProducts: number
    averageOrderValue: number
    revenueChange: number
    ordersChange: number
    customersChange: number
    aovChange: number
  }
  dailySales: Array<{
    date: string
    revenue: number
    orders: number
    customers: number
  }>
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    growth: string
    category: string
    price: number
  }>
  categories: Array<{
    name: string
    value: number
    revenue: number
    color: string
  }>
  customerSegments: Array<{
    segment: string
    count: number
    percentage: number
    color: string
    revenue?: number
  }>
  timeRange: string
  lastUpdated: string
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch analytics data with timeout
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - taking too long to load')), 15000) // 15 second timeout
      })
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(`/api/admin/analytics?range=${timeRange}&metric=${selectedMetric}`),
        timeoutPromise
      ]) as Response
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
        setLastRefresh(new Date())
        if (result.error) {
          console.warn('Analytics API warning:', result.error)
        }
      } else {
        throw new Error(result.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange, selectedMetric])

  // Auto-refresh every 2 minutes (reduced frequency to prevent overload)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalyticsData()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [timeRange, selectedMetric])

  // Generate overview stats from real data
  const overviewStats = analyticsData ? [
    {
      title: 'Total Revenue',
      value: `৳${analyticsData.overview.totalRevenue.toLocaleString()}`,
      change: `${analyticsData.overview.revenueChange >= 0 ? '+' : ''}${analyticsData.overview.revenueChange.toFixed(1)}%`,
      changeType: analyticsData.overview.revenueChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: analyticsData.overview.totalOrders.toLocaleString(),
      change: `${analyticsData.overview.ordersChange >= 0 ? '+' : ''}${analyticsData.overview.ordersChange.toFixed(1)}%`,
      changeType: analyticsData.overview.ordersChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Customers',
      value: analyticsData.overview.totalCustomers.toLocaleString(),
      change: `${analyticsData.overview.customersChange >= 0 ? '+' : ''}${analyticsData.overview.customersChange.toFixed(1)}%`,
      changeType: analyticsData.overview.customersChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Average Order Value',
      value: `৳${analyticsData.overview.averageOrderValue.toLocaleString()}`,
      change: `${analyticsData.overview.aovChange >= 0 ? '+' : ''}${analyticsData.overview.aovChange.toFixed(1)}%`,
      changeType: analyticsData.overview.aovChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
      color: 'text-orange-500'
    }
  ] : []

  const salesData = analyticsData?.dailySales || []

  const topProducts = analyticsData?.topProducts || []
  const categoryData = analyticsData?.categories || []
  const customerSegments = analyticsData?.customerSegments || []

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

  // Loading state
  if (isLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Analytics</h3>
          <p className="text-muted-foreground">Fetching your analytics data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Analytics</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your business performance and insights</p>
          {analyticsData && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh every 2 minutes
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
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
                  <span className="text-muted-foreground">৳{(segment.revenue || 0).toLocaleString()}</span>
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
