"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Download,
  Printer,
  MapPin
} from 'lucide-react'
import CourierSelector from './courier-selector'

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<string | null>(null)
  const [showCourierSelector, setShowCourierSelector] = useState(false)

  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled']

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
      case 'refunded':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
      case 'failed':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    const id = parseInt(orderId.replace('ORD-', ''))
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => parseInt(order.id.replace('ORD-', ''))))
    }
  }

  const handleAssignCourier = (orderId: string) => {
    setSelectedOrderForCourier(orderId)
    setShowCourierSelector(true)
  }

  const handleCourierUpdate = (courierService: string, trackingId: string) => {
    // Update the order in the local state
    // In a real app, this would be handled by the API response
    setShowCourierSelector(false)
    setSelectedOrderForCourier(null)
  }

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0)

  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const processingOrders = orders.filter(order => order.status === 'processing').length
  const completedOrders = orders.filter(order => order.status === 'completed').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Orders</h3>
          <p className="text-muted-foreground">Fetching your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print Orders</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-500">৳{totalRevenue.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-blue-500">{processingOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{completedOrders}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 py-2 rounded-lg w-full md:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input px-4 py-2 rounded-lg"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedOrders.length} selected
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-3 py-1 rounded-lg text-sm text-red-500 hover:bg-red-500/10"
              >
                Bulk Actions
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Order ID</th>
                <th className="text-left p-4 font-medium text-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-foreground">Items</th>
                <th className="text-left p-4 font-medium text-foreground">Total</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Payment</th>
                <th className="text-left p-4 font-medium text-foreground">Courier</th>
                <th className="text-left p-4 font-medium text-foreground">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(parseInt(order.id.replace('ORD-', '')))}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-muted-foreground">Track: {order.trackingNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="text-sm">
                          <p className="text-foreground">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity} × ৳{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">৳{order.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.courierService ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          <Truck className="w-3 h-3 mr-1" />
                          {order.courierService}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {order.courierTrackingId}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not assigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground">{order.orderDate}</p>
                      {order.deliveryDate && (
                        <p className="text-sm text-muted-foreground">Delivered: {order.deliveryDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      {!order.courierService && order.status !== 'cancelled' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAssignCourier(order.id)}
                          className="glass-button p-2 rounded-lg text-blue-600 hover:bg-blue-500/10"
                          title="Assign Courier"
                        >
                          <MapPin className="h-4 w-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 rounded-lg"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-3 py-2 rounded-lg text-sm"
          >
            Previous
          </motion.button>
          <span className="px-3 py-2 text-sm text-foreground">1</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-3 py-2 rounded-lg text-sm"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* Courier Selector Modal */}
      {showCourierSelector && selectedOrderForCourier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assign Courier Service
                </h3>
                <button
                  onClick={() => setShowCourierSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <CourierSelector
                orderId={selectedOrderForCourier}
                orderData={orders.find(order => order.id === selectedOrderForCourier)}
                currentCourier={orders.find(order => order.id === selectedOrderForCourier)?.courierService}
                currentTrackingId={orders.find(order => order.id === selectedOrderForCourier)?.courierTrackingId}
                onCourierUpdate={handleCourierUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
