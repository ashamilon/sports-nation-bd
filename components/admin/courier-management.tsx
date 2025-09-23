'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw
} from 'lucide-react'
import LoadingSpinner from '@/components/loading-spinner'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  user: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    area: string
  }
  items: Array<{
    id: string
    quantity: number
    product: {
      name: string
      weight: number
    }
  }>
  courierService?: string
  courierTrackingId?: string
}

export default function CourierManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders:', response.status)
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  // Create courier order
  const createCourierOrder = async (orderId: string) => {
    try {
      console.log('Creating courier order for:', orderId)
      console.log('Calling API endpoint: /api/courier')
      
      const response = await fetch('/api/courier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId })
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        toast.success('Courier order created successfully!')
        fetchOrders() // Refresh orders
      } else {
        console.error('API returned error:', data)
        toast.error(data.message || 'Failed to create courier order')
      }
    } catch (error) {
      console.error('Error creating courier order:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      })
      toast.error('Failed to create courier order')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'processing':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
      case 'shipped':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20'
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
      case 'cancelled':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading courier orders..." />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Courier Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage courier orders and track shipments
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Orders ({orders.length})
            </h2>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Courier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.courierService ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.courierService}
                          </div>
                          {order.courierTrackingId && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {order.courierTrackingId}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!order.courierService && order.status !== 'cancelled' ? (
                        <button
                          onClick={() => createCourierOrder(order.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Create Courier Order
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {order.courierService ? 'Assigned' : 'N/A'}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


