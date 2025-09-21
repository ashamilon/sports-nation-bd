"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Database,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Users,
  Package,
  ShoppingBag,
  Star,
  FileText,
  BarChart3,
  Shield,
  Globe,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SystemStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalReviews: number
  totalCategories: number
  totalCollections: number
  databaseSize: string
  lastBackup: string
}

export default function OtherManagement() {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPerformingAction, setIsPerformingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      setIsLoading(true)
      // This would typically call an API endpoint to get system statistics
      // For now, we'll simulate the data
      setSystemStats({
        totalUsers: 1250,
        totalProducts: 450,
        totalOrders: 3200,
        totalReviews: 890,
        totalCategories: 12,
        totalCollections: 8,
        databaseSize: '2.4 GB',
        lastBackup: '2024-01-15 10:30 AM'
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
      toast.error('Failed to fetch system statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSystemAction = async (action: string) => {
    setIsPerformingAction(action)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      switch (action) {
        case 'backup':
          toast.success('Database backup completed successfully')
          break
        case 'cache':
          toast.success('Cache cleared successfully')
          break
        case 'logs':
          toast.success('Log files cleaned successfully')
          break
        case 'optimize':
          toast.success('Database optimized successfully')
          break
        case 'reset':
          if (confirm('Are you sure you want to reset all data? This action cannot be undone!')) {
            toast.success('System reset completed')
          }
          break
        default:
          toast.success('Action completed successfully')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      toast.error(`Failed to perform ${action}`)
    } finally {
      setIsPerformingAction(null)
    }
  }

  const systemActions = [
    {
      id: 'backup',
      title: 'Create Database Backup',
      description: 'Create a full backup of the database',
      icon: Database,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      action: () => handleSystemAction('backup')
    },
    {
      id: 'cache',
      title: 'Clear Cache',
      description: 'Clear all cached data and temporary files',
      icon: RefreshCw,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      action: () => handleSystemAction('cache')
    },
    {
      id: 'logs',
      title: 'Clean Log Files',
      description: 'Remove old log files to free up space',
      icon: FileText,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      action: () => handleSystemAction('logs')
    },
    {
      id: 'optimize',
      title: 'Optimize Database',
      description: 'Optimize database performance and clean up',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      action: () => handleSystemAction('optimize')
    },
    {
      id: 'reset',
      title: 'Reset System',
      description: 'Reset all data (DANGEROUS - Use with caution)',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      action: () => handleSystemAction('reset')
    }
  ]

  const quickStats = [
    {
      title: 'Total Users',
      value: systemStats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Total Products',
      value: systemStats?.totalProducts || 0,
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Total Orders',
      value: systemStats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Total Reviews',
      value: systemStats?.totalReviews || 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Other Management</h2>
          <p className="text-muted-foreground">
            System utilities and maintenance tools
          </p>
        </div>
        <button
          onClick={fetchSystemStats}
          className="glass-button p-2 rounded-lg"
          title="Refresh"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border bg-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            System Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Size:</span>
              <span className="font-medium">{systemStats?.databaseSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup:</span>
              <span className="font-medium">{systemStats?.lastBackup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categories:</span>
              <span className="font-medium">{systemStats?.totalCategories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collections:</span>
              <span className="font-medium">{systemStats?.totalCollections}</span>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database Status:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cache Status:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Optimal</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Storage:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Good</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Performance:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="border border-border bg-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Actions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              disabled={isPerformingAction === action.id}
              className={`p-4 border border-border rounded-lg text-left hover:bg-muted/50 transition-colors ${
                isPerformingAction === action.id ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  {isPerformingAction === action.id ? (
                    <RefreshCw className={`h-5 w-5 ${action.color} animate-spin`} />
                  ) : (
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="border border-border bg-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Quick Links
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Package className="h-5 w-5 text-blue-500" />
            <span className="text-foreground">Products</span>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-green-500" />
            <span className="text-foreground">Orders</span>
          </a>
          <a
            href="/admin/customers"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-foreground">Customers</span>
          </a>
          <a
            href="/admin/analytics"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-yellow-500" />
            <span className="text-foreground">Analytics</span>
          </a>
        </div>
      </div>
    </div>
  )
}
